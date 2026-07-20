import { PaymentService } from '../payments/payment.service';
export declare class SubscriptionsController {
    private paymentService;
    constructor(paymentService: PaymentService);
    getMySubscription(req: any): Promise<{
        status: string;
        isActive: boolean;
        plan: {
            description: string | null;
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            type: import(".prisma/client").$Enums.SubscriptionPlan;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        currency: string;
        startDate: Date | null;
        endDate: Date | null;
    }>;
}
