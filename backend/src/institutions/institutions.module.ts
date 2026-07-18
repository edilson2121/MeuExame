import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}
