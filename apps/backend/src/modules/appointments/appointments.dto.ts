import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'GreenField Campus Tour - Vance Family' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2026-10-15T10:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2026-10-15T11:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: 'Robert Vance' })
  @IsString()
  @IsNotEmpty()
  attendeeName: string;

  @ApiProperty({ example: '+15559871234' })
  @IsString()
  @IsNotEmpty()
  attendeePhone: string;

  @ApiPropertyOptional({ example: 'robert.vance@example.com' })
  @IsString()
  @IsOptional()
  attendeeEmail?: string;

  @ApiPropertyOptional({ example: 'Interested in Cambridge Grade 6 curriculum' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  leadId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employeeId?: string;
}

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: AppointmentStatus })
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: AppointmentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
