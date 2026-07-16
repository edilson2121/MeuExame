import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<({
        institution: {
            description: string | null;
            id: string;
            name: string;
            logo: string | null;
            website: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        subjects: {
            institutionId: string | null;
            description: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        }[];
    } & {
        institutionId: string | null;
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findByInstitution(institutionId: string): Promise<({
        subjects: {
            institutionId: string | null;
            description: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        }[];
    } & {
        institutionId: string | null;
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        institution: {
            description: string | null;
            id: string;
            name: string;
            logo: string | null;
            website: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        subjects: {
            institutionId: string | null;
            description: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        }[];
    } & {
        institutionId: string | null;
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createCourseDto: CreateCourseDto): Promise<{
        institution: {
            description: string | null;
            id: string;
            name: string;
            logo: string | null;
            website: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateCourseDto: Partial<CreateCourseDto>): Promise<{
        institution: {
            description: string | null;
            id: string;
            name: string;
            logo: string | null;
            website: string | null;
            phone: string | null;
            email: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            isPaid: boolean;
            paidAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        institutionId: string | null;
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        institutionId: string | null;
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
