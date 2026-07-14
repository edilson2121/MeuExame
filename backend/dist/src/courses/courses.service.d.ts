import { PrismaService } from '../database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        subjects: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        subjects: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createCourseDto: CreateCourseDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCourseDto: Partial<CreateCourseDto>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
