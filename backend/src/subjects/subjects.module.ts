import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, PrismaService],
  exports: [SubjectsService],
})
export class SubjectsModule {}