import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { PaymentService } from '../payments/payment.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionsController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class SubscriptionsModule {}
