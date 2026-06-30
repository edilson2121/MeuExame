import { SubjectsService } from './subjects.service';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(createSubjectDto: any): Promise<{
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
    update(id: string, updateSubjectDto: any): Promise<{
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
