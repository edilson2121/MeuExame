import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaymentService } from '../payments/payment.service';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private paymentService: PaymentService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my subscription' })
  async getMySubscription(@Req() req: any) {
    return this.paymentService.getUserSubscription(req.user.id);
  }
}
