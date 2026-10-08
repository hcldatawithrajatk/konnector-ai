import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLeadDto, UpdateLeadStageDto, AddLeadActivityDto } from './leads.dto';
import { LeadStage } from '@prisma/client';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private prisma: PrismaService) {}

  async createLead(organizationId: string, dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        organizationId,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        stage: dto.stage || LeadStage.NEW,
        score: dto.score || 50,
        source: dto.source || 'WHATSAPP',
        intentSummary: dto.intentSummary,
        customFields: dto.customFields || {},
        tags: dto.tags || [],
        priority: dto.priority || 'MEDIUM',
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        organizationId,
        leadId: lead.id,
        activityType: 'LEAD_CREATED',
        description: `Lead created from ${lead.source}`,
        performedBy: 'SYSTEM',
      },
    });

    return lead;
  }

  async listLeads(organizationId: string, stage?: LeadStage) {
    return this.prisma.lead.findMany({
      where: {
        organizationId,
        ...(stage ? { stage } : {}),
      },
      include: {
        assignedToUser: {
          select: { id: true, fullName: true, email: true },
        },
        appointments: {
          select: { id: true, startTime: true, title: true, status: true },
        },
        _count: {
          select: { activities: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getLead(id: string, organizationId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, organizationId },
      include: {
        conversation: {
          include: {
            messages: {
              take: 20,
              orderBy: { timestamp: 'desc' },
            },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
        },
        appointments: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async updateStage(id: string, organizationId: string, dto: UpdateLeadStageDto) {
    const lead = await this.getLead(id, organizationId);

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        stage: dto.stage,
        score: { increment: dto.stage === LeadStage.WON ? 30 : 5 },
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        organizationId,
        leadId: id,
        activityType: 'STAGE_CHANGED',
        description: `Pipeline stage moved from ${lead.stage} to ${dto.stage}`,
        performedBy: 'USER',
      },
    });

    return updated;
  }

  async addActivity(id: string, organizationId: string, dto: AddLeadActivityDto) {
    await this.getLead(id, organizationId);

    return this.prisma.leadActivity.create({
      data: {
        organizationId,
        leadId: id,
        activityType: dto.activityType,
        description: dto.description,
        performedBy: 'AGENT',
      },
    });
  }

  async getPipelineMetrics(organizationId: string) {
    const stages = Object.values(LeadStage);
    const counts: Record<string, number> = {};

    for (const stage of stages) {
      counts[stage] = await this.prisma.lead.count({
        where: { organizationId, stage },
      });
    }

    const totalLeads = await this.prisma.lead.count({ where: { organizationId } });
    const qualifiedLeads = counts[LeadStage.QUALIFIED] + counts[LeadStage.APPOINTMENT_SCHEDULED] + counts[LeadStage.WON];
    const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';

    return {
      stageBreakdown: counts,
      totalLeads,
      qualificationRate: `${qualificationRate}%`,
    };
  }
}
