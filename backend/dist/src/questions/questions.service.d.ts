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
        imageUrl: string | null;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    }>;
    findAll(): Promise<({
        exercise: {
            title: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subjectId: string;
            authorId: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    })[]>;
    findOne(id: string): Promise<{
        exercise: {
            subject: {
                institutionId: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                courseId: string | null;
            };
            author: {
                institutionId: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                avatar: string | null;
                phone: string | null;
                bio: string | null;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            title: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subjectId: string;
            authorId: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    }>;
    findByExercise(exerciseId: string): Promise<({
        exercise: {
            title: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subjectId: string;
            authorId: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
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
        imageUrl: string | null;
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
        imageUrl: string | null;
        text: string;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string | null;
        explanation: string | null;
        exerciseId: string;
    }>;
}
