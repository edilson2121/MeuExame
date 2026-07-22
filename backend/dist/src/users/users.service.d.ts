import { PrismaService } from '../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
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
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    remove(id: string): Promise<{
        institutionId: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        hasFullAccess: boolean;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
