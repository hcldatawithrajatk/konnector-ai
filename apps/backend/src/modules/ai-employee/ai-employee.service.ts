import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAiEmployeeDto, UpdateAiEmployeeDto, CreateEscalationRuleDto } from './ai-employee.dto';
import { EmployeeTemplate } from '@prisma/client';

@Injectable()
export class AiEmployeeService {
  private readonly logger = new Logger(AiEmployeeService.name);

  constructor(private prisma: PrismaService) {}

  async createEmployee(organizationId: string, dto: CreateAiEmployeeDto) {
    // If set as default, reset other employees' default flag
    if (dto.isDefault) {
      await this.prisma.aiEmployee.updateMany({
        where: { organizationId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const employee = await this.prisma.aiEmployee.create({
      data: {
        organizationId,
        name: dto.name,
        avatarUrl: dto.avatarUrl,
        role: dto.role,
        department: dto.department,
        templateType: dto.templateType,
        instructions: dto.instructions,
        personalityPrompt: dto.personalityPrompt,
        voiceTone: dto.voiceTone || 'Professional & Warm',
        confidenceThreshold: dto.confidenceThreshold || 0.70,
        languages: dto.languages || ['en'],
        businessHours: dto.businessHours || {
          monday: { start: '09:00', end: '18:00' },
          tuesday: { start: '09:00', end: '18:00' },
          wednesday: { start: '09:00', end: '18:00' },
          thursday: { start: '09:00', end: '18:00' },
          friday: { start: '09:00', end: '18:00' },
        },
        outOfHoursMessage: dto.outOfHoursMessage || 'Thank you for reaching out! We are currently outside business hours, but we will follow up with you as soon as our office opens.',
        isDefault: dto.isDefault ?? false,
      },
      include: { escalationRules: true },
    });

    // Seed standard escalation rules
    await this.prisma.escalationRule.createMany({
      data: [
        {
          employeeId: employee.id,
          conditionType: 'USER_REQUEST',
          thresholdValue: 'human,agent,manager,supervisor,person',
          action: 'TRANSFER_TO_AGENT',
        },
        {
          employeeId: employee.id,
          conditionType: 'LOW_CONFIDENCE',
          thresholdValue: String(employee.confidenceThreshold),
          action: 'TRANSFER_TO_AGENT',
        },
      ],
    });

    return employee;
  }

  async listEmployees(organizationId: string) {
    return this.prisma.aiEmployee.findMany({
      where: { organizationId },
      include: {
        escalationRules: true,
        knowledgeBases: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            conversations: true,
            leads: true,
            appointments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmployee(id: string, organizationId: string) {
    const employee = await this.prisma.aiEmployee.findFirst({
      where: { id, organizationId },
      include: {
        escalationRules: true,
        knowledgeBases: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('AI Employee not found');
    }

    return employee;
  }

  async updateEmployee(id: string, organizationId: string, dto: UpdateAiEmployeeDto) {
    await this.getEmployee(id, organizationId);

    return this.prisma.aiEmployee.update({
      where: { id },
      data: dto,
    });
  }

  async deleteEmployee(id: string, organizationId: string) {
    await this.getEmployee(id, organizationId);
    return this.prisma.aiEmployee.delete({
      where: { id },
    });
  }

  async addEscalationRule(employeeId: string, organizationId: string, dto: CreateEscalationRuleDto) {
    await this.getEmployee(employeeId, organizationId);

    return this.prisma.escalationRule.create({
      data: {
        employeeId,
        conditionType: dto.conditionType,
        thresholdValue: dto.thresholdValue,
        action: dto.action || 'TRANSFER_TO_AGENT',
      },
    });
  }

  /**
   * Get pre-built professional templates ready for instant deployment
   */
  getAvailableTemplates() {
    return [
      {
        templateType: EmployeeTemplate.ADMISSIONS_OFFICER,
        name: 'Maya',
        role: 'Admissions Officer',
        department: 'Admissions & Enrollment',
        industry: 'Schools & Higher Education',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        suggestedTone: 'Warm, Reassuring, Academic & Professional',
        defaultInstructions: `Greet prospective parents warmly. Inquire about student age, current grade, and academic year. Answer curriculum and fee queries with verified knowledge base facts. Schedule campus visits and gather contact details.`,
        defaultPersonality: `Helpful, attentive, detail-oriented, supportive of parents and students.`,
      },
      {
        templateType: EmployeeTemplate.APPOINTMENT_COORDINATOR,
        name: 'Dr. Chloe AI',
        role: 'Patient Coordinator & Appointment Scheduler',
        department: 'Patient Services & Clinic Front Desk',
        industry: 'Healthcare & Medical Practices',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813638-04f8f411e8a8?w=150',
        suggestedTone: 'Empathetic, Calm, Medically Disciplined',
        defaultInstructions: `Coordinate patient doctor bookings. Collect symptoms without making medical diagnoses. Provide clinic directions, parking, and pre-consultation fasting rules. Route emergencies immediately to emergency lines.`,
        defaultPersonality: `Compassionate, reassuring, precise, and respectful of privacy.`,
      },
      {
        templateType: EmployeeTemplate.SALES_DEVELOPMENT,
        name: 'Alex',
        role: 'Sales Development Representative (SDR)',
        department: 'Growth & Business Development',
        industry: 'Real Estate & B2B Services',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        suggestedTone: 'Persuasive, Energetic, Consultative',
        defaultInstructions: `Engage high-intent inbound inquiries. Qualify budget, timeline, and decision-maker status. Share product/property catalogs and schedule discovery demos or site visits with senior executives.`,
        defaultPersonality: `Driven, proactive, courteous, value-focused.`,
      },
      {
        templateType: EmployeeTemplate.CUSTOMER_SUPPORT,
        name: 'Sam',
        role: 'Customer Support Executive',
        department: 'Customer Experience',
        industry: 'SMEs & E-Commerce',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        suggestedTone: 'Patient, Empathetic, Problem-Solving',
        defaultInstructions: `Resolve customer inquiries using product documentation. Track order status, troubleshoot issues, handle return policies, and escalate complex complaints to human supervisors.`,
        defaultPersonality: `Patient, solution-oriented, polite, and rapid.`,
      },
      {
        templateType: EmployeeTemplate.COLLECTIONS_OFFICER,
        name: 'Victor',
        role: 'Accounts Receivable & Collections Officer',
        department: 'Finance & Collections',
        industry: 'Financial Services & SMEs',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        suggestedTone: 'Firm, Professional, Respectful, Compliant',
        defaultInstructions: `Remind clients of upcoming or past-due invoices. Share secure payment links (Stripe/Razorpay), verify receipt, and offer installment plan options per organizational policies.`,
        defaultPersonality: `Courteous, methodical, firm yet understanding.`,
      },
    ];
  }
}
