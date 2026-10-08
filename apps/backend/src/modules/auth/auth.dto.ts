import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@konnector.ai' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SuperAdmin@Konnector2026!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Apex Clinic' })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({ example: 'apex-clinic' })
  @IsString()
  @IsNotEmpty()
  organizationSlug: string;

  @ApiProperty({ example: 'dr.smith@apex.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Dr. John Smith' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'SecurePassword2026!' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class FirebaseAuthDto {
  @ApiProperty({ description: 'Firebase ID Token obtained from Firebase Client SDK' })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
