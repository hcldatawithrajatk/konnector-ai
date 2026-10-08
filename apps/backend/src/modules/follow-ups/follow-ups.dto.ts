import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSequenceStepDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  stepOrder: number;

  @ApiProperty({ example: 24, description: 'Delay in hours before dispatching step' })
  @IsNumber()
  delayHours: number;

  @ApiProperty({ example: 'Hi {{name}}, just checking if you had any questions regarding our programs?' })
  @IsString()
  @IsNotEmpty()
  messageTemplate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mediaUrl?: string;
}

export class CreateFollowUpSequenceDto {
  @ApiProperty({ example: 'Parent 14-Day Nurture Sequence' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Nurture parents who inquired about admissions' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'LEAD_CREATED' })
  @IsString()
  @IsNotEmpty()
  triggerEvent: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  stopOnReply?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  stopOnBooking?: boolean;

  @ApiProperty({ type: [CreateSequenceStepDto] })
  @IsArray()
  steps: CreateSequenceStepDto[];
}
