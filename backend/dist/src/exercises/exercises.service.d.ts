import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
export declare class ExercisesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createExerciseDto: CreateExerciseDto): Promise<{
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        authorId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
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
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.QuestionType;
            imageUrl: string | null;
            points: number;
            text: string;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            explanation: string | null;
            exerciseId: string | null;
        }[];
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        authorId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
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
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.QuestionType;
            imageUrl: string | null;
            points: number;
            text: string;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            explanation: string | null;
            exerciseId: string | null;
        }[];
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        authorId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
    }>;
    findBySubject(subjectId: string): Promise<({
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.QuestionType;
            imageUrl: string | null;
            points: number;
            text: string;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            explanation: string | null;
            exerciseId: string | null;
        }[];
    } & {
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        authorId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
    })[]>;
    update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<{
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        authorId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
    }>;
    remove(id: string): Promise<{
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subjectId: string;
        authorId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
    }>;
}
