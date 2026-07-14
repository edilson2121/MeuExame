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
        exerciseId: string;
    }>;
    findAll(): Promise<({
        exercise: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
            contentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        exerciseId: string;
    })[]>;
    findOne(id: string): Promise<{
        exercise: {
            content: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                userId: string;
                body: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
            contentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        exerciseId: string;
    }>;
    findByExercise(exerciseId: string): Promise<({
        exercise: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
            contentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        exerciseId: string;
    })[]>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        exerciseId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        exerciseId: string;
    }>;
}
