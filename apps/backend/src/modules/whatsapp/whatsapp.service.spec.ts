import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppService } from './whatsapp.service';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AiEngineService } from '../ai-engine/ai-engine.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';

describe('WhatsAppService', () => {
  let service: WhatsAppService;
  let prismaMock: any;
  let aiEngineMock: any;
  let kbServiceMock: any;

  beforeEach(async () => {
    prismaMock = {
      whatsappChannel: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
      conversation: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      whatsappMessage: {
        create: jest.fn(),
      },
      usageMeter: {
        updateMany: jest.fn(),
      },
    };

    aiEngineMock = {
      sanitizeAndValidateInput: jest.fn().mockReturnValue({ isSafe: true, sanitizedText: 'hello' }),
      analyzeIntentAndEntities: jest.fn().mockResolvedValue({
        intent: 'GENERAL_INQUIRY',
        confidence: 0.95,
        sentiment: 'POSITIVE',
        extractedEntities: {},
        leadScoreAdjustment: 5,
        requiresHumanEscalation: false,
      }),
      generateAutonomousResponse: jest.fn().mockResolvedValue('Hello! How can I assist you today?'),
      generateSuggestedReplies: jest.fn().mockResolvedValue(['Can I help you book a visit?']),
    };

    kbServiceMock = {
      searchRelevantChunks: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsAppService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'WHATSAPP_API_VERSION') return 'v21.0';
              if (key === 'WHATSAPP_BASE_URL') return 'https://graph.facebook.com';
              return null;
            }),
          },
        },
        { provide: AiEngineService, useValue: aiEngineMock },
        { provide: KnowledgeBaseService, useValue: kbServiceMock },
      ],
    }).compile();

    service = module.get<WhatsAppService>(WhatsAppService);
  });

  describe('Channel Management', () => {
    it('should register or update WhatsApp phone number and WABA ID', async () => {
      const orgId = 'org-wa-test';
      const dto = {
        phoneNumberId: '108492039485721',
        wabaId: 'WABA_EDU_9921',
        displayPhoneNumber: '+1 (555) 019-2831',
        verifiedName: 'GreenField Academy',
        accessToken: 'EAAG_fake_token',
        webhookVerifyToken: 'konnector_secure_verify_token_2026',
      };

      prismaMock.whatsappChannel.upsert.mockResolvedValue({
        id: 'chan-1',
        organizationId: orgId,
        ...dto,
      });

      const channel = await service.registerChannel(orgId, dto);

      expect(channel).toBeDefined();
      expect(channel.phoneNumberId).toBe('108492039485721');
      expect(channel.wabaId).toBe('WABA_EDU_9921');
    });
  });

  describe('Inbound Webhook Parsing', () => {
    it('should handle incoming standard Meta WhatsApp text message', async () => {
      const metaWebhookPayload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'WABA_EDU_9921',
            changes: [
              {
                field: 'messages',
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '15550192831',
                    phone_number_id: '108492039485721',
                  },
                  contacts: [
                    {
                      profile: { name: 'Sarah Vance' },
                      wa_id: '15559871234',
                    },
                  ],
                  messages: [
                    {
                      from: '15559871234',
                      id: 'wamid.HBgLMTU1NTk4NzEyMzQVAgASGBQzQT',
                      timestamp: '1728300000',
                      text: { body: 'Hello, what are your school hours?' },
                      type: 'text',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      prismaMock.whatsappChannel.findUnique.mockResolvedValue({
        id: 'chan-1',
        organizationId: 'org-wa-test',
        phoneNumberId: '108492039485721',
        accessTokenEncrypted: 'mock-token',
        defaultEmployee: {
          id: 'emp-1',
          name: 'Maya',
          instructions: 'Help prospective parents',
          voiceTone: 'Warm & Professional',
          confidenceThreshold: 0.75,
        },
      });

      prismaMock.conversation.findFirst.mockResolvedValue(null);
      prismaMock.conversation.create.mockResolvedValue({
        id: 'conv-1',
        organizationId: 'org-wa-test',
        channelId: 'chan-1',
        contactPhoneNumber: '15559871234',
        contactName: 'Sarah Vance',
        status: 'ACTIVE_AI',
      });

      prismaMock.whatsappMessage.create.mockResolvedValue({});
      prismaMock.conversation.update.mockResolvedValue({});
      prismaMock.usageMeter.updateMany.mockResolvedValue({});

      const result = await service.processInboundWebhook(metaWebhookPayload);

      expect(result.handled).toBe(true);
      expect(result.messageId).toBe('wamid.HBgLMTU1NTk4NzEyMzQVAgASGBQzQT');
    });
  });
});
