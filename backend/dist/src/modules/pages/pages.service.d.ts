import { PrismaService } from '../../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaService);
    createPage(userId: string, data: CreatePageDto): Promise<{
        content: string;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        authorId: string;
        keywords: string | null;
        template: string;
    }>;
    findAll(): Promise<({
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        content: string;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        authorId: string;
        keywords: string | null;
        template: string;
    })[]>;
    findOne(id: string): Promise<{
        sections: {
            content: string | null;
            title: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            imageUrl: string | null;
            sortOrder: number;
            imageAlt: string | null;
            pageId: string;
        }[];
    } & {
        content: string;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        authorId: string;
        keywords: string | null;
        template: string;
    }>;
    findBySlug(slug: string): Promise<{
        sections: {
            content: string | null;
            title: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            imageUrl: string | null;
            sortOrder: number;
            imageAlt: string | null;
            pageId: string;
        }[];
    } & {
        content: string;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        authorId: string;
        keywords: string | null;
        template: string;
    }>;
    update(id: string, data: Partial<CreatePageDto>): Promise<{
        content: string;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        authorId: string;
        keywords: string | null;
        template: string;
    }>;
    delete(id: string): Promise<{
        content: string;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        authorId: string;
        keywords: string | null;
        template: string;
    }>;
    publish(id: string): Promise<{
        content: string;
        title: string;
        slug: string;
        description: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        authorId: string;
        keywords: string | null;
        template: string;
    }>;
    getMenuPages(): Promise<{
        title: string;
        slug: string;
        menuOrder: number;
        id: string;
    }[]>;
    private generateSlug;
}
