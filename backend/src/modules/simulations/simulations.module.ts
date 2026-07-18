import { Module } from '@nestjs/common';
import { SimulationsService } from './services/simulations.service';
import { SimulationsController } from './controllers/simulations.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SimulationsController],
  providers: [SimulationsService],
  exports: [SimulationsService],
})
export class SimulationsModule {}
