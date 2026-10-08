import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFollowUpSequenceDto } from './follow-ups.dto';

@Injectable()
export class FollowUpsService {
  private readonly logger = new Logger(FollowUpsService.name);

  constructor(private prisma: PrismaService) {}

  async createSequence(organizationId: string, dto: CreateFollowUpSequenceDto) {
    const sequence = await this.prisma.followUpSequence.create({
      data: {
        organizationId,
        name: dto.name,
        description: dto.description,
        triggerEvent: dto.triggerEvent,
        stopOnReply: dto.stopOnReply ?? true,
        stopOnBooking: dto.stopOnBooking ?? true,
        steps: {
          create: dto.steps.map((step) => ({
            stepOrder: step.stepOrder,
            delayHours: step.delayHours,
            messageTemplate: step.messageTemplate,
            mediaUrl: step.mediaUrl,
          })),
        },
      },
      include: { steps: true },
    });

    return sequence;
  }

  async listSequences(organizationId: string) {
    return this.prisma.followUpSequence.findMany({
      where: { organizationId },
      include: {
        steps: { orderBy: { stepOrder: 'asc' } },
        _count: {
          select: { executions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSequence(id: string, organizationId: string) {
    const seq = await this.prisma.followUpSequence.findFirst({
      where: { id, organizationId },
      include: {
        steps: { orderBy: { stepOrder: 'asc' } },
        executions: {
          take: 50,
          include: {
            lead: { select: { id: true, fullName: true, phoneNumber: true } },
          },
        },
      },
    });

    if (!seq) {
      throw new NotFoundException('Follow-up sequence not found');
    }

    return seq;
  }

  /**
   * Enroll a lead into an automated sequence
   */
  async enrollLead(sequenceId: string, leadId: string) {
    const sequence = await this.prisma.followUpSequence.findUnique({
      where: { id: sequenceId },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });

    if (!sequence || sequence.steps.length === 0) return null;

    const firstStep = sequence.steps[0];
    const nextRun = new Date();
    nextRun.setHours(nextRun.getHours() + firstStep.delayHours);

    return this.prisma.sequenceExecution.create({
      data: {
        sequenceId,
        leadId,
        currentStepOrder: 1,
        status: 'RUNNING',
        nextRunAt: nextRun,
      },
    });
  }

  /**
   * Stop all active sequence executions for a lead (when user replies or books)
   */
  async stopLeadSequences(leadId: string, reason: 'REPLIED' | 'BOOKED') {
    return this.prisma.sequenceExecution.updateMany({
      where: {
        leadId,
        status: 'RUNNING',
      },
      data: {
        status: `STOPPED_${reason}`,
      },
    });
  }
}
