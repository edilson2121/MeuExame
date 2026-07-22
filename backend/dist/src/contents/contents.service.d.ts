import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createContentDto: CreateContentDto): Promise<{
        content: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ContentType;
        subjectId: string;
        authorId: string;
        views: number;
        likes: number;
    }>;
    findAll(): Promise<({
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            hasFullAccess: boolean;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        content: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ContentType;
        subjectId: string;
        authorId: string;
        views: number;
        likes: number;
    })[]>;
    findOne(id: string): Promise<{
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
        author: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            hasFullAccess: boolean;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        content: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ContentType;
        subjectId: string;
        authorId: string;
        views: number;
        likes: number;
    }>;
    findByAuthor(authorId: string): Promise<({
        subject: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        };
    } & {
        content: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ContentType;
        subjectId: string;
        authorId: string;
        views: number;
        likes: number;
    })[]>;
    update(id: string, updateContentDto: UpdateContentDto): Promise<{
        content: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ContentType;
        subjectId: string;
        authorId: string;
        views: number;
        likes: number;
    }>;
    remove(id: string): Promise<{
        content: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ContentType;
        subjectId: string;
        authorId: string;
        views: number;
        likes: number;
    }>;
}
