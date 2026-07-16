import { PrismaService } from '../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
    }>;
    update(id: string, data: {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
    }>;
    remove(id: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        phone: string | null;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
