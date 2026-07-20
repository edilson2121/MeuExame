import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendTestEmail(body: {
        email: string;
    }): Promise<{
        success: boolean;
    }>;
}
