import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { DebitoPayService } from './debitopay.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, DebitoPayService, PrismaService],
  exports: [PaymentsService, DebitoPayService],
})
export class PaymentsModule {}
