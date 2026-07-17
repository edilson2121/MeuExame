import { PaymentMethod } from '@prisma/client';
export declare class CreateSubscriptionDto {
    userId: string;
    planId: string;
    amount: number;
    currency?: string;
}
export declare class ApprovePaymentDto {
    approve: boolean;
    reason?: string;
}
export declare class RecordPaymentDto {
    userId: string;
    subscriptionId: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    currency?: string;
}
export declare class MarkUserPaidDto {
    userId: string;
    planId: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    currency?: string;
}
