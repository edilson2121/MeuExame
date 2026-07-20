import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export enum PaymentMethod {
  MPESA = 'mpesa',
  EMOLA = 'emola',
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  numeroTelefone: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
