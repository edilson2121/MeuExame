import { PrismaService } from '../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class PlansService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPlanDto: CreatePlanDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        duration: number;
        type: import(".prisma/client").$Enums.SubscriptionPlan;
    }>;
    findAll(): Promise<{
        description: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        duration: number;
        type: import(".prisma/client").$Enums.SubscriptionPlan;
    }[]>;
    findActive(): Promise<{
        description: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        duration: number;
        type: import(".prisma/client").$Enums.SubscriptionPlan;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        duration: number;
        type: import(".prisma/client").$Enums.SubscriptionPlan;
    }>;
    update(id: string, updatePlanDto: UpdatePlanDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        duration: number;
        type: import(".prisma/client").$Enums.SubscriptionPlan;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        duration: number;
        type: import(".prisma/client").$Enums.SubscriptionPlan;
    }>;
}
