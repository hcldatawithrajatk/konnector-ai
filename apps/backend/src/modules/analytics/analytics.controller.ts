import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Analytics & ROI Dashboard')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'), TenantGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get business analytics KPI summary, ROI metrics, and monthly trends' })
  getDashboard(@CurrentTenant() tenantId: string) {
    return this.analyticsService.getDashboardSummary(tenantId);
  }
}
