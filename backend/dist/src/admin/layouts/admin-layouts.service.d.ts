import { PrismaService } from '../../database/prisma.service';
import { CreateLayoutTemplateDto, UpdateLayoutTemplateDto } from './dto/layout-template.dto';
export declare class AdminLayoutsService {
    private prisma;
    constructor(prisma: PrismaService);
    createLayout(dto: CreateLayoutTemplateDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        html: string;
        css: string | null;
        thumbnail: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateLayout(layoutId: string, dto: UpdateLayoutTemplateDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        html: string;
        css: string | null;
        thumbnail: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getLayoutById(layoutId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        html: string;
        css: string | null;
        thumbnail: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAllLayouts(onlyActive?: boolean): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        html: string;
        css: string | null;
        thumbnail: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    deleteLayout(layoutId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        html: string;
        css: string | null;
        thumbnail: string | null;
        config: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
