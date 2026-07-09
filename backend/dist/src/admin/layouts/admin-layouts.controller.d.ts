import { AdminLayoutsService } from './admin-layouts.service';
import { CreateLayoutTemplateDto, UpdateLayoutTemplateDto } from './dto/layout-template.dto';
export declare class AdminLayoutsController {
    private readonly layoutsService;
    constructor(layoutsService: AdminLayoutsService);
    create(dto: CreateLayoutTemplateDto): Promise<{
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
    update(id: string, dto: UpdateLayoutTemplateDto): Promise<{
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
    getById(id: string): Promise<{
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
    getAll(active?: string): Promise<{
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
    delete(id: string): Promise<void>;
}
