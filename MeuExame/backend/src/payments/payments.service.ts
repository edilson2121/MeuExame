import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DebitoPayService } from './debitopay.service';
import { CreatePaymentDto, PaymentMethod } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private debitoPayService: DebitoPayService,
  ) {}

  async initiatePayment(userId: string, dto: CreatePaymentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Format and validate phone number
    const formattedPhone = this.debitoPayService.formatPhoneNumber(dto.numeroTelefone);
    
    if (!this.debitoPayService.validatePhoneNumber(formattedPhone, dto.method)) {
      throw new BadRequestException('Número de telefone inválido para o método de pagamento selecionado');
    }

    // Generate unique reference
    const reference = `MEUEXAME-${Date.now()}-${userId.substring(0, 8)}`;

    // Get or create subscription
    let subscription = user.subscription;
    if (!subscription) {
      subscription = await this.prisma.subscription.create({
        data: {
          userId,
          plan: 'BASIC',
          status: 'INACTIVE',
          amount: dto.amount,
          currency: 'MZN',
        },
      });
    }

    // Create payment transaction
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amount: dto.amount,
        currency: 'MZN',
        status: PaymentStatus.PENDING,
        method: dto.method === PaymentMethod.MPESA ? 'MOBILE_MONEY' : 'OTHER',
        reference,
      },
    });

    // Initiate payment with DebitoPay
    let paymentResult;
    try {
      if (dto.method === PaymentMethod.MPESA) {
        paymentResult = await this.debitoPayService.initiateMpesaPayment(
          formattedPhone,
          dto.amount,
          reference,
        );
      } else {
        paymentResult = await this.debitoPayService.initiateEmolaPayment(
          formattedPhone,
          dto.amount,
          reference,
        );
      }
    } catch (error) {
      // Update transaction status to rejected if payment initiation fails
      await this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: PaymentStatus.REJECTED },
      });
      throw error;
    }

    return {
      success: true,
      transactionId: reference,
      pending: paymentResult.pending,
      confirmed: paymentResult.confirmed,
      reference,
    };
  }

  async checkPaymentStatus(reference: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { reference },
      include: { subscription: true },
    });

    if (!transaction) {
      throw new BadRequestException('Transação não encontrada');
    }

    // Check status with DebitoPay
    const statusResult = await this.debitoPayService.checkPaymentStatus(reference);

    // Update transaction status based on DebitoPay response
    let newStatus: PaymentStatus;
    switch (statusResult.status) {
      case 'completed':
        newStatus = PaymentStatus.APPROVED;
        break;
      case 'cancelled':
        newStatus = PaymentStatus.REJECTED;
        break;
      case 'failed':
        newStatus = PaymentStatus.REJECTED;
        break;
      default:
        newStatus = PaymentStatus.PENDING;
    }

    // Update transaction
    await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: { status: newStatus },
    });

    // If payment approved, activate subscription
    if (newStatus === PaymentStatus.APPROVED && transaction.subscription) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

      await this.prisma.subscription.update({
        where: { id: transaction.subscriptionId },
        data: {
          status: 'ACTIVE',
          startDate,
          endDate,
          isActive: true,
        },
      });
    }

    return {
      status: newStatus,
      transactionId: reference,
    };
  }

  async getUserPayments(userId: string) {
    return this.prisma.paymentTransaction.findMany({
      where: { userId },
      include: { subscription: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPayments() {
    return this.prisma.paymentTransaction.findMany({
      include: { 
        user: { select: { id: true, name: true, email: true } },
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePaymentStatus(transactionId: string, status: PaymentStatus, approvedBy?: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { subscription: true },
    });

    if (!transaction) {
      throw new BadRequestException('Transação não encontrada');
    }

    await this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status,
        approvedBy,
        approvedAt: status === PaymentStatus.APPROVED ? new Date() : null,
      },
    });

    // If payment approved, activate subscription
    if (status === PaymentStatus.APPROVED && transaction.subscription) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await this.prisma.subscription.update({
        where: { id: transaction.subscriptionId },
        data: {
          status: 'ACTIVE',
          startDate,
          endDate,
          isActive: true,
        },
      });
    }

    return { success: true };
  }

  async getUserSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { payments: true },
    });

    if (!subscription) {
      return null;
    }

    // Check if subscription is still active
    const isActive = subscription.isActive && 
                     subscription.endDate && 
                     new Date() < subscription.endDate;

    return {
      ...subscription,
      isActive,
    };
  }
}
