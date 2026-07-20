import { PrismaService } from '../../database/prisma.service';
export type PaymentMethod = 'MPESA' | 'EMOLA';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
export interface WalletTransaction {
    id: string;
    userId: string;
    examId: string;
    method: PaymentMethod;
    phone: string;
    amount: number;
    reference: string;
    externalId: string | null;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaymentInitResult {
    success: boolean;
    reference: string;
    externalId?: string;
    message: string;
    expiresAt?: Date;
}
export declare class WalletService {
    private prisma;
    private readonly logger;
    private readonly MPESA_SHORTCODE;
    private readonly MPESA_CONSUMER_KEY;
    private readonly MPESA_CONSUMER_SECRET;
    private readonly MPESA_CALLBACK_URL;
    private readonly MPESA_BASE_URL;
    private readonly EMOLA_API_URL;
    private readonly EMOLA_API_KEY;
    private readonly EMOLA_CALLBACK_URL;
    constructor(prisma: PrismaService);
    generateReference(): string;
    validatePhone(phone: string, method: PaymentMethod): boolean;
    private validatePhoneNumber;
    formatPhone(phone: string): string;
    initiatePayment(userId: string, examId: string, method: PaymentMethod, phone: string, amount: number): Promise<PaymentInitResult>;
    private initiateMpesaPayment;
    private initiateEmolaPayment;
    private scheduleStatusCheck;
    getTransactionStatus(reference: string): Promise<{
        status: string;
        message: string;
        reference?: undefined;
        method?: undefined;
        amount?: undefined;
        createdAt?: undefined;
        paidAt?: undefined;
    } | {
        status: import(".prisma/client").$Enums.WalletTransactionStatus;
        reference: string;
        method: import(".prisma/client").$Enums.WalletMethod;
        amount: number;
        createdAt: Date;
        paidAt: Date;
        message?: undefined;
    }>;
    handleMpesaCallback(data: any): Promise<{
        success: boolean;
    }>;
    handleEmolaCallback(data: any): Promise<{
        success: boolean;
    }>;
    private completeTransaction;
    private failTransaction;
    private getMpesaToken;
    checkExamAccess(userId: string, examId: string): Promise<boolean>;
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
}
