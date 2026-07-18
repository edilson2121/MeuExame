import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new payment' })
  async createPayment(
    @Req() req: any,
    @Body() body: { planId: string; phoneNumber: string },
  ) {
    return this.paymentService.createPaymentIntent(
      req.user.id,
      body.planId,
      body.phoneNumber,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment status' })
  async getPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Get('user/my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my payments' })
  async getMyPayments(@Req() req: any) {
    return this.paymentService.getUserPayments(req.user.id);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get pending payments (Admin)' })
  async getPendingPayments() {
    return this.paymentService.getPendingPayments();
  }

  @Post('admin/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Approve payment (Admin)' })
  async approvePayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.approvePayment(id);
  }

  @Post('admin/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Reject payment (Admin)' })
  async rejectPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.rejectPayment(id);
  }
}
