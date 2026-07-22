import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: {
            subscription: {
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                planId: string;
                amount: number;
                currency: string;
                startDate: Date | null;
                endDate: Date | null;
            };
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            hasFullAccess: boolean;
            email: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
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
                planId: string;
                amount: number;
                currency: string;
                startDate: Date | null;
                endDate: Date | null;
            };
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            hasFullAccess: boolean;
            email: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            institutionId: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            hasFullAccess: boolean;
            email: string;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
        token: string;
    }>;
    googleAuth(res: Response): void;
    googleAuthCallback(code: string, res: Response): Promise<void>;
}
