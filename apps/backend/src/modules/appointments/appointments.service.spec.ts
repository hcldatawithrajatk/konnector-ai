import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../database/prisma.service';
import { AppointmentStatus, LeadStage } from '@prisma/client';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      appointment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      lead: {
        update: jest.fn(),
      },
      leadActivity: {
        create: jest.fn(),
      },
      usageMeter: {
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  describe('Appointment Creation & Lead Stage Promotion', () => {
    it('should create an appointment and advance lead stage to APPOINTMENT_SCHEDULED', async () => {
      const orgId = 'org-apt-test';
      const dto = {
        leadId: 'lead-123',
        title: 'Campus Tour - Vance Family',
        startTime: '2026-10-15T10:00:00Z',
        endTime: '2026-10-15T10:45:00Z',
        attendeeName: 'Robert Vance',
        attendeePhone: '+15559871234',
        attendeeEmail: 'robert@vance.com',
      };

      prismaMock.appointment.create.mockResolvedValue({
        id: 'apt-1',
        organizationId: orgId,
        status: AppointmentStatus.SCHEDULED,
        meetingLink: 'https://meet.google.com/knc-test-meet',
        ...dto,
      });

      prismaMock.lead.update.mockResolvedValue({});
      prismaMock.leadActivity.create.mockResolvedValue({});
      prismaMock.usageMeter.updateMany.mockResolvedValue({});

      const apt = await service.createAppointment(orgId, dto);

      expect(apt).toBeDefined();
      expect(apt.status).toBe(AppointmentStatus.SCHEDULED);

      // Verify associated lead was promoted and scored +25
      expect(prismaMock.lead.update).toHaveBeenCalledWith({
        where: { id: 'lead-123' },
        data: {
          stage: LeadStage.APPOINTMENT_SCHEDULED,
          score: { increment: 25 },
        },
      });

      // Verify timeline activity logged
      expect(prismaMock.leadActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            activityType: 'APPOINTMENT_BOOKED',
            performedBy: 'AI_EMPLOYEE',
          }),
        }),
      );
    });
  });

  describe('Slot Availability Calculator', () => {
    it('should calculate available slots within working hours excluding booked slots', async () => {
      const orgId = 'org-apt-test';
      const testDate = '2026-10-15';

      // Mock an existing booked appointment at 10:00 AM
      prismaMock.appointment.findMany.mockResolvedValue([
        {
          startTime: new Date(`${testDate}T10:00:00.000Z`),
          endTime: new Date(`${testDate}T10:45:00.000Z`),
        },
      ]);

      const result = await service.getAvailableSlots(orgId, testDate, undefined, 45);

      expect(result.date).toBe(testDate);
      expect(result.durationMinutes).toBe(45);
      expect(Array.isArray(result.availableSlots)).toBe(true);

      // The 10:00 AM slot should NOT be in the available slots list
      expect(result.availableSlots).not.toContain('10:00 AM');
      // The 9:00 AM or 11:00 AM slot should be available
      expect(result.availableSlots).toContain('09:00 AM');
    });
  });
});
