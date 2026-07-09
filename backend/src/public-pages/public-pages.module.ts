import { Module } from '@nestjs/common';
import { PublicPagesService } from './public-pages.service';
import { PublicPagesController } from './public-pages.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [PublicPagesService, PrismaService],
  controllers: [PublicPagesController],
  exports: [PublicPagesService],
})
export class PublicPagesModule {}
