import { SimulationsService } from '../services/simulations.service';
import { CreateSimulationDto } from '../dto/create-simulation.dto';
import { UpdateSimulationDto } from '../dto/update-simulation.dto';
export declare class SimulationsController {
    private readonly simulationsService;
    constructor(simulationsService: SimulationsService);
    create(createSimulationDto: CreateSimulationDto): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }>;
    findAll(): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }[]>;
    findOne(id: string): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }>;
    findByUser(userId: string): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }[]>;
    findByExam(examId: string): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }[]>;
    startSimulation(examId: string, body: {
        userId: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }>;
    completeSimulation(id: string, body: {
        answers: any;
    }): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }>;
    update(id: string, updateSimulationDto: UpdateSimulationDto): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }>;
    remove(id: string): Promise<{
        status: import(".prisma/client").$Enums.SimulationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        examId: string;
        startedAt: Date;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        score: number | null;
    }>;
}
