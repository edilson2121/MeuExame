import { PrismaService } from '../database/prisma.service';
import { CreateDynamicPageDto } from './dto/create-dynamic-page.dto';
import { UpdateDynamicPageDto } from './dto/update-dynamic-page.dto';
export declare class DynamicPagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDynamicPageDto: CreateDynamicPageDto): Promise<{
        content: string;
        title: string;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        isPublished: boolean;
        createdBy: string;
    }>;
    findAll(): Promise<{
        content: string;
        title: string;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        isPublished: boolean;
        createdBy: string;
    }[]>;
    findPublished(): Promise<{
        content: string;
        title: string;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        isPublished: boolean;
        createdBy: string;
    }[]>;
    findBySlug(slug: string): Promise<{
        content: string;
        title: string;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        isPublished: boolean;
        createdBy: string;
    }>;
    findOne(id: string): Promise<{
        content: string;
        title: string;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        isPublished: boolean;
        createdBy: string;
    }>;
    update(id: string, updateDynamicPageDto: UpdateDynamicPageDto): Promise<{
        content: string;
        title: string;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        isPublished: boolean;
        createdBy: string;
    }>;
    remove(id: string): Promise<{
        content: string;
        title: string;
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        isPublished: boolean;
        createdBy: string;
    }>;
}
