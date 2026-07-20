import { ConfigService } from '@nestjs/config';
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class NotificationsService {
    private configService;
    private readonly logger;
    private readonly smtpHost;
    private readonly smtpPort;
    private readonly smtpUser;
    private readonly smtpPass;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
    sendPaymentConfirmation(email: string, amount: number, plan: string): Promise<boolean>;
    sendExamResultEmail(email: string, examTitle: string, score: number): Promise<boolean>;
}
