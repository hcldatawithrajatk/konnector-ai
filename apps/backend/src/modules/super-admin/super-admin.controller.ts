import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SuperAdminService } from './super-admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Super Admin & Platform Control')
@Controller('super-admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN)
@ApiBearerAuth()
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('tenants')
  @ApiOperation({ summary: 'List all tenant organizations across the platform' })
  listTenants() {
    return this.superAdminService.listAllTenants();
  }

  @Patch('tenants/:id/status')
  @ApiOperation({ summary: 'Suspend or activate a tenant organization' })
  setTenantStatus(@Param('id') id: string, @Body('status') status: 'ACTIVE' | 'SUSPENDED') {
    return this.superAdminService.setTenantStatus(id, status);
  }

  @Get('platform-metrics')
  @ApiOperation({ summary: 'Platform-wide aggregated business and usage KPIs' })
  getPlatformMetrics() {
    return this.superAdminService.getPlatformMetrics();
  }

  @Get('health')
  @ApiOperation({ summary: 'System health check for Cloud SQL, Redis, Gemini AI, WhatsApp API' })
  getHealth() {
    return this.superAdminService.getSystemHealth();
  }
}
