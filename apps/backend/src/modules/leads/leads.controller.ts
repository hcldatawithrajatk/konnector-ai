import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadStageDto, AddLeadActivityDto } from './leads.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { LeadStage } from '@prisma/client';

@ApiTags('Leads & CRM Pipeline')
@Controller('leads')
@UseGuards(AuthGuard('jwt'), TenantGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Lead in CRM' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateLeadDto) {
    return this.leadsService.createLead(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all leads with optional stage filter' })
  list(@CurrentTenant() tenantId: string, @Query('stage') stage?: LeadStage) {
    return this.leadsService.listLeads(tenantId, stage);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get CRM pipeline stage conversion metrics' })
  getMetrics(@CurrentTenant() tenantId: string) {
    return this.leadsService.getPipelineMetrics(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single lead details with conversation & activities timeline' })
  getOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.leadsService.getLead(id, tenantId);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Update lead pipeline stage (Kanban drag-and-drop)' })
  updateStage(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: UpdateLeadStageDto,
  ) {
    return this.leadsService.updateStage(id, tenantId, dto);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Add a manual activity or note to lead timeline' })
  addActivity(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: AddLeadActivityDto,
  ) {
    return this.leadsService.addActivity(id, tenantId, dto);
  }
}
