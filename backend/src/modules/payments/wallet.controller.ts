import { Controller, Post, Get, Body, Param, UseGuards, Request, Headers, HttpCode } from '@nestjs/common';
import { WalletService, PaymentMethod } from './wallet-service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * INICIAR PAGAMENTO via DébitO Pay
   * POST /api/wallet/initiate
   */
  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async initiatePayment(
    @Request() req,
    @Body() body: { examId: string; method: PaymentMethod; phone: string; amount: number }
  ) {
    const { examId, method, phone, amount } = body;
    const userId = req.user.id;

    return this.walletService.initiatePayment(userId, examId, method, phone, amount);
  }

  /**
   * VERIFICAR STATUS DA TRANSAÇÃO
   * GET /api/wallet/status/:reference
   */
  @Get('status/:reference')
  async getTransactionStatus(@Param('reference') reference: string) {
    return this.walletService.getTransactionStatus(reference);
  }

  /**
   * OBTER TRANSAÇÕES DO USUÁRIO
   * GET /api/wallet/transactions
   */
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@Request() req) {
    return this.walletService.getUserTransactions(req.user.id);
  }

  /**
   * VERIFICAR ACESSO AO EXAME
   * GET /api/wallet/access/:examId
   */
  @Get('access/:examId')
  @UseGuards(JwtAuthGuard)
  async checkExamAccess(@Request() req, @Param('examId') examId: string) {
    const hasAccess = await this.walletService.checkExamAccess(req.user.id, examId);
    return { hasAccess };
  }

  /**
   * WEBHOOK da DébitO Pay (M-Pesa e e-Mola)
   * POST /api/wallet/webhooks/debito
   * 
   * A DébitO Pay envia notificações para esta URL
   * quando o pagamento é confirmado ou recusado.
   */
  @Post('webhooks/debito')
  @HttpCode(200)
  async handleDebitoWebhook(@Body() body: any) {
    return this.walletService.handleWebhook(body);
  }

  /**
   * WEBHOOK M-Pesa (alternativo)
   * POST /api/wallet/webhooks/mpesa
   */
  @Post('webhooks/mpesa')
  @HttpCode(200)
  async handleMpesaWebhook(@Body() body: any) {
    return this.walletService.handleWebhook(body);
  }

  /**
   * WEBHOOK e-Mola (alternativo)
   * POST /api/wallet/webhooks/emola
   */
  @Post('webhooks/emola')
  @HttpCode(200)
  async handleEmolaWebhook(@Body() body: any) {
    return this.walletService.handleWebhook(body);
  }
}
