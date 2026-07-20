import { Request } from 'express';
import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handleDebitoPayWebhook(payload: any, signature: string, request: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    handleMpesaCallback(payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleEmolaCallback(payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
