import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class DebitoPayService {
  private readonly api: AxiosInstance;
  private readonly secretKey: string;
  private readonly walletCode: string;
  private readonly walletCodeEmola: string;
  private readonly merchantId: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('DEBITO_SECRET_KEY');
    this.walletCode = this.configService.get<string>('DEBITO_WALLET_CODE');
    this.walletCodeEmola = this.configService.get<string>('DEBITO_WALLET_CODE_EMOLA');
    this.merchantId = this.configService.get<string>('DEBITO_MERCHANT_ID');
    this.apiUrl = this.configService.get<string>('DEBITO_API_URL');

    this.api = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async initiateMpesaPayment(phone: string, amount: number, reference: string) {
    try {
      const response = await this.api.post('/mpesa/payment', {
        phone,
        amount,
        reference,
        merchant_id: this.merchantId,
        wallet_code: this.walletCode,
      });

      return {
        success: true,
        transactionId: response.data.transaction_id,
        pending: response.data.status === 'pending',
        confirmed: response.data.status === 'completed',
      };
    } catch (error) {
      console.error('M-Pesa payment error:', error.response?.data || error.message);
      throw new BadRequestException(error.response?.data?.message || 'Erro ao processar pagamento M-Pesa');
    }
  }

  async initiateEmolaPayment(phone: string, amount: number, reference: string) {
    try {
      const response = await this.api.post('/emola/payment', {
        phone,
        amount,
        reference,
        merchant_id: this.merchantId,
        wallet_code: this.walletCodeEmola,
      });

      return {
        success: true,
        transactionId: response.data.transaction_id,
        pending: response.data.status === 'pending',
        confirmed: response.data.status === 'completed',
      };
    } catch (error) {
      console.error('E-Mola payment error:', error.response?.data || error.message);
      throw new BadRequestException(error.response?.data?.message || 'Erro ao processar pagamento E-Mola');
    }
  }

  async checkPaymentStatus(transactionId: string) {
    try {
      const response = await this.api.get(`/payment/status/${transactionId}`);
      
      return {
        status: response.data.status, // 'pending', 'completed', 'cancelled', 'failed'
        transactionId: response.data.transaction_id,
      };
    } catch (error) {
      console.error('Payment status check error:', error.response?.data || error.message);
      throw new BadRequestException('Erro ao verificar status do pagamento');
    }
  }

  validatePhoneNumber(phone: string, method: 'mpesa' | 'emola'): boolean {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length !== 9) return false;

    const prefix = cleaned.substring(0, 2);
    
    if (method === 'mpesa') {
      return prefix === '84' || prefix === '85';
    }
    
    if (method === 'emola') {
      return prefix === '86' || prefix === '87';
    }
    
    return false;
  }

  formatPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '').substring(0, 9);
  }
}
