import { AdminPaymentsService } from './admin-payments.service';
import { ApprovePaymentDto, CreateSubscriptionDto, MarkUserPaidDto, RecordPaymentDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';
export declare class AdminPaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: AdminPaymentsService);
    createSubscription(dto: CreateSubscriptionDto): Promise<{
        user: {
            institutionId: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        currency: string;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    recordPayment(dto: RecordPaymentDto, req: any): Promise<{
        user: {
            institutionId: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    }>;
    approvePayment(paymentId: string, dto: ApprovePaymentDto, req: any): Promise<{
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    }>;
    markUserPaid(dto: MarkUserPaidDto, req: any): Promise<{
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
        payment: {
            user: {
                institutionId: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string;
                role: import(".prisma/client").$Enums.Role;
            };
            subscription: {
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                planId: string;
                amount: number;
                currency: string;
                startDate: Date | null;
                endDate: Date | null;
            };
        } & {
            status: import(".prisma/client").$Enums.PaymentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            amount: number;
            currency: string;
            subscriptionId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            reference: string | null;
            approvedBy: string | null;
            approvedAt: Date | null;
        };
    }>;
    getSubscriptionByUserId(userId: string): Promise<{
        user: {
            institutionId: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
        };
        payments: {
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
        }[];
    } & {
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
        amount: number;
        currency: string;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    getPaymentsByUserId(userId: string): Promise<({
        user: {
            institutionId: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    })[]>;
    getPendingPayments(): Promise<({
        user: {
            institutionId: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    })[]>;
    getAllPayments(status?: PaymentStatus): Promise<({
        user: {
            institutionId: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    })[]>;
    getInstitutionPaymentStatus(institutionId: string): Promise<{
        institution: {
            users: ({
                subscription: {
                    payments: {
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
                    }[];
                } & {
                    status: import(".prisma/client").$Enums.SubscriptionStatus;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    planId: string;
                    amount: number;
                    currency: string;
                    startDate: Date | null;
                    endDate: Date | null;
                };
            } & {
                institutionId: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                hasFullAccess: boolean;
                email: string;
                password: string;
                avatar: string | null;
                phone: string | null;
                bio: string | null;
                role: import(".prisma/client").$Enums.Role;
            })[];
        } & {
            id: string;
            name: string;
            city: string | null;
            country: string;
            isActive: boolean;
            isPaid: boolean;
            paidAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        isPaid: boolean;
        paidAt: Date;
    }>;
}
