import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface DebitPayConfig {
  apiKey: string;
  merchantId: string;
  walletCodeMpesa: string;
  walletCodeEmola: string;
  baseUrl: string;
  callbackUrl: string;
}

export interface PaymentInitResult {
  success: boolean;
  reference: string;
  message: string;
  method: 'MPESA' | 'EMOLA';
}

export interface PaymentStatusResult {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  reference: string;
  message: string;
  amount?: number;
  transactionId?: string;
  paidAt?: Date;
}

export interface DebitPayWebhookPayload {
  event: string;
  type: 'payment' | 'notification';
  data: {
    id?: string;
    reference?: string;
    status?: string;
    amount?: number;
    phone?: string;
    method?: string;
    transactionId?: string;
    timestamp?: string;
  };
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private config: DebitPayConfig;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.config = {
      apiKey: this.configService.get('DEBITPAY_API_KEY') || 'demo_key',
      merchantId: this.configService.get('DEBITPAY_MERCHANT_ID') || 'demo_merchant',
      walletCodeMpesa: this.configService.get('DEBITPAY_WALLET_CODE') || 'mpesa_wallet',
      walletCodeEmola: this.configService.get('DEBITPAY_WALLET_CODE_EMOLA') || 'emola_wallet',
      baseUrl: this.configService.get('DEBITPAY_API_URL') || 'https://api.debito.co.mz',
      callbackUrl: this.configService.get('DEBITPAY_CALLBACK_URL') || 'http://localhost:3001/api/wallet/webhook',
    };
  }

  /**
   * Generate a unique payment reference
   */
  private generateReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ME${timestamp}${random}`;
  }

  /**
   * Get access token from DebitPay
   */
  private async getAccessToken(): Promise<string> {
    // In demo mode, return a mock token
    if (this.config.apiKey === 'demo_key') {
      return 'demo_token_' + Date.now();
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.config.baseUrl}/auth/token`, {
          apiKey: this.config.apiKey,
        })
      );
      return response.data.accessToken;
    } catch (error) {
      this.logger.error('Failed to get DebitPay access token', error);
      throw new BadRequestException('Erro ao conectar com DebitPay');
    }
  }

  /**
   * Initiate M-Pesa payment via STK Push
   */
  private async initiateMpesaPayment(
    phone: string,
    amount: number,
    reference: string,
    userId?: string,
  ): Promise<PaymentInitResult> {
    // Demo mode - simulate successful response
    if (this.config.apiKey === 'demo_key') {
      this.logger.log(`[DEMO] Initiating M-Pesa payment: ${reference}`);
      
      // Create demo transaction
      await this.createTransaction({
        reference,
        userId,
        method: 'MPESA',
        amount,
        phone,
      });

      // Simulate callback after 10-15 seconds
      setTimeout(() => {
        this.simulatePaymentSuccess(reference);
      }, 10000 + Math.random() * 5000);

      return {
        success: true,
        reference,
        message: 'STK Push enviado! Confirme no seu celular.',
        method: 'MPESA',
      };
    }

    try {
      const token = await this.getAccessToken();

      // Call DebitPay M-Pesa API
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/payments/mpesa/stk`,
          {
            phone: this.formatPhone(phone),
            amount,
            reference,
            walletCode: this.config.walletCodeMpesa,
            callbackUrl: `${this.config.callbackUrl}/mpesa`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      await this.createTransaction({
        reference,
        userId,
        method: 'MPESA',
        amount,
        phone,
        externalId: response.data?.transactionId,
      });

      return {
        success: true,
        reference,
        message: 'STK Push enviado! Confirme no seu celular.',
        method: 'MPESA',
      };
    } catch (error: any) {
      this.logger.error('M-Pesa payment initiation failed', error);
      throw new BadRequestException(
        error?.response?.data?.message || 'Erro ao processar pagamento M-Pesa'
      );
    }
  }

  /**
   * Initiate eMola payment
   */
  private async initiateEmolaPayment(
    phone: string,
    amount: number,
    reference: string,
    userId?: string,
  ): Promise<PaymentInitResult> {
    // Demo mode
    if (this.config.apiKey === 'demo_key') {
      this.logger.log(`[DEMO] Initiating eMola payment: ${reference}`);

      await this.createTransaction({
        reference,
        userId,
        method: 'EMOLA',
        amount,
        phone,
      });

      // Simulate callback
      setTimeout(() => {
        this.simulatePaymentSuccess(reference);
      }, 10000 + Math.random() * 5000);

      return {
        success: true,
        reference,
        message: 'Notificação enviada para eMola! Confirme no seu celular.',
        method: 'EMOLA',
      };
    }

    try {
      const token = await this.getAccessToken();

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/payments/emola/push`,
          {
            phone: this.formatPhone(phone),
            amount,
            reference,
            walletCode: this.config.walletCodeEmola,
            callbackUrl: `${this.config.callbackUrl}/emola`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      await this.createTransaction({
        reference,
        userId,
        method: 'EMOLA',
        amount,
        phone,
        externalId: response.data?.transactionId,
      });

      return {
        success: true,
        reference,
        message: 'Notificação enviada para eMola! Confirme no seu celular.',
        method: 'EMOLA',
      };
    } catch (error: any) {
      this.logger.error('eMola payment initiation failed', error);
      throw new BadRequestException(
        error?.response?.data?.message || 'Erro ao processar pagamento eMola'
      );
    }
  }

  /**
   * Format phone number to M-Pesa/eMola format
   */
  private formatPhone(phone: string): string {
    let formatted = phone.replace(/\D/g, '');
    
    // Remove country code if present
    if (formatted.startsWith('258')) {
      formatted = formatted.substring(3);
    }
    
    // Add 258 if not present
    if (!formatted.startsWith('258')) {
      formatted = '258' + formatted;
    }
    
    return formatted;
  }

  /**
   * Create a transaction record
   */
  private async createTransaction(data: {
    reference: string;
    userId?: string;
    method: 'MPESA' | 'EMOLA';
    amount: number;
    phone: string;
    externalId?: string;
  }) {
    return this.prisma.walletTransaction.create({
      data: {
        reference: data.reference,
        externalId: data.externalId,
        method: data.method,
        amount: data.amount,
        phone: data.phone,
        status: 'PENDING',
      },
    });
  }

  /**
   * Simulate successful payment (demo mode)
   */
  private async simulatePaymentSuccess(reference: string) {
    try {
      await this.prisma.walletTransaction.update({
        where: { reference },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });
      this.logger.log(`[DEMO] Payment completed: ${reference}`);
    } catch (error) {
      this.logger.error('Failed to update demo payment status', error);
    }
  }

  /**
   * Initiate payment
   */
  async initiatePayment(data: {
    examId: string;
    method: 'MPESA' | 'EMOLA';
    phone: string;
    amount: number;
    userId?: string;
  }): Promise<PaymentInitResult> {
    const reference = this.generateReference();

    // Validate exam exists
    const exam = await this.prisma.exam.findUnique({
      where: { id: data.examId },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado');
    }

    // Validate phone number
    if (!this.isValidPhone(data.phone, data.method)) {
      throw new BadRequestException(
        `Número de telefone inválido para ${data.method === 'MPESA' ? 'M-Pesa' : 'eMola'}`
      );
    }

    // Initiate payment based on method
    if (data.method === 'MPESA') {
      return this.initiateMpesaPayment(data.phone, data.amount, reference, data.userId);
    } else {
      return this.initiateEmolaPayment(data.phone, data.amount, reference, data.userId);
    }
  }

  /**
   * Validate phone number based on method
   */
  private isValidPhone(phone: string, method: 'MPESA' | 'EMOLA'): boolean {
    const cleaned = phone.replace(/\D/g, '');
    
    if (method === 'MPESA') {
      // M-Pesa: 82, 83, 84, 85, 86, 87
      return /^(258)?(82|83|84|85|86|87)\d{7}$/.test(cleaned);
    } else {
      // eMola: 82, 83, 84, 85, 86, 87
      return /^(258)?(82|83|84|85|86|87)\d{7}$/.test(cleaned);
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(reference: string): Promise<PaymentStatusResult> {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { reference },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return {
      status: transaction.status,
      reference: transaction.reference,
      message: this.getStatusMessage(transaction.status),
      amount: transaction.amount,
      transactionId: transaction.externalId || undefined,
      paidAt: transaction.paidAt || undefined,
    };
  }

  /**
   * Get status message
   */
  private getStatusMessage(status: string): string {
    const messages: Record<string, string> = {
      PENDING: 'Aguardando confirmação no celular',
      COMPLETED: 'Pagamento confirmado!',
      FAILED: 'Pagamento recusado',
      EXPIRED: 'Pagamento expirado',
    };
    return messages[status] || 'Status desconhecido';
  }

  /**
   * Handle M-Pesa webhook callback
   */
  async handleMpesaCallback(payload: any): Promise<void> {
    this.logger.log('M-Pesa webhook received:', JSON.stringify(payload));

    const { reference, resultCode, mpesaReceiptNumber } = payload;

    if (!reference) {
      this.logger.warn('M-Pesa callback missing reference');
      return;
    }

    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { reference },
    });

    if (!transaction) {
      this.logger.warn(`Transaction not found: ${reference}`);
      return;
    }

    if (resultCode === 0 || resultCode === '0') {
      // Success
      await this.prisma.walletTransaction.update({
        where: { reference },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
          externalId: mpesaReceiptNumber,
        },
      });

      // Grant exam access
      if (transaction.userId) {
        await this.grantExamAccess(transaction.userId, transaction.reference);
      }
    } else {
      // Failed
      await this.prisma.walletTransaction.update({
        where: { reference },
        data: { status: 'FAILED' },
      });
    }
  }

  /**
   * Handle eMola webhook callback
   */
  async handleEmolaCallback(payload: any): Promise<void> {
    this.logger.log('eMola webhook received:', JSON.stringify(payload));

    const { reference, status, transactionId } = payload;

    if (!reference) {
      this.logger.warn('eMola callback missing reference');
      return;
    }

    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { reference },
    });

    if (!transaction) {
      this.logger.warn(`Transaction not found: ${reference}`);
      return;
    }

    if (status === 'SUCCESS' || status === 'COMPLETED') {
      await this.prisma.walletTransaction.update({
        where: { reference },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
          externalId: transactionId,
        },
      });

      if (transaction.userId) {
        await this.grantExamAccess(transaction.userId, transaction.reference);
      }
    } else {
      await this.prisma.walletTransaction.update({
        where: { reference },
        data: { status: 'FAILED' },
      });
    }
  }

  /**
   * Grant exam access after successful payment
   */
  private async grantExamAccess(userId: string, transactionReference: string): Promise<void> {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { reference: transactionReference },
    });

    if (!transaction) {
      this.logger.warn(`Transaction not found for access grant: ${transactionReference}`);
      return;
    }

    // Find the exam from the reference or create a default one
    const examId = transaction.reference.includes('EXAM') 
      ? transaction.reference.split('EXAM')[1]?.substring(0, 24) 
      : null;

    if (examId) {
      await this.prisma.examAccess.create({
        data: {
          userId,
          examId,
          transactionReference,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      });
    }
  }

  /**
   * Get user's transaction history
   */
  async getUserTransactions(userId: string) {
    return this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Get all transactions (admin)
   */
  async getAllTransactions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.walletTransaction.count(),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
