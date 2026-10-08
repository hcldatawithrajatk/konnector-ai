import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './billing.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('Billing & Subscriptions')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans and limits' })
  getPlans() {
    return this.billingService.getPlansCatalog();
  }

  @Get('subscription')
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current tenant subscription details & invoice history' })
  getSubscription(@CurrentTenant() tenantId: string) {
    return this.billingService.getSubscription(tenantId);
  }

  @Post('checkout')
  @UseGuards(AuthGuard('jwt'), TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe / Razorpay checkout session' })
  createCheckout(@CurrentTenant() tenantId: string, @Body() dto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession(tenantId, dto);
  }
}
