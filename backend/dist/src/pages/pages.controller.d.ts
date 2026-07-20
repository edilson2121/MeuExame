import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    create(createPageDto: CreatePageDto, req: any): Promise<{
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
    findAllAdmin(req: any): Promise<({
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
    findOneAdmin(id: string, req: any): Promise<{
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
    update(id: string, updatePageDto: UpdatePageDto, req: any): Promise<{
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
    publish(id: string, req: any): Promise<{
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
    archive(id: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
    findMenu(): Promise<any[]>;
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
}
