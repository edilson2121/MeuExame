import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    update(id: string, updateUserDto: any): Promise<{
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
