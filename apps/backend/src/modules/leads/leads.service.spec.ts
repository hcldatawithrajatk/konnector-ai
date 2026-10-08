import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../database/prisma.service';
import { LeadStage } from '@prisma/client';

describe('LeadsService', () => {
  let service: LeadsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      lead: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      leadActivity: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  describe('Lead Creation & Lifecycle', () => {
    it('should create a new lead with default NEW stage and 50 points', async () => {
      const orgId = 'org-leads-test';
      const dto = {
        fullName: 'Alexander Wright',
        phoneNumber: '+15551234567',
        email: 'alex.wright@example.com',
        intentSummary: 'Parent looking for Grade 6 Cambridge admission',
        tags: ['Grade 6', 'Cambridge'],
      };

      prismaMock.lead.create.mockResolvedValue({
        id: 'lead-1',
        organizationId: orgId,
        stage: LeadStage.NEW,
        score: 50,
        source: 'WHATSAPP',
        ...dto,
      });

      prismaMock.leadActivity.create.mockResolvedValue({});

      const lead = await service.createLead(orgId, dto);

      expect(lead).toBeDefined();
      expect(lead.stage).toBe(LeadStage.NEW);
      expect(lead.score).toBe(50);
      expect(prismaMock.leadActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            activityType: 'LEAD_CREATED',
            performedBy: 'SYSTEM',
          }),
        }),
      );
    });

    it('should update lead stage and append activity timeline log', async () => {
      const orgId = 'org-leads-test';
      const leadId = 'lead-1';

      prismaMock.lead.findFirst.mockResolvedValue({
        id: leadId,
        organizationId: orgId,
        fullName: 'Alexander Wright',
        stage: LeadStage.NEW,
      });

      prismaMock.lead.update.mockResolvedValue({
        id: leadId,
        stage: LeadStage.QUALIFIED,
      });

      prismaMock.leadActivity.create.mockResolvedValue({});

      const updated = await service.updateLeadStage(leadId, orgId, {
        stage: LeadStage.QUALIFIED,
        note: 'Customer confirmed budget and target enrollment semester',
      });

      expect(updated.stage).toBe(LeadStage.QUALIFIED);
      expect(prismaMock.leadActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            activityType: 'STAGE_CHANGED',
          }),
        }),
      );
    });
  });

  describe('Lead Metrics & Conversion Tracking', () => {
    it('should compute lead conversion rate and qualification rate', async () => {
      const orgId = 'org-leads-test';

      prismaMock.lead.count.mockImplementation(({ where }: any) => {
        if (!where?.stage) return 100; // total leads
        if (where?.stage === LeadStage.NEW) return 20;
        if (where?.stage === LeadStage.QUALIFIED) return 40;
        if (where?.stage === LeadStage.APPOINTMENT_SCHEDULED) return 25;
        if (where?.stage === LeadStage.WON) return 15;
        return 0;
      });

      const metrics = await service.getLeadMetrics(orgId);

      expect(metrics.totalLeads).toBe(100);
      expect(metrics.qualificationRate).toBe('80.0%');
      expect(metrics.conversionRate).toBe('15.0%');
    });
  });
});
