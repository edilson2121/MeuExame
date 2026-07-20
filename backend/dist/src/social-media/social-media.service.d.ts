import { PrismaService } from '../database/prisma.service';
export declare const SOCIAL_MEDIA_ICONS: Record<string, string>;
export declare const SOCIAL_MEDIA_COLORS: Record<string, string>;
export declare class SocialMediaService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        platform: string;
        url: string;
        icon?: string;
        position?: number;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
    findAll(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }[]>;
    findActive(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }[]>;
    update(id: string, data: {
        url?: string;
        icon?: string;
        position?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
}
