import { Test, TestingModule } from '@nestjs/testing';
import { FollowUpsService } from './follow-ups.service';
import { PrismaService } from '../database/prisma.service';
import { SequenceStatus } from '@prisma/client';

describe('FollowUpsService', () => {
  let service: FollowUpsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      followUpSequence: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      sequenceExecution: {
        create: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowUpsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FollowUpsService>(FollowUpsService);
  });

  describe('Sequence Builder & Multi-Day Steps', () => {
    it('should create a 4-step sequence (Day 1, 3, 7, 14) with stop conditions enabled', async () => {
      const orgId = 'org-seq-test';
      const dto = {
        name: 'Parent 14-Day Nurture Flow',
        description: 'Automated campus tour follow-ups',
        triggerEvent: 'LEAD_CREATED',
        stopOnReply: true,
        stopOnBooking: true,
        steps: [
          { stepOrder: 1, delayHours: 24, messageTemplate: 'Hi {{name}}, here is our video tour!' },
          { stepOrder: 2, delayHours: 72, messageTemplate: 'Hello {{name}}, what grade are you interested in?' },
          { stepOrder: 3, delayHours: 168, messageTemplate: 'Admissions for Cambridge are 80% full.' },
          { stepOrder: 4, delayHours: 336, messageTemplate: 'Closing your inquiry for now. Have a great day!' },
        ],
      };

      prismaMock.followUpSequence.create.mockResolvedValue({
        id: 'seq-1',
        organizationId: orgId,
        ...dto,
      });

      const sequence = await service.createSequence(orgId, dto as any);

      expect(sequence).toBeDefined();
      expect(sequence.steps.length).toBe(4);
      expect(sequence.stopOnReply).toBe(true);
      expect(sequence.stopOnBooking).toBe(true);
    });
  });

  describe('Stop Conditions Enforcement', () => {
    it('should halt all active sequences when customer replies on WhatsApp', async () => {
      const leadId = 'lead-123';

      prismaMock.sequenceExecution.updateMany.mockResolvedValue({ count: 2 });

      await service.handleCustomerReply(leadId);

      expect(prismaMock.sequenceExecution.updateMany).toHaveBeenCalledWith({
        where: {
          leadId,
          status: SequenceStatus.ACTIVE,
          sequence: { stopOnReply: true },
        },
        data: {
          status: SequenceStatus.STOPPED_REPLIED,
        },
      });
    });

    it('should halt all active sequences when customer books an appointment', async () => {
      const leadId = 'lead-123';

      prismaMock.sequenceExecution.updateMany.mockResolvedValue({ count: 1 });

      await service.handleAppointmentBooked(leadId);

      expect(prismaMock.sequenceExecution.updateMany).toHaveBeenCalledWith({
        where: {
          leadId,
          status: SequenceStatus.ACTIVE,
          sequence: { stopOnBooking: true },
        },
        data: {
          status: SequenceStatus.STOPPED_BOOKED,
        },
      });
    });
  });
});
