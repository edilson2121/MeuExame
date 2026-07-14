import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    create(createPageDto: CreatePageDto, req: any): Promise<{
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
    findAllAdmin(req: any): Promise<({
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
    findOneAdmin(id: string, req: any): Promise<{
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
    update(id: string, updatePageDto: UpdatePageDto, req: any): Promise<{
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
    publish(id: string, req: any): Promise<{
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
    archive(id: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
    findMenu(): Promise<any[]>;
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
}
