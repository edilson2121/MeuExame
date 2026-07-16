import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsService } from './subjects.service';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    findAll(): any[];
    findByInstitution(institutionId: string): any[];
    findByCourse(courseId: string): any[];
    findOne(id: string): {
        id: string;
    };
    create(createSubjectDto: CreateSubjectDto): any;
    update(id: string, updateSubjectDto: UpdateSubjectDto): any;
    remove(id: string): {
        deleted: string;
    };
}
