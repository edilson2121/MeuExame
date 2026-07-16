import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createQuestionDto: CreateQuestionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    }>;
    findAll(): Promise<({
        exercise: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
            contentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    })[]>;
    findOne(id: string): Promise<{
        exercise: {
            content: {
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                body: string;
                subjectId: string | null;
            };
        } & {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
            contentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    }>;
    findByExercise(exerciseId: string): Promise<({
        exercise: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
            contentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    })[]>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    }>;
}
