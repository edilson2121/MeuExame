import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration: number;

  @IsEnum(SubscriptionPlan)
  type: SubscriptionPlan;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
