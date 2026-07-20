import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export interface DebitPayConfig {
    apiKey: string;
    merchantId: string;
    walletCodeMpesa: string;
    walletCodeEmola: string;
    baseUrl: string;
    callbackUrl: string;
}
export interface PaymentInitResult {
    success: boolean;
    reference: string;
    message: string;
    method: 'MPESA' | 'EMOLA';
}
export interface PaymentStatusResult {
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
    reference: string;
    message: string;
    amount?: number;
    transactionId?: string;
    paidAt?: Date;
}
export interface DebitPayWebhookPayload {
    event: string;
    type: 'payment' | 'notification';
    data: {
        id?: string;
        reference?: string;
        status?: string;
        amount?: number;
        phone?: string;
        method?: string;
        transactionId?: string;
        timestamp?: string;
    };
}
export declare class WalletService {
    private prisma;
    private configService;
    private httpService;
    private readonly logger;
    private config;
    constructor(prisma: PrismaService, configService: ConfigService, httpService: HttpService);
    private generateReference;
    private getAccessToken;
    private initiateMpesaPayment;
    private initiateEmolaPayment;
    private formatPhone;
    private createTransaction;
    private simulatePaymentSuccess;
    initiatePayment(data: {
        examId: string;
        method: 'MPESA' | 'EMOLA';
        phone: string;
        amount: number;
        userId?: string;
    }): Promise<PaymentInitResult>;
    private isValidPhone;
    checkPaymentStatus(reference: string): Promise<PaymentStatusResult>;
    private getStatusMessage;
    handleMpesaCallback(payload: any): Promise<void>;
    handleEmolaCallback(payload: any): Promise<void>;
    private grantExamAccess;
    getUserTransactions(userId: string): Promise<{
        status: import(".prisma/client").$Enums.WalletTransactionStatus;
        id: string;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        userId: string;
        amount: number;
        method: import(".prisma/client").$Enums.WalletMethod;
        reference: string;
        examId: string;
        externalId: string | null;
        failureReason: string | null;
    }[]>;
    getAllTransactions(page?: number, limit?: number): Promise<{
        transactions: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            status: import(".prisma/client").$Enums.WalletTransactionStatus;
            id: string;
            paidAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            userId: string;
            amount: number;
            method: import(".prisma/client").$Enums.WalletMethod;
            reference: string;
            examId: string;
            externalId: string | null;
            failureReason: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
}
