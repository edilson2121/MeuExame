import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createContentDto: CreateContentDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
    }>;
    findAll(): Promise<({
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
        exercises: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
            contentId: string;
        }[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
        exercises: ({
            questions: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                options: import("@prisma/client/runtime/library").JsonValue | null;
                correctAnswer: string | null;
                explanation: string | null;
                exerciseId: string;
            }[];
        } & {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
            contentId: string;
        })[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
    }>;
    findByUser(userId: string): Promise<({
        exercises: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            subjectId: string | null;
            contentId: string;
        }[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
    })[]>;
    update(id: string, updateContentDto: UpdateContentDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
    }>;
    remove(id: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        subjectId: string | null;
    }>;
}
