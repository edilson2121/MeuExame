import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
    create(req: any, createExamDto: CreateExamDto): Promise<{
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        subjectId: string;
        authorId: string;
        imageUrl: string | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<({
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        subjectId: string;
        authorId: string;
        imageUrl: string | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findBySubject(subjectId: string): Promise<({
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        subjectId: string;
        authorId: string;
        imageUrl: string | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findByInstitution(institutionId: string): Promise<({
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        subjectId: string;
        authorId: string;
        imageUrl: string | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: string): Promise<{
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        subjectId: string;
        authorId: string;
        imageUrl: string | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    validateAnswers(id: string, body: {
        answers: any;
    }): Promise<{
        score: number;
        correctCount: number;
        totalQuestions: number;
        results: any[];
    }>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<{
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        subjectId: string;
        authorId: string;
        imageUrl: string | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        subjectId: string;
        authorId: string;
        imageUrl: string | null;
        questions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
