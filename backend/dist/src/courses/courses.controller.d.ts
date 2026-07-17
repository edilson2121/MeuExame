import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }[]>;
    findByInstitution(institutionId: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    create(createCourseDto: CreateCourseDto): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    update(id: string, updateCourseDto: Partial<CreateCourseDto>): Promise<{
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
