import { AdminPagesService } from './admin-pages.service';
import { CreateInstitutionPageDto, UpdateInstitutionPageDto, PublishInstitutionPageDto } from './dto/institution-page.dto';
export declare class AdminPagesController {
    private readonly pagesService;
    constructor(pagesService: AdminPagesService);
    create(dto: CreateInstitutionPageDto): Promise<{
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
    update(id: string, dto: UpdateInstitutionPageDto): Promise<{
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
    publish(id: string, dto: PublishInstitutionPageDto): Promise<{
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
    getByInstitution(institutionId: string): Promise<({
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
    getPublishedByInstitution(institutionId: string): Promise<({
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
    getById(id: string): Promise<{
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
    delete(id: string): Promise<void>;
}
