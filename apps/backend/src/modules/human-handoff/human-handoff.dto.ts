import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TakeoverConversationDto {
  @ApiPropertyOptional({ example: 'Customer inquired about custom enterprise discount which requires executive sign-off' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ReturnToAiDto {
  @ApiPropertyOptional({ example: 'Resolved pricing inquiry and re-enabled AI employee Maya' })
  @IsString()
  @IsOptional()
  resolutionNotes?: string;
}
