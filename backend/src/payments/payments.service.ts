import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPaymentDto: CreatePaymentDto) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: createPaymentDto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    if (!plan.isActive) {
      throw new BadRequestException('Plano não está ativo');
    }

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        ...createPaymentDto,
        amount: plan.price,
      },
      include: {
        plan: true,
      },
    });

    return payment;
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return payment;
  }

  async updateStatus(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (updatePaymentDto.status === PaymentStatus.APPROVED && payment.status !== PaymentStatus.APPROVED) {
      // Create subscription when payment is completed
      await this.createSubscription(payment.userId, payment.planId);
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        ...updatePaymentDto,
        paidAt: updatePaymentDto.status === PaymentStatus.APPROVED ? new Date() : payment.paidAt,
      },
    });
  }

  private async createSubscription(userId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    // Check if user already has a subscription
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      // Update existing subscription
      return this.prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          status: 'ACTIVE',
          startDate,
          endDate,
        },
      });
    }

    // Create new subscription
    return this.prisma.subscription.create({
      data: {
        user: {
          connect: { id: userId },
        },
        plan: {
          connect: { id: planId },
        },
        amount: plan.duration * 100, // Default amount calculation
        currency: 'MZN',
        status: 'ACTIVE',
        startDate,
        endDate,
      },
    });
  }
}
