import { ManualsService } from './manuals.service';
export declare class ManualsController {
    private readonly manualsService;
    constructor(manualsService: ManualsService);
    findBySubject(subjectId: string): Promise<{
        title: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType: string;
    }[]>;
    findOne(id: string): Promise<{
        subject: {
            id: string;
            name: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType: string;
    }>;
    create(data: {
        subjectId: string;
        title: string;
        description?: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType?: string;
    }): Promise<{
        subject: {
            id: string;
            name: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType: string;
    }>;
    update(id: string, data: any): Promise<{
        title: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType: string;
    }>;
    delete(id: string): Promise<{
        title: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType: string;
    }>;
    toggleActive(id: string): Promise<{
        title: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType: string;
    }>;
}
