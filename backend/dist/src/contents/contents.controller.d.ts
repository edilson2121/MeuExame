import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentsController {
    private readonly contentsService;
    constructor(contentsService: ContentsService);
    create(createContentDto: CreateContentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        exercises: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
            contentId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
    })[]>;
    findByUser(userId: string): Promise<({
        exercises: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
            contentId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        exercises: ({
            questions: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                exerciseId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            body: string;
            contentId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
    }>;
    update(id: string, updateContentDto: UpdateContentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        body: string;
    }>;
}
