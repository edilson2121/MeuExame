import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    update(id: string, updateUserDto: any): Promise<{
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
