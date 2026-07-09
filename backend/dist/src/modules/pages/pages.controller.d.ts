import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
export declare class PagesController {
    private pagesService;
    constructor(pagesService: PagesService);
    create(req: any, data: CreatePageDto): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        slug: string;
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
        description: string | null;
        title: string;
        slug: string;
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
            isActive: boolean;
            title: string | null;
            sortOrder: number;
            type: string;
            imageUrl: string | null;
            imageAlt: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            pageId: string;
        }[];
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        slug: string;
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
        description: string | null;
        title: string;
        slug: string;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    remove(id: string): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        slug: string;
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
        description: string | null;
        title: string;
        slug: string;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    getMenu(): Promise<{
        id: string;
        title: string;
        slug: string;
        menuOrder: number;
    }[]>;
    getBySlug(slug: string): Promise<{
        sections: {
            content: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            title: string | null;
            sortOrder: number;
            type: string;
            imageUrl: string | null;
            imageAlt: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            pageId: string;
        }[];
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        slug: string;
        keywords: string | null;
        template: string | null;
        showInMenu: boolean;
        menuOrder: number;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
}
