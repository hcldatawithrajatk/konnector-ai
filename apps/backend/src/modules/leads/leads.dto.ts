import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStage } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty({ example: 'Robert Vance' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+15559871234' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'robert.vance@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: LeadStage, default: LeadStage.NEW })
  @IsEnum(LeadStage)
  @IsOptional()
  stage?: LeadStage;

  @ApiPropertyOptional({ example: 75 })
  @IsNumber()
  @IsOptional()
  score?: number;

  @ApiPropertyOptional({ example: 'WHATSAPP' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ example: 'Inquiring for Grade 6 Cambridge curriculum' })
  @IsString()
  @IsOptional()
  intentSummary?: string;

  @ApiPropertyOptional({ example: { grade: 'Grade 6', studentName: 'Liam' } })
  @IsOptional()
  customFields?: any;

  @ApiPropertyOptional({ example: ['High Intent', 'Grade 6'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'HIGH', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] })
  @IsString()
  @IsOptional()
  priority?: string;
}

export class UpdateLeadStageDto {
  @ApiProperty({ enum: LeadStage })
  @IsEnum(LeadStage)
  @IsNotEmpty()
  stage: LeadStage;
}

export class AddLeadActivityDto {
  @ApiProperty({ example: 'STAGE_CHANGED' })
  @IsString()
  @IsNotEmpty()
  activityType: string;

  @ApiProperty({ example: 'Lead stage moved to APPOINTMENT_SCHEDULED' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
