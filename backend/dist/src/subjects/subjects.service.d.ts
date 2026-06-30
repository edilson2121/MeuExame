import { PrismaService } from '../database/prisma.service';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        description?: string;
        courseId: string;
    }): Promise<{
        course: {
            institution: {
                id: string;
                email: string | null;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                address: string | null;
                phone: string | null;
                website: string | null;
                logo: string | null;
            };
        } & {
            id: string;
            name: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        courseId: string;
    }>;
    findAll(): Promise<{
        _count: {
            contents: number;
            exercises: number;
            exams: number;
        };
        course: {
            institution: {
                id: string;
                email: string | null;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                address: string | null;
                phone: string | null;
                website: string | null;
                logo: string | null;
            };
        } & {
            id: string;
            name: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        courseId: string;
    }[]>;
    findOne(id: string): Promise<{
        course: {
            institution: {
                id: string;
                email: string | null;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                address: string | null;
                phone: string | null;
                website: string | null;
                logo: string | null;
            };
        } & {
            id: string;
            name: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        courseId: string;
    }>;
    update(id: string, data: {
        name?: string;
        description?: string;
        courseId?: string;
    }): Promise<{
        course: {
            institution: {
                id: string;
                email: string | null;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                address: string | null;
                phone: string | null;
                website: string | null;
                logo: string | null;
            };
        } & {
            id: string;
            name: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        courseId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        courseId: string;
    }>;
}
