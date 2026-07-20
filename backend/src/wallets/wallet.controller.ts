import { Controller, Post, Get, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Initiate payment (public endpoint)
   */
  @Post('initiate')
  @HttpCode(200)
  async initiatePayment(
    @Body() body: {
      examId: string;
      method: 'MPESA' | 'EMOLA';
      phone: string;
      amount: number;
    },
    @Request() req: any,
  ) {
    const userId = req?.user?.id;
    return this.walletService.initiatePayment({
      examId: body.examId,
      method: body.method,
      phone: body.phone,
      amount: body.amount,
      userId,
    });
  }

  /**
   * Check payment status (public endpoint)
   */
  @Get('status/:reference')
  async checkStatus(@Param('reference') reference: string) {
    return this.walletService.checkPaymentStatus(reference);
  }

  /**
   * Poll payment status (for frontend polling)
   */
  @Get('poll/:reference')
  async pollStatus(@Param('reference') reference: string) {
    return this.walletService.checkPaymentStatus(reference);
  }

  /**
   * Get user transaction history
   */
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@Request() req: any) {
    return this.walletService.getUserTransactions(req.user.id);
  }

  /**
   * Get all transactions (admin)
   */
  @Get('admin/transactions')
  @UseGuards(JwtAuthGuard)
  async getAllTransactions(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.walletService.getAllTransactions(Number(page), Number(limit));
  }

  /**
   * M-Pesa webhook callback
   */
  @Post('webhook/mpesa')
  @HttpCode(200)
  async mpesaWebhook(@Body() payload: any) {
    await this.walletService.handleMpesaCallback(payload);
    return { status: 'ok' };
  }

  /**
   * eMola webhook callback
   */
  @Post('webhook/emola')
  @HttpCode(200)
  async emolaWebhook(@Body() payload: any) {
    await this.walletService.handleEmolaCallback(payload);
    return { status: 'ok' };
  }
}
