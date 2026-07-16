import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
export declare class PagesController {
    private pagesService;
    constructor(pagesService: PagesService);
    create(req: any, data: CreatePageDto): Promise<{
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
        keywords: string | null;
        template: string | null;
        authorId: string;
    }>;
    findAll(): Promise<({
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
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
        keywords: string | null;
        template: string | null;
        authorId: string;
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
            sortOrder: number;
            type: string;
            imageUrl: string | null;
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
        keywords: string | null;
        template: string | null;
        authorId: string;
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
        keywords: string | null;
        template: string | null;
        authorId: string;
    }>;
    remove(id: string): Promise<{
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
        keywords: string | null;
        template: string | null;
        authorId: string;
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
        keywords: string | null;
        template: string | null;
        authorId: string;
    }>;
    getMenu(): Promise<{
        title: string;
        slug: string;
        menuOrder: number;
        id: string;
    }[]>;
    getBySlug(slug: string): Promise<{
        sections: {
            content: string | null;
            title: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            type: string;
            imageUrl: string | null;
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
        keywords: string | null;
        template: string | null;
        authorId: string;
    }>;
}
