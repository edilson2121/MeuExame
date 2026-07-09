import { PrismaService } from '../../database/prisma.service';
import { CreateSubscriptionDto, ApprovePaymentDto, RecordPaymentDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';
export declare class AdminPaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createSubscription(dto: CreateSubscriptionDto): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        amount: number;
        currency: string;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    recordPayment(dto: RecordPaymentDto, adminId: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    }>;
    approvePayment(paymentId: string, dto: ApprovePaymentDto, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    }>;
    getSubscriptionByUserId(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            amount: number;
            currency: string;
            subscriptionId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            reference: string | null;
            approvedBy: string | null;
            approvedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        amount: number;
        currency: string;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    getPaymentsByUserId(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        subscriptionId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
    })[]>;
    getAllPendingPayments(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
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
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            amount: number;
            currency: string;
            startDate: Date | null;
            endDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
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
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        status: import(".prisma/client").$Enums.PaymentStatus;
                        amount: number;
                        currency: string;
                        subscriptionId: string;
                        method: import(".prisma/client").$Enums.PaymentMethod;
                        reference: string | null;
                        approvedBy: string | null;
                        approvedAt: Date | null;
                    }[];
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    isActive: boolean;
                    userId: string;
                    status: import(".prisma/client").$Enums.SubscriptionStatus;
                    plan: import(".prisma/client").$Enums.SubscriptionPlan;
                    amount: number;
                    currency: string;
                    startDate: Date | null;
                    endDate: Date | null;
                };
            } & {
                id: string;
                email: string;
                password: string;
                name: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                institutionId: string | null;
                createdAt: Date;
                updatedAt: Date;
            })[];
        } & {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            logo: string | null;
            website: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
        };
        isPaid: boolean;
        paidAt: Date;
        users: ({
            subscription: {
                payments: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    amount: number;
                    currency: string;
                    subscriptionId: string;
                    method: import(".prisma/client").$Enums.PaymentMethod;
                    reference: string | null;
                    approvedBy: string | null;
                    approvedAt: Date | null;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                userId: string;
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                amount: number;
                currency: string;
                startDate: Date | null;
                endDate: Date | null;
            };
        } & {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    private calculateEndDate;
}
