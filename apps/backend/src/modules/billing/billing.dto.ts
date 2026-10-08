import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanTier, BillingCycle } from '@prisma/client';

export class CreateCheckoutSessionDto {
  @ApiProperty({ enum: PlanTier, example: PlanTier.GROWTH })
  @IsEnum(PlanTier)
  plan: PlanTier;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ example: 'STRIPE', enum: ['STRIPE', 'RAZORPAY'] })
  @IsString()
  @IsNotEmpty()
  gateway: string;

  @ApiPropertyOptional({ example: 'https://konnector.ai/billing/success' })
  @IsString()
  @IsOptional()
  successUrl?: string;

  @ApiPropertyOptional({ example: 'https://konnector.ai/billing/cancel' })
  @IsString()
  @IsOptional()
  cancelUrl?: string;
}
