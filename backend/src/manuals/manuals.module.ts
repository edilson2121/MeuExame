import { Module } from '@nestjs/common';
import { ManualsController } from './manuals.controller';
import { ManualsService } from './manuals.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ManualsController],
  providers: [ManualsService, PrismaService],
  exports: [ManualsService],
})
export class ManualsModule {}
