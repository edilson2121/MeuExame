import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { SimulationStatus } from '@prisma/client';

export class CreateSimulationDto {
  @IsString()
  examId: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  answers?: any;

  @IsOptional()
  @IsEnum(SimulationStatus)
  status?: SimulationStatus;
}
