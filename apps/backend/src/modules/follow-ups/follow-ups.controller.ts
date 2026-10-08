import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FollowUpsService } from './follow-ups.service';
import { CreateFollowUpSequenceDto } from './follow-ups.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Automated Follow-Up Engine')
@Controller('follow-ups')
@UseGuards(AuthGuard('jwt'), TenantGuard)
@ApiBearerAuth()
export class FollowUpsController {
  constructor(private readonly followUpsService: FollowUpsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new automated multi-day follow-up sequence' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateFollowUpSequenceDto) {
    return this.followUpsService.createSequence(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all follow-up sequences' })
  list(@CurrentTenant() tenantId: string) {
    return this.followUpsService.listSequences(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sequence steps and active lead execution statuses' })
  getOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.followUpsService.getSequence(id, tenantId);
  }

  @Post(':id/enroll/:leadId')
  @ApiOperation({ summary: 'Manually enroll a lead into a follow-up sequence' })
  enrollLead(@Param('id') sequenceId: string, @Param('leadId') leadId: string) {
    return this.followUpsService.enrollLead(sequenceId, leadId);
  }
}
