import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export type PaymentMethod = 'MPESA' | 'EMOLA' | 'DEBITPAY';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

export interface WalletTransaction {
  id: string;
  userId: string;
  examId: string;
  method: PaymentMethod;
  phone: string;
  amount: number;
  reference: string;
  externalId: string | null;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInitResult {
  success: boolean;
  reference: string;
  externalId?: string;
  message: string;
  expiresAt?: Date;
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  
  // M-Pesa API Configuration (API SHAVA - Demo/Test Environment)
  private readonly MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
  private readonly MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'demo_key';
  private readonly MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'demo_secret';
  private readonly MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://api.meuexame.co.mz/api/wallet/webhooks/mpesa';
  private readonly MPESA_BASE_URL = process.env.MPESA_ENV === 'production' 
    ? 'https://api.safaricom.com' 
    : 'https://sandbox.safaricom.com';

  // eMola API Configuration
  private readonly EMOLA_API_URL = process.env.EMOLA_API_URL || 'https://api.emola.co.mz';
  private readonly EMOLA_API_KEY = process.env.EMOLA_API_KEY || 'demo_key';
  private readonly EMOLA_CALLBACK_URL = process.env.EMOLA_CALLBACK_URL || 'https://api.meuexame.co.mz/api/wallet/webhooks/emola';

  // DebitPay API Configuration
  private readonly DEBITPAY_API_URL = process.env.DEBITPAY_API_URL || 'https://api.debitpay.co.mz';
  private readonly DEBITPAY_API_KEY = process.env.DEBITPAY_API_KEY || 'demo_key';
  private readonly DEBITPAY_CALLBACK_URL = process.env.DEBITPAY_CALLBACK_URL || 'https://api.meuexame.co.mz/api/wallet/webhooks/debitpay';

  constructor(private prisma: PrismaService) {}

  /**
   * Generate unique reference for transaction
   */
  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ME${timestamp}${random}`;
  }

  /**
   * Validate phone number format for Mozambique
   */
  validatePhone(phone: string, method: PaymentMethod): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('258')) {
      return this.validatePhoneNumber(cleanPhone.slice(3), method);
    }
    
    return this.validatePhoneNumber(cleanPhone, method);
  }

  private validatePhoneNumber(phone: string, method: PaymentMethod): boolean {
    if (phone.length !== 9) return false;
    
    const prefixes: Record<PaymentMethod, string[]> = {
      MPESA: ['84', '85'],
      EMOLA: ['86', '87'],
      DEBITPAY: ['84', '85', '86', '87'],
    };
    
    const validPrefixes = prefixes[method];
    const prefix = phone.slice(0, 2);
    
    return validPrefixes.includes(prefix);
  }

  /**
   * Format phone number to international format
   */
  formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('258')) {
      return cleanPhone;
    }
    return `258${cleanPhone}`;
  }

  /**
   * Initiate payment with selected wallet method
   */
  async initiatePayment(
    userId: string,
    examId: string,
    method: PaymentMethod,
    phone: string,
    amount: number
  ): Promise<PaymentInitResult> {
    try {
      // Validate phone
      if (!this.validatePhone(phone, method)) {
        return {
          success: false,
          reference: '',
          message: `Número de telefone inválido para ${method}`,
        };
      }

      const reference = this.generateReference();
      const formattedPhone = this.formatPhone(phone);

      // Create transaction record
      const transaction = await this.prisma.walletTransaction.create({
        data: {
          userId,
          examId,
          method,
          phone: formattedPhone,
          amount,
          reference,
          status: 'PENDING',
        },
      });

      // Call appropriate payment provider
      let result: PaymentInitResult;
      
      switch (method) {
        case 'MPESA':
          result = await this.initiateMpesaPayment(transaction.id, formattedPhone, amount, reference);
          break;
        case 'EMOLA':
          result = await this.initiateEmolaPayment(transaction.id, formattedPhone, amount, reference);
          break;
        case 'DEBITPAY':
          result = await this.initiateDebitPayPayment(transaction.id, formattedPhone, amount, reference);
          break;
        default:
          return { success: false, reference, message: 'Método de pagamento não suportado' };
      }

      // Update transaction with external ID if provided
      if (result.externalId) {
        await this.prisma.walletTransaction.update({
          where: { id: transaction.id },
          data: { externalId: result.externalId },
        });
      }

      return result;
    } catch (error) {
      this.logger.error('Error initiating payment:', error);
      return { success: false, reference: '', message: 'Erro ao processar pagamento' };
    }
  }

  /**
   * Initiate M-Pesa STK Push
   */
  private async initiateMpesaPayment(
    transactionId: string,
    phone: string,
    amount: number,
    reference: string
  ): Promise<PaymentInitResult> {
    try {
      // For demo mode, simulate M-Pesa response
      if (process.env.MPESA_ENV !== 'production') {
        this.logger.log(`[DEMO] M-Pesa payment initiated: ${reference}`);
        
        // Simulate external ID
        const externalId = `MP${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Schedule status check
        this.scheduleStatusCheck(transactionId);
        
        return {
          success: true,
          reference,
          externalId,
          message: 'Aguarde o código no seu telemóvel M-Pesa',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        };
      }

      // Get OAuth token
      const token = await this.getMpesaToken();
      
      // Prepare STK Push request
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = Buffer.from(`${this.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893051bef6fdc56b9f39053439'}${timestamp}`).toString('base64');

      const response = await fetch(`${this.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: this.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.ceil(amount),
          PartyA: phone,
          PartyB: this.MPESA_SHORTCODE,
          PhoneNumber: phone,
          CallBackURL: this.MPESA_CALLBACK_URL,
          AccountReference: reference,
          TransactionDesc: `MeuExame - ${reference}`,
        }),
      });

      const data = await response.json();
      
      if (data.ResponseCode === '0') {
        this.scheduleStatusCheck(transactionId);
        
        return {
          success: true,
          reference,
          externalId: data.CheckoutRequestID,
          message: 'Aguarde o código no seu telemóvel M-Pesa',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        };
      }

      return { success: false, reference, message: data.ResponseDescription || 'Erro M-Pesa' };
    } catch (error) {
      this.logger.error('M-Pesa payment error:', error);
      return { success: false, reference, message: 'Erro ao processar M-Pesa' };
    }
  }

  /**
   * Initiate eMola Payment
   */
  private async initiateEmolaPayment(
    transactionId: string,
    phone: string,
    amount: number,
    reference: string
  ): Promise<PaymentInitResult> {
    try {
      // For demo mode, simulate eMola response
      if (process.env.EMOLA_API_KEY === 'demo_key') {
        this.logger.log(`[DEMO] eMola payment initiated: ${reference}`);
        
        const externalId = `EM${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        this.scheduleStatusCheck(transactionId);
        
        return {
          success: true,
          reference,
          externalId,
          message: 'Aguarde notificação no seu telemóvel eMola',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        };
      }

      const response = await fetch(`${this.EMOLA_API_URL}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.EMOLA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          amount: Math.ceil(amount),
          reference: reference,
          callback_url: this.EMOLA_CALLBACK_URL,
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success' || data.status === 'pending') {
        this.scheduleStatusCheck(transactionId);
        
        return {
          success: true,
          reference,
          externalId: data.transaction_id,
          message: 'Aguarde notificação no seu telemóvel eMola',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        };
      }

      return { success: false, reference, message: data.message || 'Erro eMola' };
    } catch (error) {
      this.logger.error('eMola payment error:', error);
      return { success: false, reference, message: 'Erro ao processar eMola' };
    }
  }

  /**
   * Initiate DebitPay Payment
   */
  private async initiateDebitPayPayment(
    transactionId: string,
    phone: string,
    amount: number,
    reference: string
  ): Promise<PaymentInitResult> {
    try {
      // For demo mode, simulate DebitPay response
      if (process.env.DEBITPAY_API_KEY === 'demo_key') {
        this.logger.log(`[DEMO] DebitPay payment initiated: ${reference}`);
        
        const externalId = `DP${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const paymentCode = `DP${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        
        this.scheduleStatusCheck(transactionId);
        
        return {
          success: true,
          reference,
          externalId,
          message: `Código de pagamento: ${paymentCode}`,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        };
      }

      const response = await fetch(`${this.DEBITPAY_API_URL}/v1/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.DEBITPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          amount: Math.ceil(amount),
          reference: reference,
          callback_url: this.DEBITPAY_CALLBACK_URL,
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success' || data.status === 'pending') {
        this.scheduleStatusCheck(transactionId);
        
        return {
          success: true,
          reference,
          externalId: data.payment_code || data.transaction_id,
          message: `Código de pagamento: ${data.payment_code}`,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        };
      }

      return { success: false, reference, message: data.message || 'Erro DebitPay' };
    } catch (error) {
      this.logger.error('DebitPay payment error:', error);
      return { success: false, reference, message: 'Erro ao processar DebitPay' };
    }
  }

  /**
   * Schedule automatic status check
   */
  private scheduleStatusCheck(transactionId: string) {
    // In production, this would be handled by webhooks
    // For demo, we check after a delay
    setTimeout(async () => {
      const transaction = await this.prisma.walletTransaction.findUnique({
        where: { id: transactionId },
      });

      if (transaction && transaction.status === 'PENDING') {
        this.logger.log(`[DEMO] Auto-completing transaction: ${transaction.reference}`);
        
        // For demo, auto-complete after 10 seconds
        await this.completeTransaction(transactionId);
      }
    }, 10000);
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(reference: string) {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { reference },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!transaction) {
      return { status: 'NOT_FOUND', message: 'Transação não encontrada' };
    }

    return {
      status: transaction.status,
      reference: transaction.reference,
      method: transaction.method,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      paidAt: transaction.paidAt,
    };
  }

  /**
   * Handle M-Pesa callback
   */
  async handleMpesaCallback(data: any) {
    try {
      const result = data.Body?.stkCallback;
      
      if (!result) return { success: false };

      const checkoutRequestId = result.CheckoutRequestID;
      const resultCode = result.ResultCode;

      const transaction = await this.prisma.walletTransaction.findFirst({
        where: { externalId: checkoutRequestId },
      });

      if (!transaction) return { success: false };

      if (resultCode === 0) {
        await this.completeTransaction(transaction.id);
      } else {
        await this.failTransaction(transaction.id, 'M-Pesa recusou o pagamento');
      }

      return { success: true };
    } catch (error) {
      this.logger.error('M-Pesa callback error:', error);
      return { success: false };
    }
  }

  /**
   * Handle eMola callback
   */
  async handleEmolaCallback(data: any) {
    try {
      const transactionId = data.transaction_id;
      const status = data.status;

      const transaction = await this.prisma.walletTransaction.findFirst({
        where: { externalId: transactionId },
      });

      if (!transaction) return { success: false };

      if (status === 'success' || status === 'completed') {
        await this.completeTransaction(transaction.id);
      } else if (status === 'failed' || status === 'rejected') {
        await this.failTransaction(transaction.id, 'eMola recusou o pagamento');
      }

      return { success: true };
    } catch (error) {
      this.logger.error('eMola callback error:', error);
      return { success: false };
    }
  }

  /**
   * Handle DebitPay callback
   */
  async handleDebitPayCallback(data: any) {
    try {
      const transactionId = data.transaction_id || data.payment_code;
      const status = data.status;

      const transaction = await this.prisma.walletTransaction.findFirst({
        where: { externalId: transactionId },
      });

      if (!transaction) return { success: false };

      if (status === 'success' || status === 'completed') {
        await this.completeTransaction(transaction.id);
      } else if (status === 'failed') {
        await this.failTransaction(transaction.id, 'DebitPay recusou o pagamento');
      }

      return { success: true };
    } catch (error) {
      this.logger.error('DebitPay callback error:', error);
      return { success: false };
    }
  }

  /**
   * Complete transaction and grant exam access
   */
  private async completeTransaction(transactionId: string) {
    try {
      const transaction = await this.prisma.walletTransaction.update({
        where: { id: transactionId },
        data: { 
          status: 'COMPLETED',
          paidAt: new Date(),
        },
        include: { user: true },
      });

      // Create exam access record
      await this.prisma.examAccess.create({
        data: {
          userId: transaction.userId,
          examId: transaction.examId,
          paymentMethod: transaction.method,
          transactionReference: transaction.reference,
          amount: transaction.amount,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      });

      this.logger.log(`Transaction completed: ${transaction.reference}`);
      
      return transaction;
    } catch (error) {
      this.logger.error('Error completing transaction:', error);
      throw error;
    }
  }

  /**
   * Fail transaction
   */
  private async failTransaction(transactionId: string, reason: string) {
    await this.prisma.walletTransaction.update({
      where: { id: transactionId },
      data: { 
        status: 'FAILED',
        failureReason: reason,
      },
    });
  }

  /**
   * Get OAuth token for M-Pesa
   */
  private async getMpesaToken(): Promise<string> {
    const auth = Buffer.from(`${this.MPESA_CONSUMER_KEY}:${this.MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await fetch(`${this.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Check user exam access
   */
  async checkExamAccess(userId: string, examId: string): Promise<boolean> {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    // Free exams are always accessible
    if (exam?.accessType === 'FREE') {
      return true;
    }

    // Check if user has access
    const access = await this.prisma.examAccess.findFirst({
      where: {
        userId,
        examId,
        expiresAt: { gt: new Date() },
      },
    });

    return !!access;
  }

  /**
   * Get user transactions
   */
  async getUserTransactions(userId: string) {
    return this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
