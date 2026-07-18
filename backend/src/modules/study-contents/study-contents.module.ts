import { Module } from '@nestjs/common';
import { StudyContentsService } from './services/study-contents.service';
import { StudyContentsController } from './controllers/study-contents.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StudyContentsController],
  providers: [StudyContentsService],
  exports: [StudyContentsService],
})
export class StudyContentsModule {}
