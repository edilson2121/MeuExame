import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPageDto: CreatePageDto, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
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
    }>;
    findAll(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
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
    findOneAdmin(id: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
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
    }>;
    update(id: string, updatePageDto: UpdatePageDto, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
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
    }>;
    publish(id: string, userId: string): Promise<{
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
    archive(id: string, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
        user: {
            id: string;
            name: string;
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
    }>;
    findPublishedMenu(): Promise<any[]>;
    findPublished(): Promise<{
        user: {
            name: string;
        };
        title: string;
        slug: string;
        description: string;
        id: string;
        publishedAt: Date;
    }[]>;
}
