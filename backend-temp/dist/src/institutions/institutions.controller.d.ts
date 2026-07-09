import { InstitutionsService } from './institutions.service';
export declare class InstitutionsController {
    private readonly institutionsService;
    constructor(institutionsService: InstitutionsService);
    create(createInstitutionDto: any): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateInstitutionDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}
