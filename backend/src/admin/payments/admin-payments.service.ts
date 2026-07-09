import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSubscriptionDto, ApprovePaymentDto, RecordPaymentDto } from './dto/payment.dto';
import { SubscriptionStatus, PaymentStatus } from '@prisma/client';

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
        user: true,
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
        user: true,
        subscription: true,
      },
    });

    return payment;
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
          endDate: this.calculateEndDate(),
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
        user: true,
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
        user: true,
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPendingPayments() {
    return this.prisma.paymentTransaction.findMany({
      where: { status: PaymentStatus.PENDING },
      include: {
        user: true,
        subscription: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAllPayments(status?: PaymentStatus) {
    return this.prisma.paymentTransaction.findMany({
      where: status ? { status } : {},
      include: {
        user: true,
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

  private calculateEndDate(): Date {
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    return endDate;
  }
}
