import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            institutionId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
}
