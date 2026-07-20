import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    initiatePayment(body: {
        examId: string;
        method: 'MPESA' | 'EMOLA';
        phone: string;
        amount: number;
    }, req: any): Promise<import("./wallet.service").PaymentInitResult>;
    checkStatus(reference: string): Promise<import("./wallet.service").PaymentStatusResult>;
    pollStatus(reference: string): Promise<import("./wallet.service").PaymentStatusResult>;
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
    mpesaWebhook(payload: any): Promise<{
        status: string;
    }>;
    emolaWebhook(payload: any): Promise<{
        status: string;
    }>;
}
