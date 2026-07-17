import { Module } from '@nestjs/common';
import { DynamicPagesService } from './dynamic-pages.service';
import { DynamicPagesController } from './dynamic-pages.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [DynamicPagesController],
  providers: [DynamicPagesService, PrismaService],
  exports: [DynamicPagesService],
})
export class DynamicPagesModule {}
