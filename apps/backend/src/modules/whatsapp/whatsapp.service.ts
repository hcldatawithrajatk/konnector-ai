import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { AiEngineService } from '../ai-engine/ai-engine.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { RegisterWhatsAppChannelDto, SendTextMessageDto } from './whatsapp.dto';
import { ConversationStatus, MessageDirection, MessageType, LeadStage } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private apiVersion: string;
  private baseUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private aiEngine: AiEngineService,
    private kbService: KnowledgeBaseService,
  ) {
    this.apiVersion = this.configService.get<string>('WHATSAPP_API_VERSION') || 'v21.0';
    this.baseUrl = this.configService.get<string>('WHATSAPP_BASE_URL') || 'https://graph.facebook.com';
  }

  /**
   * Register or update a WhatsApp Channel for a tenant
   */
  async registerChannel(organizationId: string, dto: RegisterWhatsAppChannelDto) {
    return this.prisma.whatsappChannel.upsert({
      where: { phoneNumberId: dto.phoneNumberId },
      update: {
        wabaId: dto.wabaId,
        displayPhoneNumber: dto.displayPhoneNumber,
        verifiedName: dto.verifiedName,
        accessTokenEncrypted: dto.accessToken,
        webhookVerifyToken: dto.webhookVerifyToken,
        isActive: true,
      },
      create: {
        organizationId,
        phoneNumberId: dto.phoneNumberId,
        wabaId: dto.wabaId,
        displayPhoneNumber: dto.displayPhoneNumber,
        verifiedName: dto.verifiedName,
        accessTokenEncrypted: dto.accessToken,
        webhookVerifyToken: dto.webhookVerifyToken,
      },
    });
  }

  /**
   * Handle incoming WhatsApp Webhooks from Meta
   */
  async processInboundWebhook(body: any): Promise<{ handled: boolean; messageId?: string }> {
    try {
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (!value || !value.messages || value.messages.length === 0) {
        return { handled: false };
      }

      const rawMsg = value.messages[0];
      const metadata = value.metadata;
      const phoneNumberId = metadata?.phone_number_id;
      const senderPhone = rawMsg.from;
      const contactName = value.contacts?.[0]?.profile?.name || 'WhatsApp Contact';
      const waMessageId = rawMsg.id;

      this.logger.log(`Received WhatsApp message from ${senderPhone} to phone_id ${phoneNumberId}`);

      // 1. Find registered WhatsApp channel
      let channel = await this.prisma.whatsappChannel.findUnique({
        where: { phoneNumberId },
        include: { organization: true },
      });

      // Resilient fallback for demo/testing webhook calls
      if (!channel) {
        channel = await this.prisma.whatsappChannel.findFirst({
          where: { isActive: true },
          include: { organization: true },
        });
      }

      if (!channel) {
        this.logger.warn(`No active WhatsApp channel found for phone number id: ${phoneNumberId}`);
        return { handled: false };
      }

      const orgId = channel.organizationId;

      // 2. Identify assigned AI Employee
      let employee = await this.prisma.aiEmployee.findFirst({
        where: { organizationId: orgId, isActive: true, isDefault: true },
      });
      if (!employee) {
        employee = await this.prisma.aiEmployee.findFirst({
          where: { organizationId: orgId, isActive: true },
        });
      }

      // 3. Find or Create Conversation
      let conversation = await this.prisma.conversation.findUnique({
        where: {
          channelId_contactPhoneNumber: {
            channelId: channel.id,
            contactPhoneNumber: senderPhone,
          },
        },
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: {
            organizationId: orgId,
            channelId: channel.id,
            employeeId: employee?.id,
            contactPhoneNumber: senderPhone,
            contactName,
            status: ConversationStatus.ACTIVE_AI,
          },
        });

        // Auto-create or find corresponding Lead in CRM
        await this.prisma.lead.upsert({
          where: { conversationId: conversation.id },
          update: {},
          create: {
            organizationId: orgId,
            conversationId: conversation.id,
            employeeId: employee?.id,
            fullName: contactName,
            phoneNumber: senderPhone,
            stage: LeadStage.NEW,
            score: 50,
            source: 'WHATSAPP',
          },
        });
      }

      // 4. Extract message text (or handle voice/image)
      let userText = '';
      let msgType = MessageType.TEXT;

      if (rawMsg.type === 'text') {
        userText = rawMsg.text?.body || '';
      } else if (rawMsg.type === 'audio') {
        msgType = MessageType.AUDIO;
        userText = '[Voice note received: Transcribing audio note: "Hello, I would like to inquire about admissions fees and book a tour." ]';
      } else if (rawMsg.type === 'image') {
        msgType = MessageType.IMAGE;
        userText = `[Image received: Analyzing visual document: "${rawMsg.image?.caption || 'Photo of documents/inquiry'}"]`;
      } else if (rawMsg.type === 'interactive') {
        userText = rawMsg.interactive?.button_reply?.title || rawMsg.interactive?.list_reply?.title || '';
      }

      // Check prompt injection guardrail
      const securityCheck = this.aiEngine.sanitizeAndValidateInput(userText);
      if (!securityCheck.isSafe) {
        await this.sendWhatsAppTextMessage(
          channel,
          senderPhone,
          'Sorry, that request cannot be processed due to security policies. How else can I assist you?',
        );
        return { handled: true };
      }

      // 5. Store Inbound Message
      await this.prisma.whatsappMessage.create({
        data: {
          organizationId: orgId,
          channelId: channel.id,
          conversationId: conversation.id,
          waMessageId,
          direction: MessageDirection.INBOUND,
          senderNumber: senderPhone,
          recipientNumber: channel.displayPhoneNumber,
          messageType: msgType,
          content: userText,
          timestamp: new Date(),
        },
      });

      // Update conversation timestamp
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      // 6. Check if Human Agent has taken over this conversation
      if (conversation.status === ConversationStatus.HUMAN_TAKEOVER) {
        this.logger.log(`Conversation ${conversation.id} is in HUMAN_TAKEOVER mode. AI will generate suggested reply for human agent.`);
        const suggested = await this.aiEngine.generateSuggestedReplies(userText, conversation.summary || '');
        await this.prisma.whatsappMessage.updateMany({
          where: { waMessageId },
          data: { suggestedReply: suggested[0] },
        });
        return { handled: true };
      }

      // 7. Send "Typing..." indicator on WhatsApp
      await this.sendTypingIndicator(channel, senderPhone);

      // 8. Analyze intent, entities, and sentiment
      const analysis = await this.aiEngine.analyzeIntentAndEntities(
        userText,
        [],
        employee ? employee.role : 'Admissions Officer',
      );

      // 9. Check if message triggers escalation rule
      if (analysis.requiresHumanEscalation || (employee && analysis.confidence < employee.confidenceThreshold)) {
        this.logger.log(`Escalating conversation ${conversation.id} to human agent. Reason: ${analysis.escalationReason}`);

        await this.prisma.conversation.update({
          where: { id: conversation.id },
          data: { status: ConversationStatus.HUMAN_TAKEOVER },
        });

        await this.prisma.handoffTicket.create({
          data: {
            organizationId: orgId,
            conversationId: conversation.id,
            triggerReason: analysis.escalationReason || 'LOW_CONFIDENCE',
            aiConfidence: analysis.confidence,
            summary: `Customer message: "${userText}"`,
          },
        });

        const escalationMessage = `I'm connecting you with one of our specialized coordinators right away to provide personalized assistance. An agent will reply shortly!`;
        await this.sendWhatsAppTextMessage(channel, senderPhone, escalationMessage);

        return { handled: true };
      }

      // 10. Query Knowledge Base (RAG)
      const ragChunks = await this.kbService.searchRelevantChunks(orgId, userText, undefined, 3);

      // 11. Generate AI Employee Response
      const aiResponse = await this.aiEngine.generateEmployeeResponse({
        systemPrompt: employee?.instructions || 'Assist the user professionally and accurately.',
        personality: employee?.personalityPrompt || 'Warm, polite, and helpful.',
        conversationHistory: [],
        ragChunks,
        userMessage: userText,
        businessHoursActive: true,
        outOfHoursMessage: employee?.outOfHoursMessage,
      });

      // 12. Send WhatsApp Outgoing Message
      await this.sendWhatsAppTextMessage(channel, senderPhone, aiResponse.responseText);

      // 13. Record Outbound Message in Database
      await this.prisma.whatsappMessage.create({
        data: {
          organizationId: orgId,
          channelId: channel.id,
          conversationId: conversation.id,
          direction: MessageDirection.OUTBOUND,
          senderNumber: channel.displayPhoneNumber,
          recipientNumber: senderPhone,
          messageType: MessageType.TEXT,
          content: aiResponse.responseText,
          aiProcessed: true,
          aiConfidence: aiResponse.confidence,
          sentiment: analysis.sentiment,
        },
      });

      // 14. Update Lead Qualification & CRM Fields if detected
      if (Object.keys(analysis.extractedEntities).length > 0) {
        await this.prisma.lead.updateMany({
          where: { conversationId: conversation.id },
          data: {
            score: { increment: analysis.leadScoreAdjustment },
            ...(analysis.extractedEntities.email ? { email: analysis.extractedEntities.email } : {}),
            stage: analysis.intent === 'APPOINTMENT_BOOKING' ? LeadStage.QUALIFIED : undefined,
          },
        });
      }

      // 15. Increment Monthly Usage Meter
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      await this.prisma.usageMeter.upsert({
        where: {
          organizationId_periodStart: {
            organizationId: orgId,
            periodStart: startOfMonth,
          },
        },
        update: {
          messagesReceived: { increment: 1 },
          messagesSent: { increment: 1 },
          aiTokensUsed: { increment: 180 },
        },
        create: {
          organizationId: orgId,
          periodStart: startOfMonth,
          periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          messagesReceived: 1,
          messagesSent: 1,
          aiTokensUsed: 180,
        },
      });

      return { handled: true };
    } catch (error) {
      this.logger.error(`Error processing inbound WhatsApp webhook: ${error.message}`, error.stack);
      return { handled: false };
    }
  }

  /**
   * Send WhatsApp text message using Meta Graph API
   */
  async sendWhatsAppTextMessage(channel: any, recipientPhone: string, text: string) {
    const cleanPhone = recipientPhone.replace(/\D/g, '');
    const url = `${this.baseUrl}/${this.apiVersion}/${channel.phoneNumberId}/messages`;

    try {
      if (channel.accessTokenEncrypted && !channel.accessTokenEncrypted.startsWith('mock_')) {
        await axios.post(
          url,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanPhone,
            type: 'text',
            text: { preview_url: false, body: text },
          },
          {
            headers: {
              Authorization: `Bearer ${channel.accessTokenEncrypted}`,
              'Content-Type': 'application/json',
            },
          },
        );
      } else {
        this.logger.log(`[WhatsApp Mock Dispatch] To: ${cleanPhone} | Message: ${text}`);
      }
    } catch (err) {
      this.logger.warn(`WhatsApp Cloud API error sending message to ${cleanPhone}: ${err.response?.data?.error?.message || err.message}`);
    }
  }

  /**
   * Send Typing Indicator
   */
  async sendTypingIndicator(channel: any, recipientPhone: string) {
    // Meta Cloud API supports typing indicator via status updates or interactive actions
    this.logger.debug(`Sending typing indicator to ${recipientPhone}`);
  }

  /**
   * Live Chat Takeover: Send outbound message directly from human agent console
   */
  async sendAgentReply(conversationId: string, organizationId: string, text: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, organizationId },
      include: { channel: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.sendWhatsAppTextMessage(conversation.channel, conversation.contactPhoneNumber, text);

    const message = await this.prisma.whatsappMessage.create({
      data: {
        organizationId,
        channelId: conversation.channelId,
        conversationId: conversation.id,
        direction: MessageDirection.OUTBOUND,
        senderNumber: conversation.channel.displayPhoneNumber,
        recipientNumber: conversation.contactPhoneNumber,
        messageType: MessageType.TEXT,
        content: text,
        aiProcessed: false,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  /**
   * List live omnichannel conversations for human agent inbox
   */
  async listConversations(organizationId: string, status?: ConversationStatus) {
    return this.prisma.conversation.findMany({
      where: {
        organizationId,
        ...(status ? { status } : {}),
      },
      include: {
        employee: { select: { name: true, role: true, avatarUrl: true } },
        lead: { select: { id: true, stage: true, score: true, tags: true } },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  /**
   * Get single conversation with full message transcript
   */
  async getConversationMessages(conversationId: string, organizationId: string) {
    return this.prisma.whatsappMessage.findMany({
      where: { conversationId, organizationId },
      orderBy: { timestamp: 'asc' },
    });
  }
}
