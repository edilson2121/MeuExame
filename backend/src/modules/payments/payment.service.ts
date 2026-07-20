import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPaymentIntent(userId: string, planId: string, phoneNumber: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    
    if (!plan) throw new NotFoundException('Plano não encontrado');
    if (!plan.isActive) throw new Error('Plano não disponível');

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        planId,
        amount: plan.price,
        status: 'PENDING',
        paymentMethod: phoneNumber.startsWith('84') || phoneNumber.startsWith('85') ? 'M_PESA' : 'E_MOLA',
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      include: { user: true, plan: true },
    });

    // Simulate M-Pesa payment (auto-approve after 5 seconds for demo)
    setTimeout(() => this.processPayment(payment.id), 5000);

    return {
      paymentId: payment.id,
      transactionId: payment.transactionId,
      amount: plan.price,
      status: 'PENDING',
      phoneNumber,
      message: 'Aguarde pela confirmação no seu telemóvel',
    };
  }

  async processPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { plan: true, user: true },
    });

    if (!payment || payment.status !== 'PENDING') return;

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'APPROVED', paidAt: new Date() },
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + payment.plan.duration);

    await this.prisma.subscription.upsert({
      where: { userId: payment.userId },
      update: {
        planId: payment.planId,
        status: 'ACTIVE',
        startDate,
        endDate,
        amount: payment.amount,
        isActive: true,
      },
      create: {
        userId: payment.userId,
        planId: payment.planId,
        status: 'ACTIVE',
        startDate,
        endDate,
        amount: payment.amount,
        isActive: true,
      },
    });
  }

  async getPaymentById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { user: true, plan: true },
    });
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });

    if (!subscription) return null;

    // Check expiration
    if (subscription.endDate && new Date() > subscription.endDate) {
      await this.prisma.subscription.update({
        where: { userId },
        data: { status: 'INACTIVE', isActive: false },
      });
      return { ...subscription, status: 'INACTIVE', isActive: false };
    }

    return subscription;
  }

  async getPendingPayments() {
    return this.prisma.payment.findMany({
      where: { status: 'PENDING' },
      include: { user: true, plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approvePayment(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    await this.processPayment(id);
    return { success: true };
  }

  async rejectPayment(id: string) {
    await this.prisma.payment.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
    return { success: true };
  }
}
