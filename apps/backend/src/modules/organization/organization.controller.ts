import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, UpdateOrganizationDto, InviteTeamMemberDto } from './organization.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Role } from '@prisma/client';

@ApiTags('Organizations & Tenants')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new Tenant Organization' })
  async create(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(dto);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current tenant organization profile' })
  async getCurrent(@CurrentTenant() tenantId: string) {
    return this.organizationService.getOrganization(tenantId);
  }

  @Patch('current')
  @ApiOperation({ summary: 'Update current tenant settings' })
  async updateCurrent(@CurrentTenant() tenantId: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationService.updateOrganization(tenantId, dto);
  }

  @Get('team')
  @ApiOperation({ summary: 'List organization team members' })
  async listTeam(@CurrentTenant() tenantId: string) {
    return this.organizationService.listTeamMembers(tenantId);
  }

  @Post('team/invite')
  @ApiOperation({ summary: 'Invite new team member with role' })
  async inviteTeamMember(@CurrentTenant() tenantId: string, @Body() dto: InviteTeamMemberDto) {
    return this.organizationService.inviteTeamMember(tenantId, dto);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get current tenant usage meters and billing consumption' })
  async getUsage(@CurrentTenant() tenantId: string) {
    return this.organizationService.getUsageMetrics(tenantId);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get organization security audit trail' })
  async getAuditLogs(@CurrentTenant() tenantId: string, @Query('limit') limit?: number) {
    return this.organizationService.getAuditLogs(tenantId, limit ? Number(limit) : 50);
  }
}
