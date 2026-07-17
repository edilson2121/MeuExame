import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(req: any, createPaymentDto: CreatePaymentDto): Promise<{
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
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        subscriptionId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
    }>;
    findMyPayments(req: any): Promise<({
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
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        subscriptionId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
    })[]>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
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
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        subscriptionId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
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
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        subscriptionId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
    }>;
    updateStatus(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        subscriptionId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
    }>;
}
