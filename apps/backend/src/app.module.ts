import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AiEmployeeModule } from './modules/ai-employee/ai-employee.module';
import { AiEngineModule } from './modules/ai-engine/ai-engine.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { FollowUpsModule } from './modules/follow-ups/follow-ups.module';
import { HumanHandoffModule } from './modules/human-handoff/human-handoff.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BillingModule } from './modules/billing/billing.module';
import { IndustryPacksModule } from './modules/industry-packs/industry-packs.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    DatabaseModule,
    AiEngineModule,
    AuthModule,
    OrganizationModule,
    AiEmployeeModule,
    WhatsAppModule,
    KnowledgeBaseModule,
    LeadsModule,
    AppointmentsModule,
    FollowUpsModule,
    HumanHandoffModule,
    AnalyticsModule,
    BillingModule,
    IndustryPacksModule,
    SuperAdminModule,
  ],
})
export class AppModule {}
