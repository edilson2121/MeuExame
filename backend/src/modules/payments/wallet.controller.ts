import { Controller, Post, Get, Body, Param, UseGuards, Request, Headers } from '@nestjs/common';
import { WalletService, PaymentMethod } from './wallet-service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Initiate payment with wallet method
   */
  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  async initiatePayment(
    @Request() req,
    @Body() body: { examId: string; method: PaymentMethod; phone: string; amount: number }
  ) {
    const { examId, method, phone, amount } = body;
    const userId = req.user.id;

    const result = await this.walletService.initiatePayment(
      userId,
      examId,
      method,
      phone,
      amount
    );

    return result;
  }

  /**
   * Get transaction status by reference
   */
  @Get('status/:reference')
  async getTransactionStatus(@Param('reference') reference: string) {
    return this.walletService.getTransactionStatus(reference);
  }

  /**
   * Get user transactions
   */
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@Request() req) {
    return this.walletService.getUserTransactions(req.user.id);
  }

  /**
   * Check exam access
   */
  @Get('access/:examId')
  @UseGuards(JwtAuthGuard)
  async checkExamAccess(@Request() req, @Param('examId') examId: string) {
    const hasAccess = await this.walletService.checkExamAccess(req.user.id, examId);
    return { hasAccess };
  }

  /**
   * M-Pesa Webhook Callback
   */
  @Post('webhooks/mpesa')
  async handleMpesaWebhook(
    @Body() body: any,
    @Headers('x-mpesa-signature') signature: string
  ) {
    // In production, verify signature
    return this.walletService.handleMpesaCallback(body);
  }

  /**
   * eMola Webhook Callback
   */
  @Post('webhooks/emola')
  async handleEmolaWebhook(
    @Body() body: any,
    @Headers('x-emola-signature') signature: string
  ) {
    // In production, verify signature
    return this.walletService.handleEmolaCallback(body);
  }

  /**
   * DebitPay Webhook Callback
   */
  @Post('webhooks/debitpay')
  async handleDebitPayWebhook(
    @Body() body: any,
    @Headers('x-debitpay-signature') signature: string
  ) {
    // In production, verify signature
    return this.walletService.handleDebitPayCallback(body);
  }
}
