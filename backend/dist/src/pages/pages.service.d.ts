import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPageDto: CreatePageDto, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
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
    }>;
    findAll(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
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
    findOneAdmin(id: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
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
    }>;
    update(id: string, updatePageDto: UpdatePageDto, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
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
    }>;
    publish(id: string, userId: string): Promise<{
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
    archive(id: string, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
        user: {
            id: string;
            name: string;
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
    }>;
    findPublishedMenu(): Promise<any[]>;
    findPublished(): Promise<{
        user: {
            name: string;
        };
        id: string;
        title: string;
        slug: string;
        description: string;
        publishedAt: Date;
    }[]>;
}
