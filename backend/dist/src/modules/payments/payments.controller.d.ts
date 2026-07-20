import { PaymentService } from './payment.service';
export declare class PaymentsController {
    private paymentService;
    constructor(paymentService: PaymentService);
    createPayment(req: any, body: {
        planId: string;
        phoneNumber: string;
    }): Promise<{
        paymentId: string;
        transactionId: string;
        amount: number;
        status: string;
        phoneNumber: string;
        message: string;
    }>;
    getPayment(id: string): Promise<{
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
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
        planId: string | null;
        amount: number;
        subscriptionId: string | null;
        examId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
        instructionId: string | null;
        webhookData: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getMyPayments(req: any): Promise<({
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
        planId: string | null;
        amount: number;
        subscriptionId: string | null;
        examId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
        instructionId: string | null;
        webhookData: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getPendingPayments(): Promise<({
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
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
        planId: string | null;
        amount: number;
        subscriptionId: string | null;
        examId: string | null;
        paymentMethod: string | null;
        transactionId: string | null;
        instructionId: string | null;
        webhookData: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    approvePayment(id: string): Promise<{
        success: boolean;
    }>;
    rejectPayment(id: string): Promise<{
        success: boolean;
    }>;
}
