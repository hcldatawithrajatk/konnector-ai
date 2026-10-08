import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendTextMessageDto {
  @ApiProperty({ example: '+15559871234' })
  @IsString()
  @IsNotEmpty()
  recipientPhoneNumber: string;

  @ApiProperty({ example: 'Hello from your Admissions Officer at GreenField Academy!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  conversationId?: string;
}

export class RegisterWhatsAppChannelDto {
  @ApiProperty({ example: '108492039485721' })
  @IsString()
  @IsNotEmpty()
  phoneNumberId: string;

  @ApiProperty({ example: 'WABA_EDU_9921' })
  @IsString()
  @IsNotEmpty()
  wabaId: string;

  @ApiProperty({ example: '+1 555 019 2831' })
  @IsString()
  @IsNotEmpty()
  displayPhoneNumber: string;

  @ApiPropertyOptional({ example: 'GreenField Academy Admissions' })
  @IsString()
  @IsOptional()
  verifiedName?: string;

  @ApiProperty({ example: 'EAAG...' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ example: 'konnector_secure_verify_token_2026' })
  @IsString()
  @IsNotEmpty()
  webhookVerifyToken: string;
}
