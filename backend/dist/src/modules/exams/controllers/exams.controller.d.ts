import { ExamsService } from '../services/exams.service';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
interface SubmitAnswerDto {
    questionId: string;
    selectedOption: number;
}
interface SubmitExamDto {
    answers: SubmitAnswerDto[];
}
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
    create(createExamDto: CreateExamDto): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }>;
    findAll(): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }[]>;
    findOne(id: string, req: any): Promise<any>;
    findBySubject(subjectId: string): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }[]>;
    findByAuthor(authorId: string): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }[]>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }>;
    remove(id: string): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }>;
    addQuestion(id: string, body: {
        questionId: string;
        order: number;
        points: number;
    }): Promise<void>;
    removeQuestion(id: string, questionId: string): Promise<void>;
    publish(id: string): Promise<{
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number | null;
        duration: number | null;
        year: number | null;
        subjectId: string | null;
        authorId: string;
        imageUrl: string | null;
        totalPoints: number;
        examDate: Date | null;
        accessType: string;
    }>;
    submitExam(id: string, submitExamDto: SubmitExamDto, req: any): Promise<{
        score: number;
        total: number;
        percentage: number;
    }>;
    checkAccess(id: string, req: any): Promise<{
        hasAccess: boolean;
        accessType?: string;
    }>;
}
export {};
