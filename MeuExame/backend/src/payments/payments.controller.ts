import { Controller, Post, Get, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async initiatePayment(@Request() req, @Body() dto: CreatePaymentDto) {
    const userId = req.user.userId;
    return this.paymentsService.initiatePayment(userId, dto);
  }

  @Get('status/:reference')
  @UseGuards(JwtAuthGuard)
  async checkPaymentStatus(@Param('reference') reference: string) {
    return this.paymentsService.checkPaymentStatus(reference);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  async getUserPayments(@Request() req) {
    const userId = req.user.userId;
    return this.paymentsService.getUserPayments(userId);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getUserSubscription(@Request() req) {
    const userId = req.user.userId;
    return this.paymentsService.getUserSubscription(userId);
  }

  @Put(':transactionId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updatePaymentStatus(
    @Param('transactionId') transactionId: string,
    @Body() body: { status: PaymentStatus },
    @Request() req
  ) {
    const adminId = req.user.userId;
    return this.paymentsService.updatePaymentStatus(
      transactionId,
      body.status,
      adminId
    );
  }
}
