import { PrismaService } from '../../prisma/prisma.service';
interface DebitoPayWebhookPayload {
    event: string;
    data: {
        transactionId: string;
        status: 'SUCCESS' | 'FAILED' | 'PENDING';
        amount: number;
        phone: string;
        instructionId?: string;
        reference?: string;
        timestamp?: string;
    };
    signature?: string;
}
export declare class WebhookService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleDebitoPayWebhook(payload: DebitoPayWebhookPayload): Promise<{
        success: boolean;
        message: string;
    }>;
    private grantExamAccess;
    private activateSubscription;
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
export {};
