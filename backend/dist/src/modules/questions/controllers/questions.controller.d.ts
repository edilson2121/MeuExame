import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(createQuestionDto: CreateQuestionDto): Promise<{
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
    }>;
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
    findByExercise(exerciseId: string): Promise<{
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
    }[]>;
    findByType(type: string): Promise<{
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
    }[]>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
