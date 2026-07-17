import { QuestionType } from '@prisma/client';
export declare class CreateQuestionDto {
    text: string;
    type: QuestionType;
    options?: any;
    correctAnswer?: string;
    explanation?: string;
    imageUrl?: string;
    points?: number;
    exerciseId?: string;
}
