import { Controller, Post, Body, Headers, RawBodyRequest, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('debitopay')
  @HttpCode(HttpStatus.OK)
  async handleDebitoPayWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
    @Req() request: Request,
  ) {
    // Verify signature if provided
    const webhookSecret = process.env.DEBITO_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = this.webhookService.verifyWebhookSignature(
        JSON.stringify(payload),
        signature,
        webhookSecret,
      );
      if (!isValid) {
        return { success: false, message: 'Invalid signature' };
      }
    }

    const result = await this.webhookService.handleDebitoPayWebhook(payload);
    return result;
  }

  @Post('mpesa')
  @HttpCode(HttpStatus.OK)
  async handleMpesaCallback(@Body() payload: any) {
    // M-Pesa specific webhook handling
    return await this.webhookService.handleDebitoPayWebhook({
      event: 'transaction.completed',
      data: {
        transactionId: payload.TransactionId || payload.TransID,
        status: payload.ResultCode === 0 ? 'SUCCESS' : 'FAILED',
        amount: parseFloat(payload.TransAmount || payload.Amount),
        phone: payload.Msisdn || payload.PhoneNumber,
        reference: payload.ThirdPartyTransID,
        timestamp: payload.TransactionDate,
      },
    });
  }

  @Post('emola')
  @HttpCode(HttpStatus.OK)
  async handleEmolaCallback(@Body() payload: any) {
    // eMola specific webhook handling
    return await this.webhookService.handleDebitoPayWebhook({
      event: 'transaction.completed',
      data: {
        transactionId: payload.transactionId,
        status: payload.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
        amount: parseFloat(payload.amount),
        phone: payload.phone,
        reference: payload.reference,
        timestamp: payload.timestamp,
      },
    });
  }
}
