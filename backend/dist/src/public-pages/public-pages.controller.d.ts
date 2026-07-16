import { PublicPagesService } from './public-pages.service';
export declare class PublicPagesController {
    private readonly pagesService;
    constructor(pagesService: PublicPagesService);
    getPublishedByInstitution(institutionId: string): Promise<({
        institution: {
            description: string | null;
            id: string;
            name: string;
            logo: string | null;
            website: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
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
    getBySlug(slug: string, institutionId: string): Promise<{
        institution: {
            description: string | null;
            id: string;
            name: string;
            logo: string | null;
            website: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
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
    getMenu(institutionId: string): Promise<{
        title: string;
        slug: string;
        menuOrder: number;
        id: string;
    }[]>;
}
