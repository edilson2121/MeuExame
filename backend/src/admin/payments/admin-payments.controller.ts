import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminPaymentsService } from './admin-payments.service';
import {
  ApprovePaymentDto,
  CreateSubscriptionDto,
  MarkUserPaidDto,
  RecordPaymentDto,
} from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin/payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminPaymentsController {
  constructor(private readonly paymentsService: AdminPaymentsService) {}

  @Post('subscription')
  @HttpCode(201)
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.paymentsService.createSubscription(dto);
  }

  @Post('record')
  @HttpCode(201)
  async recordPayment(@Body() dto: RecordPaymentDto, @Request() req) {
    const adminId = req.user.id;
    return this.paymentsService.recordPayment(dto, adminId);
  }

  @Put('approve/:paymentId')
  async approvePayment(
    @Param('paymentId') paymentId: string,
    @Body() dto: ApprovePaymentDto,
    @Request() req,
  ) {
    const adminId = req.user.id;
    return this.paymentsService.approvePayment(paymentId, dto, adminId);
  }

  @Post('mark-paid')
  @HttpCode(201)
  async markUserPaid(@Body() dto: MarkUserPaidDto, @Request() req) {
    return this.paymentsService.markUserPaid(dto, req.user.id);
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
