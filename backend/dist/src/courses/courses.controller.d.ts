import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
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
