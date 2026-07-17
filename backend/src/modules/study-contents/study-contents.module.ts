import { Module } from '@nestjs/common';
import { StudyContentsService } from './services/study-contents.service';
import { StudyContentsController } from './controllers/study-contents.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudyContentsController],
  providers: [StudyContentsService],
  exports: [StudyContentsService],
})
export class StudyContentsModule {}
