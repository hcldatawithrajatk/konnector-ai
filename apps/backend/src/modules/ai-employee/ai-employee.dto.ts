import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeTemplate } from '@prisma/client';

export class CreateAiEmployeeDto {
  @ApiProperty({ example: 'Maya' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: 'Admissions Officer' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Admissions & Enrollment' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ enum: EmployeeTemplate, default: EmployeeTemplate.ADMISSIONS_OFFICER })
  @IsEnum(EmployeeTemplate)
  templateType: EmployeeTemplate;

  @ApiProperty({ example: 'Guide prospective parents through admission guidelines, school fees, and tour bookings.' })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({ example: 'Warm, educational, polite, reassuring, professional, and efficient.' })
  @IsString()
  @IsNotEmpty()
  personalityPrompt: string;

  @ApiPropertyOptional({ example: 'Professional & Warm' })
  @IsString()
  @IsOptional()
  voiceTone?: string;

  @ApiPropertyOptional({ example: 0.75, default: 0.70 })
  @IsNumber()
  @IsOptional()
  confidenceThreshold?: number;

  @ApiPropertyOptional({ example: ['en', 'es'] })
  @IsArray()
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  businessHours?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  outOfHoursMessage?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateAiEmployeeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  personalityPrompt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  voiceTone?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  confidenceThreshold?: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  businessHours?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  outOfHoursMessage?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateEscalationRuleDto {
  @ApiProperty({ example: 'LOW_CONFIDENCE', enum: ['LOW_CONFIDENCE', 'KEYWORD_MATCH', 'SENTIMENT_NEGATIVE', 'USER_REQUEST'] })
  @IsString()
  @IsNotEmpty()
  conditionType: string;

  @ApiPropertyOptional({ example: '0.65' })
  @IsString()
  @IsOptional()
  thresholdValue?: string;

  @ApiPropertyOptional({ example: 'TRANSFER_TO_AGENT' })
  @IsString()
  @IsOptional()
  action?: string;
}
