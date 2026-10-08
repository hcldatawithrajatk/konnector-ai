import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './appointments.dto';
import { AppointmentStatus, LeadStage } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(private prisma: PrismaService) {}

  async createAppointment(organizationId: string, dto: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        organizationId,
        leadId: dto.leadId,
        employeeId: dto.employeeId,
        title: dto.title,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        attendeeName: dto.attendeeName,
        attendeePhone: dto.attendeePhone,
        attendeeEmail: dto.attendeeEmail,
        notes: dto.notes,
        status: AppointmentStatus.SCHEDULED,
        calendarProvider: 'GOOGLE_CALENDAR',
        meetingLink: `https://meet.google.com/knc-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
      },
    });

    // If associated with a lead, update lead stage to APPOINTMENT_SCHEDULED
    if (dto.leadId) {
      await this.prisma.lead.update({
        where: { id: dto.leadId },
        data: {
          stage: LeadStage.APPOINTMENT_SCHEDULED,
          score: { increment: 25 },
        },
      });

      await this.prisma.leadActivity.create({
        data: {
          organizationId,
          leadId: dto.leadId,
          activityType: 'APPOINTMENT_BOOKED',
          description: `Appointment "${dto.title}" booked for ${new Date(dto.startTime).toLocaleDateString()}`,
          performedBy: 'AI_EMPLOYEE',
        },
      });
    }

    // Increment monthly meter
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    await this.prisma.usageMeter.updateMany({
      where: { organizationId, periodStart: { gte: startOfMonth } },
      data: { appointmentsBooked: { increment: 1 } },
    });

    return appointment;
  }

  async listAppointments(organizationId: string, status?: AppointmentStatus) {
    return this.prisma.appointment.findMany({
      where: {
        organizationId,
        ...(status ? { status } : {}),
      },
      include: {
        lead: { select: { id: true, fullName: true, phoneNumber: true, email: true } },
        employee: { select: { id: true, name: true, role: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getAppointment(id: string, organizationId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, organizationId },
      include: {
        lead: true,
        employee: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async updateStatus(id: string, organizationId: string, dto: UpdateAppointmentStatusDto) {
    await this.getAppointment(id, organizationId);

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.notes ? { notes: dto.notes } : {}),
      },
    });
  }

  /**
   * Get available slots for a given date
   */
  async getAvailableSlots(organizationId: string, dateStr: string) {
    const requestedDate = new Date(dateStr);
    const startHour = 9;
    const endHour = 17;
    const slots: { startTime: string; endTime: string; isAvailable: boolean }[] = [];

    // Fetch existing appointments on requested day
    const dayStart = new Date(requestedDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(requestedDate.setHours(23, 59, 59, 999));

    const booked = await this.prisma.appointment.findMany({
      where: {
        organizationId,
        status: { notIn: [AppointmentStatus.CANCELLED] },
        startTime: { gte: dayStart, lte: dayEnd },
      },
    });

    // Generate 1-hour slots
    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(dayStart);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(dayStart);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      const isConflict = booked.some(
        (b) => slotStart.getTime() < b.endTime.getTime() && slotEnd.getTime() > b.startTime.getTime(),
      );

      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        isAvailable: !isConflict,
      });
    }

    return slots;
  }
}
