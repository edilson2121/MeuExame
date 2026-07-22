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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
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
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
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
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
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
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
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
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
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
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }>;
    remove(id: string): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }>;
}
