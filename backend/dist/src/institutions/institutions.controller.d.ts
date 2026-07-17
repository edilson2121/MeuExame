import { InstitutionsService } from './institutions.service';
export declare class InstitutionsController {
    private readonly institutionsService;
    constructor(institutionsService: InstitutionsService);
    create(createInstitutionDto: any): Promise<{
        id: string;
        name: string;
        city: string | null;
        country: string;
        isActive: boolean;
        isPaid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        city: string | null;
        country: string;
        isActive: boolean;
        isPaid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        city: string | null;
        country: string;
        isActive: boolean;
        isPaid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateInstitutionDto: any): Promise<{
        id: string;
        name: string;
        city: string | null;
        country: string;
        isActive: boolean;
        isPaid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        city: string | null;
        country: string;
        isActive: boolean;
        isPaid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
