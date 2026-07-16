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
            subscription: {
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                amount: number;
                currency: string;
                startDate: Date | null;
                endDate: Date | null;
            };
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        token: string;
    }>;
    adminLogin(loginDto: LoginDto): Promise<{
        user: {
            subscription: {
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                amount: number;
                currency: string;
                startDate: Date | null;
                endDate: Date | null;
            };
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        token: string;
    }>;
    private loginWithRole;
    register(registerDto: RegisterDto): Promise<{
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.Role;
        };
        token: string;
    }>;
}
