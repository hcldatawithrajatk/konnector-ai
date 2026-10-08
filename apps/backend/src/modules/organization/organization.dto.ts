import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Oakridge International Academy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'oakridge-academy' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'admissions.oakridge.com' })
  @IsString()
  @IsOptional()
  customDomain?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '#0F52BA' })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customDomain?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isWhiteLabel?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  settings?: any;
}

export class InviteTeamMemberDto {
  @ApiProperty({ example: 'agent.john@oakridge.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Miller' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ enum: Role, default: Role.AGENT })
  @IsEnum(Role)
  role: Role;
}
