import { NotificationsService } from './notifications.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findByUser(req: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        userId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        link: string | null;
        message: string;
        isGlobal: boolean;
        isRead: boolean;
    }[]>;
    findUnread(req: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        userId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        link: string | null;
        message: string;
        isGlobal: boolean;
        isRead: boolean;
    }[]>;
    countUnread(req: any): Promise<number>;
    create(data: {
        title: string;
        message: string;
        type?: NotificationType;
        link?: string;
        userId?: string;
        isGlobal?: boolean;
    }): Promise<import(".prisma/client").Prisma.BatchPayload | {
        title: string;
        id: string;
        createdAt: Date;
        userId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        link: string | null;
        message: string;
        isGlobal: boolean;
        isRead: boolean;
    }>;
    markAsRead(id: string, req: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        userId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        link: string | null;
        message: string;
        isGlobal: boolean;
        isRead: boolean;
    }>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string, req: any): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        userId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        link: string | null;
        message: string;
        isGlobal: boolean;
        isRead: boolean;
    }>;
    deleteAll(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
