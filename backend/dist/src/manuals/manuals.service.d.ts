import { PrismaService } from '../database/prisma.service';
export declare class ManualsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(subjectId: string, data: any): Promise<{
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
    findAll(): Promise<({
        subject: {
            institutionId: string;
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
    })[]>;
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
