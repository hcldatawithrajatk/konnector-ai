import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TakeoverConversationDto, ReturnToAiDto } from './human-handoff.dto';
import { ConversationStatus } from '@prisma/client';

@Injectable()
export class HumanHandoffService {
  private readonly logger = new Logger(HumanHandoffService.name);

  constructor(private prisma: PrismaService) {}

  async listPendingTickets(organizationId: string) {
    return this.prisma.handoffTicket.findMany({
      where: { organizationId, status: 'PENDING' },
      include: {
        conversation: {
          include: {
            employee: { select: { name: true, role: true } },
            lead: { select: { id: true, fullName: true, phoneNumber: true, stage: true } },
            messages: {
              take: 5,
              orderBy: { timestamp: 'desc' },
            },
          },
        },
      },
      orderBy: { escalatedAt: 'desc' },
    });
  }

  async takeoverConversation(
    conversationId: string,
    organizationId: string,
    agentId: string,
    dto: TakeoverConversationDto,
  ) {
    const conv = await this.prisma.conversation.findFirst({
      where: { id: conversationId, organizationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    // Switch to HUMAN_TAKEOVER
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.HUMAN_TAKEOVER,
        assignedAgentId: agentId,
      },
    });

    // Update or create ticket
    await this.prisma.handoffTicket.updateMany({
      where: { conversationId, status: 'PENDING' },
      data: {
        status: 'ASSIGNED',
        assignedAgentId: agentId,
        agentNotes: dto.notes,
      },
    });

    return { success: true, status: ConversationStatus.HUMAN_TAKEOVER };
  }

  async returnToAi(
    conversationId: string,
    organizationId: string,
    dto: ReturnToAiDto,
  ) {
    const conv = await this.prisma.conversation.findFirst({
      where: { id: conversationId, organizationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    // Return to ACTIVE_AI
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.ACTIVE_AI,
      },
    });

    await this.prisma.handoffTicket.updateMany({
      where: { conversationId, status: { in: ['PENDING', 'ASSIGNED'] } },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        agentNotes: dto.resolutionNotes,
      },
    });

    return { success: true, status: ConversationStatus.ACTIVE_AI };
  }
}
