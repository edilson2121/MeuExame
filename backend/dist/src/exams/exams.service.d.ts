import { PrismaService } from '../database/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
export declare class ExamsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createExamDto: CreateExamDto): Promise<{
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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
    }>;
    remove(id: string): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
    }>;
    validateAnswers(examId: string, userAnswers: any): Promise<{
        score: number;
        correctCount: number;
        totalQuestions: number;
        results: any[];
    }>;
}
