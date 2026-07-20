import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface DebitoPayWebhookPayload {
  event: string;
  data: {
    transactionId: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    amount: number;
    phone: string;
    instructionId?: string;
    reference?: string;
    timestamp?: string;
  };
  signature?: string;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private prisma: PrismaService) {}

  async handleDebitoPayWebhook(payload: DebitoPayWebhookPayload): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Received DebitoPay webhook: ${JSON.stringify(payload)}`);

    try {
      const { event, data } = payload;

      // Find payment by instructionId or transactionId
      let payment = await this.prisma.payment.findFirst({
        where: {
          OR: [
            { instructionId: data.instructionId },
            { transactionId: data.transactionId },
          ],
        },
        include: {
          user: true,
          exam: true,
        },
      });

      if (!payment) {
        this.logger.warn(`Payment not found for instructionId: ${data.instructionId}`);
        return { success: false, message: 'Payment not found' };
      }

      // Update payment with webhook data
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          webhookData: payload as any,
          transactionId: data.transactionId || payment.transactionId,
          paidAt: data.status === 'SUCCESS' ? new Date() : null,
        },
      });

      if (data.status === 'SUCCESS') {
        // Update payment status to completed
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'APPROVED' },
        });

        // Grant access to exam or subscription
        if (payment.examId) {
          // Grant exam access
          await this.grantExamAccess(payment.userId, payment.examId);
        } else if (payment.planId) {
          // Grant subscription
          await this.activateSubscription(payment.userId, payment.planId);
        }

        this.logger.log(`Payment completed for user ${payment.userId}: ${payment.amount} MZN`);
        return { success: true, message: 'Payment processed successfully' };
      } else if (data.status === 'FAILED') {
        // Update payment status to failed
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'REJECTED' },
        });

        this.logger.warn(`Payment failed for user ${payment.userId}`);
        return { success: true, message: 'Payment failure recorded' };
      }

      return { success: true, message: 'Webhook processed' };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
      return { success: false, message: 'Internal server error' };
    }
  }

  private async grantExamAccess(userId: string, examId: string) {
    // Check if access already exists
    const existingAccess = await this.prisma.examAccess.findUnique({
      where: {
        examId_userId: { examId, userId },
      },
    });

    if (!existingAccess) {
      await this.prisma.examAccess.create({
        data: {
          userId,
          examId,
          type: 'PAID',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      });
      this.logger.log(`Exam access granted to user ${userId} for exam ${examId}`);
    }
  }

  private async activateSubscription(userId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        planId,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate,
        isActive: true,
        amount: plan.price,
      },
      create: {
        userId,
        planId,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate,
        isActive: true,
        amount: plan.price,
      },
    });

    this.logger.log(`Subscription activated for user ${userId} until ${endDate}`);
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Implement signature verification if DebitoPay provides a signing secret
    // For now, we'll accept the webhook if it comes from our trusted source
    return true;
  }
}
