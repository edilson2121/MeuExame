import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSubjectDto: CreateSubjectDto): Promise<{
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    findAll(): Promise<({
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    })[]>;
    findByInstitution(institutionId: string): Promise<({
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    })[]>;
    findByCourse(courseId: string): Promise<({
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<{
        course: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    remove(id: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
}
