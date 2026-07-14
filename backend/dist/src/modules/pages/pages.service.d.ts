import { PrismaService } from '../../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaService);
    createPage(userId: string, data: CreatePageDto): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    })[]>;
    findOne(id: string): Promise<{
        sections: {
            content: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            sortOrder: number;
            type: string;
            imageUrl: string | null;
            imageAlt: string | null;
            pageId: string;
        }[];
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    findBySlug(slug: string): Promise<{
        sections: {
            content: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            sortOrder: number;
            type: string;
            imageUrl: string | null;
            imageAlt: string | null;
            pageId: string;
        }[];
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    update(id: string, data: Partial<CreatePageDto>): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    delete(id: string): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    publish(id: string): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string | null;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    getMenuPages(): Promise<{
        id: string;
        title: string;
        slug: string;
        menuOrder: number;
    }[]>;
    private generateSlug;
}
