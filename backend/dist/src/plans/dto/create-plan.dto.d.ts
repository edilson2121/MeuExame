import { SubscriptionPlan } from '@prisma/client';
export declare class CreatePlanDto {
    name: string;
    description?: string;
    price: number;
    duration: number;
    type: SubscriptionPlan;
    isActive?: boolean;
}
