import { PrismaService } from '../database/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findByUser(userId: string): Promise<{
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
    findUnread(userId: string): Promise<{
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
    countUnread(userId: string): Promise<number>;
    markAsRead(id: string, userId: string): Promise<{
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
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string, userId: string): Promise<{
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
    deleteAll(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
