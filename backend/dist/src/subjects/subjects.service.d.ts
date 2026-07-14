import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSubjectDto: CreateSubjectDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    }>;
    findAll(): Promise<({
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    })[]>;
    findOne(id: string): Promise<{
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    }>;
    findByCourse(courseId: string): Promise<({
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    })[]>;
    update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    }>;
}
