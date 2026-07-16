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
            phone: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
            phone: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
                phone: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.Role;
            };
            subscription: {
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
            phone: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        payments: {
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
        }[];
    } & {
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
            phone: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
            phone: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
            phone: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
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
                    }[];
                } & {
                    status: import(".prisma/client").$Enums.SubscriptionStatus;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    plan: import(".prisma/client").$Enums.SubscriptionPlan;
                    amount: number;
                    currency: string;
                    startDate: Date | null;
                    endDate: Date | null;
                };
            } & {
                institutionId: string | null;
                id: string;
                name: string;
                phone: string | null;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                password: string;
                role: import(".prisma/client").$Enums.Role;
            })[];
        } & {
            description: string | null;
            id: string;
            name: string;
            logo: string | null;
            website: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        isPaid: boolean;
        paidAt: Date;
        users: ({
            subscription: {
                payments: {
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
                }[];
            } & {
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                amount: number;
                currency: string;
                startDate: Date | null;
                endDate: Date | null;
            };
        } & {
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        })[];
    }>;
}
