import { ResultsService } from '../services/results.service';
export declare class ResultsController {
    private resultsService;
    constructor(resultsService: ResultsService);
    getMyResults(req: any): Promise<({
        exam: {
            title: string;
            description: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        examId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number;
    })[]>;
    getExamResults(req: any, examId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        examId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number;
    }[]>;
    getResult(id: string): Promise<{
        exam: {
            examQuestions: ({
                question: {
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
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                examId: string;
                questionId: string;
                order: number;
                points: number;
            })[];
        } & {
            title: string;
            description: string | null;
            status: import(".prisma/client").$Enums.ExamStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number | null;
            year: number | null;
            subjectId: string | null;
            authorId: string;
            imageUrl: string | null;
            totalPoints: number;
            examDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        examId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number;
    }>;
}
