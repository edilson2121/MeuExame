import { PrismaService } from '../prisma/prisma.service';
export declare class InstitutionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
