export declare class SubjectsService {
    findAll(): any[];
    findByInstitution(institutionId: string): any[];
    findByCourse(courseId: string): any[];
    findOne(id: string): {
        id: string;
    };
    create(createSubjectDto: any): any;
    update(id: string, updateSubjectDto: any): any;
    remove(id: string): {
        deleted: string;
    };
}
