import { ExamStatus } from '@prisma/client';
export declare class CreateExamDto {
    title: string;
    description?: string;
    subjectId?: string;
    authorId: string;
    duration?: number;
    totalPoints?: number;
    examDate?: string;
    status?: ExamStatus;
    imageUrl?: string;
    year?: number;
}
