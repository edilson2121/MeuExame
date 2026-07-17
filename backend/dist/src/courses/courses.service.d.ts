import { PrismaService } from '../database/prisma.service';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }[]>;
    findByInstitution(institutionId: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    create(name: string, institutionId?: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    update(id: string, name: string, institutionId?: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    remove(id: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
}
