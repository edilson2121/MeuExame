import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { SubscriptionPlan, PaymentMethod, PaymentStatus } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsString()
  userId: string;

  @IsString()
  planId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class ApprovePaymentDto {
  @IsBoolean()
  approve: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class RecordPaymentDto {
  @IsString()
  userId: string;

  @IsString()
  subscriptionId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class MarkUserPaidDto {
  @IsString()
  userId: string;

  @IsString()
  planId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
