import { Controller, Get, Post, Put, Param, Body, HttpCode, Query } from '@nestjs/common';
import { AdminPaymentsService } from './admin-payments.service';
import { CreateSubscriptionDto, ApprovePaymentDto, RecordPaymentDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';

@Controller('admin/payments')
export class AdminPaymentsController {
  constructor(private readonly paymentsService: AdminPaymentsService) {}

  @Post('subscription')
  @HttpCode(201)
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.paymentsService.createSubscription(dto);
  }

  @Post('record')
  @HttpCode(201)
  async recordPayment(@Body() dto: RecordPaymentDto) {
    // In a real app, you would extract adminId from JWT token
    const adminId = 'admin-default';
    return this.paymentsService.recordPayment(dto, adminId);
  }

  @Put('approve/:paymentId')
  async approvePayment(@Param('paymentId') paymentId: string, @Body() dto: ApprovePaymentDto) {
    // In a real app, you would extract adminId from JWT token
    const adminId = 'admin-default';
    return this.paymentsService.approvePayment(paymentId, dto, adminId);
  }

  @Get('subscription/:userId')
  async getSubscriptionByUserId(@Param('userId') userId: string) {
    return this.paymentsService.getSubscriptionByUserId(userId);
  }

  @Get('user/:userId')
  async getPaymentsByUserId(@Param('userId') userId: string) {
    return this.paymentsService.getPaymentsByUserId(userId);
  }

  @Get('pending')
  async getPendingPayments() {
    return this.paymentsService.getAllPendingPayments();
  }

  @Get()
  async getAllPayments(@Query('status') status?: PaymentStatus) {
    return this.paymentsService.getAllPayments(status as PaymentStatus);
  }

  @Get('institution/:institutionId/status')
  async getInstitutionPaymentStatus(@Param('institutionId') institutionId: string) {
    return this.paymentsService.getInstitutionPaymentStatus(institutionId);
  }
}
