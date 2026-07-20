import { PrismaService } from '../../../prisma/prisma.service';
import { Exam } from '@prisma/client';
import { IExamService } from '../interfaces/exam.interface';
export declare class ExamsService implements IExamService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createExamDto: any): Promise<Exam>;
    findAll(): Promise<Exam[]>;
    findOne(id: string): Promise<Exam>;
    update(id: string, updateExamDto: any): Promise<Exam>;
    remove(id: string): Promise<Exam>;
    findBySubject(subjectId: string): Promise<Exam[]>;
    findByAuthor(authorId: string): Promise<Exam[]>;
    addQuestion(examId: string, questionId: string, order: number, points: number): Promise<void>;
    removeQuestion(examId: string, questionId: string): Promise<void>;
    publishExam(id: string): Promise<Exam>;
}
