import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('KonnectorBootstrap');
  const app = await NestFactory.create(AppModule);

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Validation Pipe with automatic transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // CORS Configuration
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:4000').split(',');
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || origins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for staging/multi-tenant custom domains
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id', 'Accept'],
  });

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Konnector AI - Platform API')
    .setDescription(
      'Enterprise Multi-Tenant SaaS Platform for Deploying Autonomous AI Employees on WhatsApp.\n\n' +
        'Core capabilities include WhatsApp Cloud API integration, Gemini 2.5 Pro / Flash reasoning, ' +
        'RAG knowledge retrieval, Lead CRM, Calendar appointment booking, and No-Code Follow-Up sequences.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'Tenant Registration, User Login, Firebase Token Exchange')
    .addTag('Organizations & Tenants', 'Tenant Settings, RBAC Team Management, Usage Metering, Audit Logs')
    .addTag('AI Employee Engine', 'Digital Workforce creation, prompts, business hours, escalation rules')
    .addTag('WhatsApp Cloud API & Live Inbox', 'Meta Webhooks, message dispatch, live chat omnichannel inbox')
    .addTag('Knowledge Base & RAG', 'Document ingestion, chunking, embeddings, semantic retrieval')
    .addTag('Leads & CRM Pipeline', 'Lead capture, scoring (0-100), kanban stages, activity history')
    .addTag('Appointment Booking & Calendars', 'Slot availability, automated booking, calendar sync')
    .addTag('Automated Follow-Up Engine', 'No-code sequence builder, multi-day triggers, stop conditions')
    .addTag('Human Handoff & Escalations', 'Escalation tickets, agent chat takeover, sentiment triggers')
    .addTag('Analytics & ROI Dashboard', 'Executive KPI aggregations, resolution rates, monthly trends')
    .addTag('Billing & Subscriptions', 'Stripe, Razorpay, invoices, GST compliance')
    .addTag('Industry Solution Packs', '1-Click deployment for Schools, Healthcare, Real Estate')
    .addTag('Super Admin & Platform Control', 'Global tenant overview, system health, platform metrics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Konnector AI API Documentation',
    customCss: '.swagger-ui .topbar { background-color: #0F52BA; }',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Konnector AI Backend running on: http://localhost:${port}`);
  logger.log(`📚 Interactive Swagger API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
