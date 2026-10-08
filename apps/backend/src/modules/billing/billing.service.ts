import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCheckoutSessionDto } from './billing.dto';
import { PlanTier, SubscriptionStatus, BillingCycle } from '@prisma/client';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  // Pricing matrix
  private readonly PLAN_DETAILS = {
    [PlanTier.TRIAL]: {
      name: 'Free Trial (14 Days)',
      monthlyPrice: 0,
      annualPrice: 0,
      conversationsLimit: 100,
      employeesLimit: 1,
      teamMembersLimit: 2,
    },
    [PlanTier.STARTER]: {
      name: 'Starter Plan',
      monthlyPrice: 49,
      annualPrice: 470, // 20% discount
      conversationsLimit: 1000,
      employeesLimit: 2,
      teamMembersLimit: 5,
    },
    [PlanTier.GROWTH]: {
      name: 'Growth Plan',
      monthlyPrice: 149,
      annualPrice: 1430,
      conversationsLimit: 5000,
      employeesLimit: 5,
      teamMembersLimit: 15,
    },
    [PlanTier.ENTERPRISE]: {
      name: 'Enterprise Plan',
      monthlyPrice: 399,
      annualPrice: 3830,
      conversationsLimit: 25000,
      employeesLimit: 20,
      teamMembersLimit: 50,
    },
  };

  constructor(private prisma: PrismaService) {}

  getPlansCatalog() {
    return this.PLAN_DETAILS;
  }

  async getSubscription(organizationId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!sub) {
      // Create trial if not exists
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);

      return this.prisma.subscription.create({
        data: {
          organizationId,
          plan: PlanTier.TRIAL,
          status: SubscriptionStatus.TRIALING,
          currentPeriodStart: new Date(),
          currentPeriodEnd: trialEnd,
        },
      });
    }

    return sub;
  }

  async createCheckoutSession(organizationId: string, dto: CreateCheckoutSessionDto) {
    const planMeta = this.PLAN_DETAILS[dto.plan];
    const amount = dto.billingCycle === BillingCycle.YEARLY ? planMeta.annualPrice : planMeta.monthlyPrice;

    if (dto.gateway === 'RAZORPAY') {
      // Create Razorpay Order
      const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;
      return {
        gateway: 'RAZORPAY',
        orderId: razorpayOrderId,
        amount: amount * 100, // in cents/paise
        currency: 'USD',
        plan: dto.plan,
        key: 'rzp_test_mock_key',
      };
    }

    // Default Stripe Checkout Session
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 16)}`;
    const checkoutUrl = dto.successUrl ? `${dto.successUrl}?session_id=${mockSessionId}` : `https://checkout.stripe.com/pay/${mockSessionId}`;

    return {
      gateway: 'STRIPE',
      sessionId: mockSessionId,
      url: checkoutUrl,
      amount,
      plan: dto.plan,
    };
  }

  /**
   * Process Successful Payment Webhook (Stripe/Razorpay)
   */
  async handlePaymentSuccess(params: {
    organizationId: string;
    plan: PlanTier;
    billingCycle: BillingCycle;
    amount: number;
    transactionId: string;
    gateway: string;
  }) {
    const { organizationId, plan, billingCycle, amount, transactionId, gateway } = params;

    const periodEnd = new Date();
    if (billingCycle === BillingCycle.YEARLY) {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Update subscription
    const sub = await this.prisma.subscription.upsert({
      where: { organizationId },
      update: {
        plan,
        billingCycle,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
      },
      create: {
        organizationId,
        plan,
        billingCycle,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
      },
    });

    // Create Invoice with GST (18%)
    const gstRate = 0.18;
    const gstAmount = Number((amount * gstRate).toFixed(2));
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        organizationId,
        subscriptionId: sub.id,
        invoiceNumber: invoiceNum,
        amount,
        gstAmount,
        currency: 'USD',
        status: 'PAID',
        paymentGateway: gateway,
        transactionId,
        paidAt: new Date(),
      },
    });

    this.logger.log(`Subscription activated for org ${organizationId}: ${plan} tier. Invoice ${invoiceNum} generated.`);
    return invoice;
  }
}
