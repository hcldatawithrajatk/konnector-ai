import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EmployeeTemplate, LeadStage } from '@prisma/client';

@Injectable()
export class IndustryPacksService {
  private readonly logger = new Logger(IndustryPacksService.name);

  constructor(private prisma: PrismaService) {}

  getAvailablePacks() {
    return [
      {
        id: 'school-admissions',
        name: 'School Admissions & Student Enrollment Pack',
        description: 'Complete digital admissions office for K-12 schools, international colleges, and academies.',
        employeeName: 'Maya',
        employeeRole: 'Admissions Officer',
        features: [
          'Tuition fee & scholarship inquiries',
          'Curriculum & academic calendar Q&A',
          'Document collection checklist',
          'Campus tour & virtual counseling booking',
          '14-Day prospective parent nurture sequence',
          'Student grade & board CRM qualification',
        ],
      },
      {
        id: 'healthcare-clinic',
        name: 'Healthcare & Multi-Specialty Clinic Pack',
        description: 'Automated patient care, doctor appointment scheduling, and consultation reminders.',
        employeeName: 'Dr. Chloe AI',
        employeeRole: 'Patient Care & Appointment Coordinator',
        features: [
          'Doctor availability & multi-specialty triage',
          'Consultation scheduling & rescheduling',
          'Fasting & pre-test preparation instructions',
          'Lab report notifications',
          'Strict medical guardrails & emergency detection',
          'Post-visit follow-up reminders',
        ],
      },
      {
        id: 'real-estate',
        name: 'Real Estate & Luxury Properties Pack',
        description: 'High-converting SDR for property developers, brokers, and luxury real estate agencies.',
        employeeName: 'Alex',
        employeeRole: 'Property SDR & Site Visit Coordinator',
        features: [
          'Budget, BHK, and timeline buyer qualification',
          'Automated digital brochure & floor plan dispatch',
          'VIP on-site property walkthrough scheduling',
          'Mortgage down-payment calculator integration',
          'Automated buyer lead scoring (0-100)',
          '7-Day price appreciation nurture sequence',
        ],
      },
    ];
  }

