import { Module } from '@nestjs/common';
import { AdminPagesService } from './pages/admin-pages.service';
import { AdminPagesController } from './pages/admin-pages.controller';
import { AdminPaymentsService } from './payments/admin-payments.service';
import { AdminPaymentsController } from './payments/admin-payments.controller';
import { AdminLayoutsService } from './layouts/admin-layouts.service';
import { AdminLayoutsController } from './layouts/admin-layouts.controller';
import { PrismaService } from '../database/prisma.service';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  controllers: [AdminPagesController, AdminPaymentsController, AdminLayoutsController],
  providers: [AdminPagesService, AdminPaymentsService, AdminLayoutsService, PrismaService, RolesGuard],
  exports: [AdminPagesService, AdminPaymentsService, AdminLayoutsService],
})
export class AdminModule {}
