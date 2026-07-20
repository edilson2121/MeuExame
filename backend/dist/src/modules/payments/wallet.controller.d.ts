import { WalletService, PaymentMethod } from './wallet-service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    initiatePayment(req: any, body: {
        examId: string;
        method: PaymentMethod;
        phone: string;
        amount: number;
    }): Promise<import("./wallet-service").PaymentInitResult>;
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
    getUserTransactions(req: any): Promise<{
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
    checkExamAccess(req: any, examId: string): Promise<{
        hasAccess: boolean;
    }>;
    handleMpesaWebhook(body: any, signature: string): Promise<{
        success: boolean;
    }>;
    handleEmolaWebhook(body: any, signature: string): Promise<{
        success: boolean;
    }>;
    handleDebitPayWebhook(body: any, signature: string): Promise<{
        success: boolean;
    }>;
}
