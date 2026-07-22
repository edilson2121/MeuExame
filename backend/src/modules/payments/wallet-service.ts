import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// =============================================
// DÉBITO PAY - Gateway de Pagamentos Móvel
// Integra M-Pesa e e-Mola através de Wallet IDs
// =============================================

export type PaymentMethod = 'MPESA' | 'EMOLA';
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

  // =============================================
  // CONFIGURAÇÃO DA API DÉBITO PAY
  // =============================================
  
  // URL base da API (Supabase Edge Function)
  private readonly DEBITO_API_URL = process.env.DEBITO_API_URL || 'https://gyqoaningqhurhvdugne.supabase.co/functions/v1';
  
  // Chave secreta da API (fornecida pela DébitO Pay)
  private readonly DEBITO_SECRET_KEY = process.env.DEBITO_SECRET_KEY || '';
  
  // Wallet ID para M-Pesa (código shortcode)
  // Este código é fornecido pela DébitO Pay após configuração da carteira M-Pesa
  private readonly DEBITO_WALLET_CODE_MPESA = process.env.DEBITO_WALLET_CODE || '15156';
  
  // Wallet ID para e-Mola
  // Este código é fornecido pela DébitO Pay após configuração da carteira e-Mola
  private readonly DEBITO_WALLET_CODE_EMOLA = process.env.DEBITO_WALLET_CODE_EMOLA || '61526';
  
  // Merchant ID da DébitO Pay
  private readonly DEBITO_MERCHANT_ID = process.env.DEBITO_MERCHANT_ID || '';
  
  // URL de callback para receber notificações de pagamento
  private readonly DEBITO_CALLBACK_URL = process.env.DEBITO_CALLBACK_URL || 'https://api.meuexame.co.mz/api/wallet/webhooks/debito';

  constructor(private prisma: PrismaService) {}

  // =============================================
  // MÉTODOS PÚBLICOS
  // =============================================

  /**
   * Gerar referência única para transação
   * Formato: ME + timestamp + número aleatório
   */
  generateReference(): string {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ME${timestamp}${random}`;
  }

  /**
   * Validar número de telefone moçambicano
   */
  validatePhone(phone: string, method: PaymentMethod): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithoutCode = cleanPhone.startsWith('258') ? cleanPhone.slice(3) : cleanPhone;
    
    if (phoneWithoutCode.length !== 9) return false;
    
    const prefixes: Record<PaymentMethod, string[]> = {
      // Prefixos M-Pesa: 84, 85 (Vodacom)
      MPESA: ['84', '85'],
      // Prefixos e-Mola: 86, 87 (Movitel)
      EMOLA: ['86', '87'],
    };
    
    const prefix = phoneWithoutCode.slice(0, 2);
    return prefixes[method].includes(prefix);
  }

  /**
   * Formatar número para formato internacional (258...)
   */
  formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('258')) {
      return cleanPhone;
    }
    return `258${cleanPhone}`;
  }

  /**
   * INICIAR PAGAMENTO via DébitO Pay
   * 
   * Fluxo:
   * 1. Validar dados
   * 2. Criar registro da transação
   * 3. Chamar API da DébitO Pay com Wallet ID correto
   * 4. Retornar resultado ao cliente
   */
  async initiatePayment(
    userId: string,
    examId: string,
    method: PaymentMethod,
    phone: string,
    amount: number
  ): Promise<PaymentInitResult> {
    try {
      // 1. Validar telefone
      if (!this.validatePhone(phone, method)) {
        return {
          success: false,
          reference: '',
          message: `Número de telefone inválido para ${method === 'MPESA' ? 'M-Pesa' : 'e-Mola'}. Use: ${method === 'MPESA' ? '84 ou 85' : '86 ou 87'}xxxxxxx`,
        };
      }

      const reference = this.generateReference();
      const formattedPhone = this.formatPhone(phone);

      // Selecionar Wallet ID correto
      const walletCode = method === 'MPESA' 
        ? this.DEBITO_WALLET_CODE_MPESA 
        : this.DEBITO_WALLET_CODE_EMOLA;

      this.logger.log(`═══════════════════════════════════════`);
      this.logger.log(`[DÉBITO PAY] Iniciando Pagamento`);
      this.logger.log(`═══════════════════════════════════════`);
      this.logger.log(`📱 Método: ${method === 'MPESA' ? 'M-Pesa' : 'e-Mola'}`);
      this.logger.log(`💼 Wallet ID: ${walletCode}`);
      this.logger.log(`📞 Telefone: ${formattedPhone}`);
      this.logger.log(`💰 Valor: ${amount} MZN`);
      this.logger.log(`🔖 Referência: ${reference}`);
      this.logger.log(`═══════════════════════════════════════`);

      // 2. Criar registro da transação no banco
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

      // 3. Chamar API da DébitO Pay
      const result = await this.callDebitoPayAPI(
        transaction.id,
        formattedPhone,
        amount,
        reference,
        walletCode,
        method
      );

      // 4. Atualizar transação com ID externo
      if (result.externalId) {
        await this.prisma.walletTransaction.update({
          where: { id: transaction.id },
          data: { externalId: result.externalId },
        });
      }

      return result;

    } catch (error) {
      this.logger.error('[DÉBITO PAY] Erro ao processar pagamento:', error);
      return { success: false, reference: '', message: 'Erro ao processar pagamento. Tente novamente.' };
    }
  }

  /**
   * VERIFICAR STATUS DE TRANSAÇÃO
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
   * OBTER TRANSAÇÕES DO USUÁRIO
   */
  async getUserTransactions(userId: string) {
    return this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * VERIFICAR ACESSO AO EXAME
   */
  async checkExamAccess(userId: string, examId: string): Promise<boolean> {
    // Verificar se há acesso FREE para este exame
    const freeAccess = await this.prisma.examAccess.findFirst({
      where: { examId, type: 'FREE' },
    });
    if (freeAccess) return true;

    // Verificar se há acesso PAGO válido
    const paidAccess = await this.prisma.examAccess.findFirst({
      where: {
        userId,
        examId,
        type: 'PAID',
        expiresAt: { gt: new Date() },
      },
    });

    return !!paidAccess;
  }

  // =============================================
  // MÉTODOS PRIVADOS
  // =============================================

  /**
   * Chamar API da DébitO Pay
   * 
   * Payload enviado:
   * - merchant_id: ID do comerciante na DébitO Pay
   * - api_key: Chave secreta
   * - amount: Valor em MZN
   * - phone: Número de telefone (258...)
   * - reference: Referência única da transação
   * - wallet_code: Wallet ID (M-Pesa ou e-Mola)
   * - callback_url: URL para notificações
   * - method: 'mpesa' ou 'emola'
   */
  private async callDebitoPayAPI(
    transactionId: string,
    phone: string,
    amount: number,
    reference: string,
    walletCode: string,
    method: 'MPESA' | 'EMOLA'
  ): Promise<PaymentInitResult> {
    try {
      // Verificar se temos credenciais configuradas
      if (!this.DEBITO_SECRET_KEY || !this.DEBITO_MERCHANT_ID) {
        this.logger.warn('[DÉBITO PAY] Credenciais não configuradas - usando modo demo');
        return this.simulatePayment(transactionId, reference, method);
      }

      // Preparar payload conforme documentação da DébitO Pay
      const payload = {
        merchant_id: this.DEBITO_MERCHANT_ID,
        api_key: this.DEBITO_SECRET_KEY,
        amount: Math.ceil(amount),
        phone: phone,
        reference: reference,
        wallet_code: walletCode,
        callback_url: this.DEBITO_CALLBACK_URL,
        method: method.toLowerCase(), // 'mpesa' ou 'emola'
      };

      this.logger.log(`[DÉBITO PAY] → Request: ${this.DEBITO_API_URL}`);
      this.logger.log(`[DÉBITO PAY] → Payload: ${JSON.stringify(payload, null, 2)}`);

      const response = await fetch(this.DEBITO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.DEBITO_SECRET_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      this.logger.log(`[DÉBITO PAY] ← Response: ${JSON.stringify(data)}`);

      // Processar resposta
      if (data.success || data.status === 'success' || data.status === 'pending') {
        // Agendar verificação de status
        this.scheduleStatusCheck(transactionId);
        
        return {
          success: true,
          reference,
          externalId: data.transaction_id || data.checkout_request_id || reference,
          message: method === 'MPESA'
            ? '✅Aguarde o código no seu telemóvel M-Pesa'
            : '✅ Aguarde o código no seu telemóvel e-Mola',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos
        };
      }

      // Erro da API
      const errorMessage = data.message || data.error || 'Erro na API DébitO Pay';
      this.logger.error(`[DÉBITO PAY] Erro: ${errorMessage}`);
      return { success: false, reference, message: errorMessage };

    } catch (error) {
      this.logger.error('[DÉBITO PAY] Erro de comunicação:', error);
      
      // Em caso de erro de rede, simular para desenvolvimento
      this.logger.warn('[DÉBITO PAY] Usando modo demo (erro de comunicação)');
      return this.simulatePayment(transactionId, reference, method);
    }
  }

  /**
   * SIMULAR PAGAMENTO (para desenvolvimento)
   * Usado quando:
   * - Credenciais não estão configuradas
   * - Erro de comunicação com a API
   * - Modo de desenvolvimento
   */
  private async simulatePayment(
    transactionId: string,
    reference: string,
    method: 'MPESA' | 'EMOLA'
  ): Promise<PaymentInitResult> {
    this.logger.log(`[DEMO] 💰 Simulando pagamento ${method}`);
    
    // Simular ID externo
    const externalId = `${method === 'MPESA' ? 'MP' : 'EM'}${Date.now()}`;
    
    // Simular código de confirmação
    const paymentCode = `${Math.floor(Math.random() * 900000) + 100000}`;
    
    // Agendar verificação automática (demo: completa em 15 segundos)
    this.scheduleStatusCheck(transactionId);
    
    return {
      success: true,
      reference,
      externalId,
      message: method === 'MPESA'
        ? `📱 Código M-Pesa: ${paymentCode} - Digite no seu telemóvel`
        : `📱 Código e-Mola: ${paymentCode} - Digite no seu telemóvel`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  /**
   * AGENDAR VERIFICAÇÃO DE STATUS
   * Em produção, isso seria substituído por webhooks
   */
  private scheduleStatusCheck(transactionId: string) {
    // Em produção, usar webhooks da DébitO Pay
    // Para demo, auto-completar após 15 segundos
    setTimeout(async () => {
      const transaction = await this.prisma.walletTransaction.findUnique({
        where: { id: transactionId },
      });

      if (transaction && transaction.status === 'PENDING') {
        this.logger.log(`[DEMO] ⏰ Auto-completando transação: ${transaction.reference}`);
        await this.completeTransaction(transactionId);
      }
    }, 15000); // 15 segundos para demo
  }

  /**
   * COMPLETAR TRANSAÇÃO
   * Quando o pagamento é confirmado (via webhook ou demo)
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

      // Criar registro de acesso ao exame
      await this.prisma.examAccess.create({
        data: {
          userId: transaction.userId,
          examId: transaction.examId,
          paymentMethod: transaction.method,
          transactionReference: transaction.reference,
          amount: transaction.amount,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
        },
      });

      this.logger.log(`✅ [DÉBITO PAY] Transação completa: ${transaction.reference}`);
      
    } catch (error) {
      this.logger.error('[DÉBITO PAY] Erro ao completar transação:', error);
    }
  }

  /**
   * FALHAR TRANSAÇÃO
   */
  private async failTransaction(transactionId: string, reason: string) {
    await this.prisma.walletTransaction.update({
      where: { id: transactionId },
      data: { 
        status: 'FAILED',
        failureReason: reason,
      },
    });
    this.logger.error(`❌ [DÉBITO PAY] Transação falhou: ${reason}`);
  }

  /**
   * WEBHOOK - Receber notificações da DébitO Pay
   */
  async handleWebhook(data: any) {
    try {
      this.logger.log(`[DÉBITO PAY] 📩 Webhook recebido: ${JSON.stringify(data)}`);

      const transactionId = data.transaction_id || data.reference;
      const status = data.status;

      if (status === 'success' || status === 'completed') {
        // Encontrar transação
        const transaction = await this.prisma.walletTransaction.findFirst({
          where: {
            OR: [
              { externalId: transactionId },
              { reference: transactionId },
            ],
          },
        });

        if (transaction) {
          await this.completeTransaction(transaction.id);
        }
      } else if (status === 'failed' || status === 'rejected') {
        const transaction = await this.prisma.walletTransaction.findFirst({
          where: {
            OR: [
              { externalId: transactionId },
              { reference: transactionId },
            ],
          },
        });

        if (transaction) {
          await this.failTransaction(transaction.id, data.reason || 'Pagamento recusado');
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error('[DÉBITO PAY] Erro no webhook:', error);
      return { success: false };
    }
  }
}
