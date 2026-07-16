import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
export declare class ExercisesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createExerciseDto: CreateExerciseDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
        contentId: string;
    }>;
    findAll(): Promise<({
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
        content: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
        };
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            explanation: string | null;
            exerciseId: string;
        }[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
        contentId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
        content: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
        };
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            explanation: string | null;
            exerciseId: string;
        }[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
        contentId: string;
    }>;
    findByContent(contentId: string): Promise<({
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            explanation: string | null;
            exerciseId: string;
        }[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
        contentId: string;
    })[]>;
    update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
        contentId: string;
    }>;
    remove(id: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
        contentId: string;
    }>;
}
