import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
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
