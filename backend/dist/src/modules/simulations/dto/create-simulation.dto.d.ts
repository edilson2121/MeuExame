import { SimulationStatus } from '@prisma/client';
export declare class CreateSimulationDto {
    examId: string;
    userId: string;
    duration?: number;
    answers?: any;
    status?: SimulationStatus;
}