  /**
   * One-Click Installation of Industry Pack for Tenant
   */
  async installIndustryPack(organizationId: string, packId: string) {
    this.logger.log(`Installing industry pack "${packId}" for organization: ${organizationId}`);

    if (packId === 'school-admissions') {
      // 1. Create AI Employee
      const employee = await this.prisma.aiEmployee.create({
        data: {
          organizationId,
          name: 'Maya',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          role: 'Admissions Officer',
          department: 'Admissions & Enrollment',
          templateType: EmployeeTemplate.ADMISSIONS_OFFICER,
          instructions: `You are Maya, Admissions Officer. Greet parents, answer fee & curriculum queries, collect student grade/name, and book campus tours.`,
          personalityPrompt: 'Warm, polite, reassuring, professional.',
          voiceTone: 'Warm & Professional',
          confidenceThreshold: 0.75,
          isDefault: true,
        },
      });

      // 2. Create Knowledge Base & FAQs
      const kb = await this.prisma.knowledgeBase.create({
        data: {
          organizationId,
          name: 'Admissions Handbook & FAQs',
          description: 'Official school admissions guidelines, tuition, timings, and uniform policies.',
          employeeId: employee.id,
        },
      });

      await this.prisma.faqItem.createMany({
        data: [
          {
            knowledgeBaseId: kb.id,
            organizationId,
            question: 'What are the school operating hours?',
            answer: 'Classes run Monday through Friday from 8:15 AM to 3:15 PM. Extracurricular sports clubs continue until 4:45 PM.',
            category: 'Timings',
          },
          {
            knowledgeBaseId: kb.id,
            organizationId,
            question: 'What documents are needed for admission?',
            answer: '1. Child birth certificate, 2. Past 2 years report cards, 3. Immunization record, 4. Parent passport copies.',
            category: 'Admissions',
          },
          {
            knowledgeBaseId: kb.id,
            organizationId,
            question: 'What is the annual tuition fee structure?',
            answer: 'Tuition fees range from $12,500 to $16,000 depending on the grade, payable in 3 easy quarterly installments.',
            category: 'Fees',
          },
        ],
      });

      // 3. Create Follow-up sequence
      const seq = await this.prisma.followUpSequence.create({
        data: {
          organizationId,
          name: 'Admissions Nurture Sequence',
          description: 'Automated WhatsApp follow-up for prospective parents',
          triggerEvent: 'LEAD_CREATED',
        },
      });

      await this.prisma.sequenceStep.createMany({
        data: [
          {
            sequenceId: seq.id,
            stepOrder: 1,
            delayHours: 24,
            messageTemplate: 'Hello! Thank you for inquiring about our academy. Would you like to schedule a campus walkthrough this week?',
          },
          {
            sequenceId: seq.id,
            stepOrder: 2,
            delayHours: 72,
            messageTemplate: 'Hi! Admissions for the upcoming term are filling fast. Can I assist you with reserving an assessment slot?',
          },
        ],
      });

      return { success: true, packId, employeeId: employee.id, kbId: kb.id };
    }

    if (packId === 'healthcare-clinic') {
      const employee = await this.prisma.aiEmployee.create({
        data: {
          organizationId,
          name: 'Dr. Chloe AI',
          avatarUrl: 'https://images.unsplash.com/photo-1594824813638-04f8f411e8a8?w=150',
          role: 'Patient Care & Appointment Coordinator',
          department: 'Front Desk & Patient Services',
          templateType: EmployeeTemplate.APPOINTMENT_COORDINATOR,
          instructions: `You are Chloe, Patient Care Coordinator. Schedule doctor visits, answer clinic queries, never provide medical diagnoses, and route emergencies immediately to emergency services.`,
          personalityPrompt: 'Empathetic, clear, calm, medically disciplined.',
          voiceTone: 'Empathetic & Medically Disciplined',
          confidenceThreshold: 0.80,
          isDefault: true,
        },
      });

      const kb = await this.prisma.knowledgeBase.create({
        data: {
          organizationId,
          name: 'Clinic Information & Doctor Hours',
          description: 'Doctor specialties, OPD timings, insurance partners, and diagnostic test guidelines.',
          employeeId: employee.id,
        },
      });

      await this.prisma.faqItem.createMany({
        data: [
          {
            knowledgeBaseId: kb.id,
            organizationId,
            question: 'What are the clinic OPD consultation hours?',
            answer: 'Our clinic operates Monday through Saturday, 9:00 AM to 8:00 PM. Emergency triage is open 24/7.',
            category: 'Timings',
          },
          {
            knowledgeBaseId: kb.id,
            organizationId,
            question: 'Do I need to fast before a routine blood test?',
            answer: 'Yes, routine lipid profile and fasting blood sugar tests require 8 to 10 hours of fasting. Water is permitted.',
            category: 'Preparation',
          },
        ],
      });

      return { success: true, packId, employeeId: employee.id, kbId: kb.id };
    }

    if (packId === 'real-estate') {
      const employee = await this.prisma.aiEmployee.create({
        data: {
          organizationId,
          name: 'Alex',
          avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
          role: 'Property Sales SDR',
          department: 'Residential Real Estate',
          templateType: EmployeeTemplate.SALES_DEVELOPMENT,
          instructions: `You are Alex, Property Sales SDR. Inquire about preferred location, bedroom configuration, budget bracket, and schedule site visits.`,
          personalityPrompt: 'Consultative, energetic, professional, responsive.',
          voiceTone: 'Consultative & Premium',
          confidenceThreshold: 0.70,
          isDefault: true,
        },
      });

      const kb = await this.prisma.knowledgeBase.create({
        data: {
          organizationId,
          name: 'Property Portfolio & Amenities Guide',
          description: 'Floor plans, price lists, amenities, and payment milestone plans.',
          employeeId: employee.id,
        },
      });

      await this.prisma.faqItem.createMany({
        data: [
          {
            knowledgeBaseId: kb.id,
            organizationId,
            question: 'What apartment configurations are available?',
            answer: 'We offer luxury 2 BHK (1,250 sq.ft), 3 BHK (1,850 sq.ft), and Sky Penthouses (3,400 sq.ft) with panoramic views.',
            category: 'Properties',
          },
          {
            knowledgeBaseId: kb.id,
            organizationId,
            question: 'What is the payment construction milestone plan?',
            answer: 'We offer a 10:80:10 builder-subvention scheme with only 10% down payment required upon booking.',
            category: 'Payment',
          },
        ],
      });

      return { success: true, packId, employeeId: employee.id, kbId: kb.id };
    }

    return { success: false, message: 'Pack not recognized' };
  }
}
