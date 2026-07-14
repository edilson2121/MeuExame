import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
export declare class ExercisesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createExerciseDto: CreateExerciseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
        contentId: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        content: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
        };
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            exerciseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
        contentId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        content: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
        };
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            exerciseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
        contentId: string;
    }>;
    findByContent(contentId: string): Promise<({
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            exerciseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
        contentId: string;
    })[]>;
    update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
        contentId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
        contentId: string;
    }>;
}
