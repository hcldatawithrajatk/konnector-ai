import { PrismaClient, Role, PlanTier, SubscriptionStatus, EmployeeTemplate, LeadStage, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Konnector AI enterprise database seed...');

  // 1. Create Super Admin Organization and User
  const masterOrg = await prisma.organization.upsert({
    where: { slug: 'konnector-hq' },
    update: {},
    create: {
      name: 'Konnector AI Global Master',
      slug: 'konnector-hq',
      status: 'ACTIVE',
      currency: 'USD',
      isWhiteLabel: false,
    },
  });

  const superAdminPassword = await bcrypt.hash('SuperAdmin@Konnector2026!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@konnector.ai' },
    update: {},
    create: {
      email: 'admin@konnector.ai',
      passwordHash: superAdminPassword,
      fullName: 'Konnector Super Admin',
      role: Role.SUPER_ADMIN,
      organizationId: masterOrg.id,
      isActive: true,
    },
  });

  // 2. Demo Tenant 1: School Admissions (GreenField International Academy)
  const schoolOrg = await prisma.organization.upsert({
    where: { slug: 'greenfield-academy' },
    update: {},
    create: {
      name: 'GreenField International Academy',
      slug: 'greenfield-academy',
      status: 'ACTIVE',
      currency: 'USD',
      primaryColor: '#1E3A8A',
      settings: {
        industry: 'EDUCATION',
        website: 'https://greenfieldacademy.example.com',
        phone: '+1 (555) 019-2831',
      },
    },
  });

  const schoolOwnerPassword = await bcrypt.hash('SchoolOwner2026!', 10);
  const schoolOwner = await prisma.user.upsert({
    where: { email: 'admissions.director@greenfield.edu' },
    update: {},
    create: {
      email: 'admissions.director@greenfield.edu',
      passwordHash: schoolOwnerPassword,
      fullName: 'Sarah Jenkins',
      role: Role.TENANT_OWNER,
      organizationId: schoolOrg.id,
      isActive: true,
    },
  });

  // School Subscription
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  await prisma.subscription.upsert({
    where: { organizationId: schoolOrg.id },
    update: {},
    create: {
      organizationId: schoolOrg.id,
      plan: PlanTier.GROWTH,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: oneYearFromNow,
    },
  });

  // School AI Employee (Admissions Officer: "Maya")
  const schoolEmployee = await prisma.aiEmployee.create({
    data: {
      organizationId: schoolOrg.id,
      name: 'Maya',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      role: 'Admissions Officer',
      department: 'Admissions & Enrollment',
      templateType: EmployeeTemplate.ADMISSIONS_OFFICER,
      instructions: `You are Maya, the expert Admissions Officer at GreenField International Academy on WhatsApp.
Your mission:
1. Warmly greet prospective parents and students.
2. Inquire about the child's age, current grade, and desired academic year.
3. Answer questions regarding curriculum (IB and Cambridge), tuition fee structures, school timings, transport, and extracurriculars using the school knowledge base.
4. Qualify parent interest and collect parent name, email, student name, and grade.
5. Offer and schedule a Campus Tour or Virtual Counseling session.
6. If the parent asks about fee discounts, complaints, or complex transfer credits, politely offer to connect them with Director Sarah Jenkins.`,
      personalityPrompt: 'Warm, educational, polite, reassuring, professional, and efficient.',
      voiceTone: 'Warm & Professional',
      confidenceThreshold: 0.75,
      languages: ['en', 'es'],
      businessHours: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: { start: '09:00', end: '14:00' },
      },
      outOfHoursMessage: 'Thank you for contacting GreenField International Academy. Our admissions office is currently closed, but I have noted your message and will assist you first thing in the morning! Would you like to check our fee schedule in the meantime?',
      isDefault: true,
      isActive: true,
    },
  });

  // School WhatsApp Channel
  const schoolChannel = await prisma.whatsappChannel.create({
    data: {
      organizationId: schoolOrg.id,
      phoneNumberId: '108492039485721',
      wabaId: 'WABA_EDU_9921',
      displayPhoneNumber: '+1 555 019 2831',
      verifiedName: 'GreenField Academy Admissions',
      accessTokenEncrypted: 'mock_encrypted_token_edu',
      webhookVerifyToken: 'konnector_greenfield_token',
      isActive: true,
    },
  });

  // School Knowledge Base & FAQs
  const schoolKB = await prisma.knowledgeBase.create({
    data: {
      organizationId: schoolOrg.id,
      name: 'Admissions & Curriculum Handbook 2026',
      description: 'Fee structure, curriculum guidelines, transport routes, and calendar',
      employeeId: schoolEmployee.id,
    },
  });

  await prisma.faqItem.createMany({
    data: [
      {
        knowledgeBaseId: schoolKB.id,
        organizationId: schoolOrg.id,
        question: 'What is the annual tuition fee for Grade 1 to 5?',
        answer: 'Tuition fees for Grades 1 to 5 are $12,500 annually, payable in 3 quarterly installments. This includes lab supplies, textbooks, and local educational trips.',
        category: 'Fees',
      },
      {
        knowledgeBaseId: schoolKB.id,
        organizationId: schoolOrg.id,
        question: 'What curriculum does GreenField follow?',
        answer: 'GreenField offers an internationally accredited dual curriculum: Cambridge Primary & Secondary leading to the International Baccalaureate (IB) Diploma Programme in Grades 11 and 12.',
        category: 'Academics',
      },
      {
        knowledgeBaseId: schoolKB.id,
        organizationId: schoolOrg.id,
        question: 'What are the school timings?',
        answer: 'School timings are Monday through Friday, 8:15 AM to 3:15 PM. After-school sports and arts clubs run until 4:45 PM.',
        category: 'General',
      },
      {
        knowledgeBaseId: schoolKB.id,
        organizationId: schoolOrg.id,
        question: 'What documents are required for application?',
        answer: 'Required documents: 1) Child birth certificate, 2) Past 2 years report cards, 3) Immunization records, 4) Passport copy for student and parents, 5) Two passport photos.',
        category: 'Admissions',
      },
    ],
  });

  // School Follow-up Sequence
  const schoolSequence = await prisma.followUpSequence.create({
    data: {
      organizationId: schoolOrg.id,
      name: 'Prospective Parent Tour Nurture Sequence',
      description: 'Automated 14-day WhatsApp nurture for parents who inquired about admissions',
      triggerEvent: 'LEAD_CREATED',
      isActive: true,
      stopOnReply: true,
      stopOnBooking: true,
    },
  });

  await prisma.sequenceStep.createMany({
    data: [
      {
        sequenceId: schoolSequence.id,
        stepOrder: 1,
        delayHours: 24,
        messageTemplate: 'Hello {{parent_name}}! It was a pleasure chatting yesterday regarding {{student_name}}\'s admission. Would you like a virtual video tour of our STEM labs and Olympic pool?',
      },
      {
        sequenceId: schoolSequence.id,
        stepOrder: 2,
        delayHours: 72,
        messageTemplate: 'Hi {{parent_name}}, campus tour slots for this Saturday at 10:00 AM are filling fast. Would you like me to reserve a VIP family pass for you?',
      },
      {
        sequenceId: schoolSequence.id,
        stepOrder: 3,
        delayHours: 168,
        messageTemplate: 'Greetings from GreenField Academy! Round 1 scholarship applications close this Friday. Reply YES if you\'d like the scholarship criteria sheet sent over WhatsApp.',
      },
    ],
  });

  // School Sample Lead & Conversation
  const conv1 = await prisma.conversation.create({
    data: {
      organizationId: schoolOrg.id,
      channelId: schoolChannel.id,
      employeeId: schoolEmployee.id,
      contactPhoneNumber: '+15559871234',
      contactName: 'Robert Vance',
      status: 'ACTIVE_AI',
      summary: 'Parent inquiring for Grade 6 Cambridge curriculum for son Liam. Highly interested in science club and campus visit.',
      sentimentScore: 0.85,
    },
  });

  const lead1 = await prisma.lead.create({
    data: {
      organizationId: schoolOrg.id,
      conversationId: conv1.id,
      employeeId: schoolEmployee.id,
      fullName: 'Robert Vance',
      phoneNumber: '+15559871234',
      email: 'robert.vance@example.com',
      stage: LeadStage.QUALIFIED,
      score: 85,
      source: 'WHATSAPP',
      intentSummary: 'Enrolling 11yo son into Grade 6 for Fall 2026. Needs campus tour.',
      customFields: {
        studentName: 'Liam Vance',
        gradeApplying: 'Grade 6',
        preferredCurriculum: 'Cambridge',
      },
      tags: ['High Intent', 'Grade 6', 'Campus Tour Requested'],
      priority: 'HIGH',
      assignedToUserId: schoolOwner.id,
    },
  });

  // Sample Appointment for School
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(11, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      organizationId: schoolOrg.id,
      leadId: lead1.id,
      employeeId: schoolEmployee.id,
      title: 'GreenField Campus Tour - Vance Family',
      startTime: tomorrow,
      endTime: tomorrowEnd,
      status: AppointmentStatus.CONFIRMED,
      attendeeName: 'Robert Vance',
      attendeePhone: '+15559871234',
      attendeeEmail: 'robert.vance@example.com',
      notes: 'Interested in Cambridge Grade 6, robotics lab, and school transport from Downtown.',
      meetingLink: 'https://maps.google.com/?q=GreenField+Academy+Campus',
      calendarProvider: 'GOOGLE_CALENDAR',
    },
  });

  // 3. Demo Tenant 2: Healthcare (Apex Multi-Specialty Clinic)
  const healthOrg = await prisma.organization.upsert({
    where: { slug: 'apex-health' },
    update: {},
    create: {
      name: 'Apex Health & Multi-Specialty Clinic',
      slug: 'apex-health',
      status: 'ACTIVE',
      currency: 'USD',
      primaryColor: '#059669',
      settings: {
        industry: 'HEALTHCARE',
        phone: '+1 (555) 302-9988',
      },
    },
  });

  await prisma.aiEmployee.create({
    data: {
      organizationId: healthOrg.id,
      name: 'Dr. Chloe AI',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813638-04f8f411e8a8?w=150',
      role: 'Appointment Coordinator & Patient Care',
      department: 'Patient Services',
      templateType: EmployeeTemplate.APPOINTMENT_COORDINATOR,
      instructions: `You are Chloe, Patient Care & Appointment Coordinator at Apex Health on WhatsApp.
Your duties:
1. Help patients schedule, reschedule, or cancel doctor consultations.
2. Inquire about symptoms politely without offering clinical diagnosis.
3. Provide clinic hours, doctor availability (Cardiology, Dermatology, General Medicine, Pediatrics).
4. Send appointment confirmations, preparation instructions (e.g. 8-hour fasting for blood tests), and clinic navigation pins.
5. If emergency symptoms (chest pain, shortness of breath) are mentioned, instruct them IMMEDIATELY to call 911 or head to nearest emergency room.`,
      personalityPrompt: 'Empathetic, clear, calm, strictly adheres to medical triage guardrails.',
      voiceTone: 'Empathetic & Medically Disciplined',
      confidenceThreshold: 0.80,
      languages: ['en'],
      isDefault: true,
      isActive: true,
    },
  });

  // 4. Demo Tenant 3: Real Estate (Prestige Realty Group)
  const realEstateOrg = await prisma.organization.upsert({
    where: { slug: 'prestige-realty' },
    update: {},
    create: {
      name: 'Prestige Realty & Luxury Estates',
      slug: 'prestige-realty',
      status: 'ACTIVE',
      currency: 'USD',
      primaryColor: '#D97706',
      settings: {
        industry: 'REAL_ESTATE',
        phone: '+1 (555) 776-5432',
      },
    },
  });

  await prisma.aiEmployee.create({
    data: {
      organizationId: realEstateOrg.id,
      name: 'Alex',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      role: 'Property Sales SDR',
      department: 'Luxury Residential',
      templateType: EmployeeTemplate.SALES_DEVELOPMENT,
      instructions: `You are Alex, Senior Property Consultant at Prestige Realty on WhatsApp.
Your duties:
1. Qualify property buyers: preferred location, budget bracket, property size (2BHK, 3BHK, Penthouse, Villa), and timeline to purchase.
2. Share digital brochures, floor plans, and amenity highlights.
3. Schedule VIP on-site property walkthroughs with assigned agents.
4. Calculate estimated mortgage down-payments and rental yields.`,
      personalityPrompt: 'High energy, professional, polite, persuasive, and consultative.',
      voiceTone: 'Consultative & Premium',
      confidenceThreshold: 0.70,
      languages: ['en'],
      isDefault: true,
      isActive: true,
    },
  });

  console.log('✅ Konnector AI database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
