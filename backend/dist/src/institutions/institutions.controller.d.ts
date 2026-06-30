import { InstitutionsService } from './institutions.service';
export declare class InstitutionsController {
    private readonly institutionsService;
    constructor(institutionsService: InstitutionsService);
    create(createInstitutionDto: any): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        logo: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            users: number;
            courses: number;
        };
    } & {
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        logo: string | null;
    })[]>;
    findOne(id: string): Promise<{
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        courses: ({
            subjects: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                courseId: string;
            }[];
        } & {
            id: string;
            name: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        })[];
    } & {
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        logo: string | null;
    }>;
    update(id: string, updateInstitutionDto: any): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        logo: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        logo: string | null;
    }>;
}
