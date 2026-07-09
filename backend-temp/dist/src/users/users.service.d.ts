import { PrismaService } from '../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, data: {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
    }): Promise<any>;
    remove(id: string): Promise<any>;
}
