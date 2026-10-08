import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './appointments.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { AppointmentStatus } from '@prisma/client';

@ApiTags('Appointment Booking & Calendars')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'), TenantGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a new appointment' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List scheduled appointments' })
  list(@CurrentTenant() tenantId: string, @Query('status') status?: AppointmentStatus) {
    return this.appointmentsService.listAppointments(tenantId, status);
  }

  @Get('slots')
  @ApiOperation({ summary: 'Check real-time slot availability for a date' })
  getSlots(@CurrentTenant() tenantId: string, @Query('date') date: string) {
    return this.appointmentsService.getAvailableSlots(tenantId, date || new Date().toISOString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details' })
  getOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.appointmentsService.getAppointment(id, tenantId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status (Confirm, Reschedule, Cancel)' })
  updateStatus(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, tenantId, dto);
  }
}
