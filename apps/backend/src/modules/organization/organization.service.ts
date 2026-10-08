import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto, InviteTeamMemberDto } from './organization.dto';
import { Role, PlanTier, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private prisma: PrismaService) {}

  async createOrganization(dto: CreateOrganizationDto, creatorEmail?: string) {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Organization with slug "${dto.slug}" already exists`);
    }

    const org = await this.prisma.organization.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        customDomain: dto.customDomain,
        logoUrl: dto.logoUrl,
        primaryColor: dto.primaryColor || '#0F52BA',
        currency: dto.currency || 'USD',
      },
    });

    // Create default trial subscription
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    await this.prisma.subscription.create({
      data: {
        organizationId: org.id,
        plan: PlanTier.TRIAL,
        status: SubscriptionStatus.TRIALING,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEnd,
      },
    });

    // Initialize current month usage meter
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    await this.prisma.usageMeter.create({
      data: {
        organizationId: org.id,
        periodStart: startOfMonth,
        periodEnd: endOfMonth,
      },
    });

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        organizationId: org.id,
        action: 'ORGANIZATION_CREATED',
        entity: 'Organization',
        entityId: org.id,
        details: { name: org.name, slug: org.slug },
      },
    });

    return org;
  }

  async getOrganization(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        subscription: true,
        whatsappChannels: {
          select: {
            id: true,
            phoneNumberId: true,
            displayPhoneNumber: true,
            verifiedName: true,
            qualityRating: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            employees: true,
            users: true,
            leads: true,
            conversations: true,
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async updateOrganization(id: string, dto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async listTeamMembers(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        phone: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async inviteTeamMember(organizationId: string, dto: InviteTeamMemberDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(`User with email ${dto.email} already exists`);
    }

    const defaultTempPassword = await bcrypt.hash('TempPassword2026!', 10);

    return this.prisma.user.create({
      data: {
        organizationId,
        email: dto.email,
        fullName: dto.fullName,
        role: dto.role,
        passwordHash: defaultTempPassword,
      },
    });
  }

  async getUsageMetrics(organizationId: string) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const meter = await this.prisma.usageMeter.findFirst({
      where: {
        organizationId,
        periodStart: { gte: startOfMonth },
      },
    });

    const [conversationsTotal, leadsTotal, appointmentsTotal] = await Promise.all([
      this.prisma.conversation.count({ where: { organizationId } }),
      this.prisma.lead.count({ where: { organizationId } }),
      this.prisma.appointment.count({ where: { organizationId } }),
    ]);

    return {
      currentPeriod: meter || {
        conversationsCount: conversationsTotal,
        messagesSent: 0,
        messagesReceived: 0,
        aiTokensUsed: 0,
      },
      lifetimeTotals: {
        conversations: conversationsTotal,
        leads: leadsTotal,
        appointments: appointmentsTotal,
      },
    };
  }

  async getAuditLogs(organizationId: string, limit: number = 50) {
    return this.prisma.auditLog.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
