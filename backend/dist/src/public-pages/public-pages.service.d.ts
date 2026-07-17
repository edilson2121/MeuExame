import { PrismaService } from '../database/prisma.service';
export declare class PublicPagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getPublishedPagesByInstitution(institutionId: string): Promise<({
        institution: {
            id: string;
            name: string;
            city: string | null;
            country: string;
            isActive: boolean;
            isPaid: boolean;
            paidAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        layout: {
            description: string | null;
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            html: string;
            css: string | null;
            thumbnail: string | null;
            config: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        content: string | null;
        institutionId: string;
        title: string;
        slug: string;
        description: string | null;
        layoutId: string;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        showInMenu: boolean;
        menuOrder: number;
        seoTitle: string | null;
        seoKeywords: string | null;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
    })[]>;
    getPublishedPageBySlug(slug: string, institutionId: string): Promise<{
        institution: {
            id: string;
            name: string;
            city: string | null;
            country: string;
            isActive: boolean;
            isPaid: boolean;
            paidAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        layout: {
            description: string | null;
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            html: string;
            css: string | null;
            thumbnail: string | null;
            config: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        content: string | null;
        institutionId: string;
        title: string;
        slug: string;
        description: string | null;
        layoutId: string;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        showInMenu: boolean;
        menuOrder: number;
        seoTitle: string | null;
        seoKeywords: string | null;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
    }>;
    getPublicMenu(institutionId: string): Promise<{
        title: string;
        slug: string;
        menuOrder: number;
        id: string;
    }[]>;
}
