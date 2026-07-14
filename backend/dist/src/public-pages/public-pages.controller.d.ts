import { PublicPagesService } from './public-pages.service';
export declare class PublicPagesController {
    private readonly pagesService;
    constructor(pagesService: PublicPagesService);
    getPublishedByInstitution(institutionId: string): Promise<({
        institution: {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            logo: string | null;
            website: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
        };
        layout: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            html: string;
            css: string | null;
            thumbnail: string | null;
            config: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        content: string | null;
        id: string;
        institutionId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        layoutId: string;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        seoTitle: string | null;
        seoKeywords: string | null;
        isActive: boolean;
    })[]>;
    getBySlug(slug: string, institutionId: string): Promise<{
        institution: {
            id: string;
            email: string | null;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            logo: string | null;
            website: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
        };
        layout: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            html: string;
            css: string | null;
            thumbnail: string | null;
            config: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        content: string | null;
        id: string;
        institutionId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        layoutId: string;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        seoTitle: string | null;
        seoKeywords: string | null;
        isActive: boolean;
    }>;
    getMenu(institutionId: string): Promise<{
        id: string;
        title: string;
        slug: string;
        menuOrder: number;
    }[]>;
}
