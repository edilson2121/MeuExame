import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ApprovePaymentDto,
  CreateSubscriptionDto,
  MarkUserPaidDto,
  RecordPaymentDto,
} from './dto/payment.dto';
import { PaymentStatus, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  institutionId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class AdminPaymentsService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Check if user already has a subscription
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { userId: dto.userId },
    });

    if (existingSubscription) {
      throw new BadRequestException('Este usuário já possui uma assinatura');
    }

    return this.prisma.subscription.create({
      data: {
        userId: dto.userId,
        plan: dto.plan,
        amount: dto.amount,
        currency: dto.currency ?? 'MZN',
        status: SubscriptionStatus.INACTIVE,
        isActive: false,
      },
      include: {
        user: { select: safeUserSelect },
      },
    });
  }

  async recordPayment(dto: RecordPaymentDto, adminId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: dto.subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (subscription.userId !== dto.userId) {
      throw new BadRequestException('Assinatura não pertence a este usuário');
    }

    const payment = await this.prisma.paymentTransaction.create({
      data: {
        userId: dto.userId,
        subscriptionId: dto.subscriptionId,
        amount: dto.amount,
        method: dto.method,
        reference: dto.reference,
        currency: dto.currency ?? 'MZN',
        status: PaymentStatus.PENDING,
      },
      include: {
        user: { select: safeUserSelect },
        subscription: true,
      },
    });

    return payment;
  }

  async markUserPaid(dto: MarkUserPaidDto, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const now = new Date();
    const endDate = this.calculateEndDate(dto.plan, now);
    const subscription = await this.prisma.subscription.upsert({
      where: { userId: dto.userId },
      create: {
        userId: dto.userId,
        plan: dto.plan,
        amount: dto.amount,
        currency: dto.currency ?? 'MZN',
        status: SubscriptionStatus.ACTIVE,
        isActive: true,
        startDate: now,
        endDate,
      },
      update: {
        plan: dto.plan,
        amount: dto.amount,
        currency: dto.currency ?? 'MZN',
        status: SubscriptionStatus.ACTIVE,
        isActive: true,
        startDate: now,
        endDate,
      },
    });

    const payment = await this.prisma.paymentTransaction.create({
      data: {
        userId: dto.userId,
        subscriptionId: subscription.id,
        amount: dto.amount,
        currency: dto.currency ?? 'MZN',
        method: dto.method,
        reference: dto.reference,
        status: PaymentStatus.APPROVED,
        approvedBy: adminId,
        approvedAt: now,
      },
      include: {
        user: { select: safeUserSelect },
        subscription: true,
      },
    });

    if (user.institutionId) {
      await this.prisma.institution.update({
        where: { id: user.institutionId },
        data: {
          isPaid: true,
          paidAt: now,
        },
      });
    }

    return { subscription, payment };
  }

  async approvePayment(paymentId: string, dto: ApprovePaymentDto, adminId: string) {
    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { id: paymentId },
      include: {
        subscription: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    const newStatus = dto.approve ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;

    const updatedPayment = await this.prisma.paymentTransaction.update({
      where: { id: paymentId },
      data: {
        status: newStatus,
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });

    // If approved, activate subscription
    if (dto.approve) {
      await this.prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: {
          status: SubscriptionStatus.ACTIVE,
          isActive: true,
          startDate: new Date(),
          endDate: this.calculateEndDate(payment.subscription.plan),
        },
      });

      // Update institution payment status if user is linked to one
      const user = await this.prisma.user.findUnique({
        where: { id: payment.userId },
      });

      if (user?.institutionId) {
        await this.prisma.institution.update({
          where: { id: user.institutionId },
          data: {
            isPaid: true,
            paidAt: new Date(),
          },
        });
      }
    }

    return updatedPayment;
  }

  async getSubscriptionByUserId(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: { select: safeUserSelect },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getPaymentsByUserId(userId: string) {
    return this.prisma.paymentTransaction.findMany({
      where: { userId },
      include: {
        user: { select: safeUserSelect },
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPendingPayments() {
    return this.prisma.paymentTransaction.findMany({
      where: { status: PaymentStatus.PENDING },
      include: {
        user: { select: safeUserSelect },
        subscription: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAllPayments(status?: PaymentStatus) {
    return this.prisma.paymentTransaction.findMany({
      where: status ? { status } : {},
      include: {
        user: { select: safeUserSelect },
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInstitutionPaymentStatus(institutionId: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
      include: {
        users: {
          include: {
            subscription: {
              include: {
                payments: true,
              },
            },
          },
        },
      },
    });

    if (!institution) {
      throw new NotFoundException('Instituição não encontrada');
    }

    return {
      institution,
      isPaid: institution.isPaid,
      paidAt: institution.paidAt,
      users: institution.users,
    };
  }

  private calculateEndDate(plan: SubscriptionPlan, from = new Date()): Date {
    const endDate = new Date(from);
    const daysByPlan: Record<SubscriptionPlan, number> = {
      DAILY: 1,
      WEEKLY: 7,
      MONTHLY: 30,
    };

    endDate.setDate(endDate.getDate() + daysByPlan[plan]);
    return endDate;
  }
}
