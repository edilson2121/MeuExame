import { PaymentStatus } from '@prisma/client';
export declare class UpdatePaymentDto {
    status: PaymentStatus;
    transactionId?: string;
}
