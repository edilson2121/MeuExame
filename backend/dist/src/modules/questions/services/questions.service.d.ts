import { PrismaService } from '../../../prisma/prisma.service';
import { Question } from '@prisma/client';
import { IQuestionService } from '../interfaces/question.interface';
export declare class QuestionsService implements IQuestionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createQuestionDto: any): Promise<Question>;
    findAll(): Promise<Question[]>;
    findOne(id: string): Promise<Question>;
    update(id: string, updateQuestionDto: any): Promise<Question>;
    remove(id: string): Promise<Question>;
    findByExercise(exerciseId: string): Promise<Question[]>;
    findByType(type: string): Promise<Question[]>;
}
