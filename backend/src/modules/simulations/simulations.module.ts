import { Module } from '@nestjs/common';
import { SimulationsService } from './services/simulations.service';
import { SimulationsController } from './controllers/simulations.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SimulationsController],
  providers: [SimulationsService],
  exports: [SimulationsService],
})
export class SimulationsModule {}
