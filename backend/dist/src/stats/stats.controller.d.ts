import { PrismaService } from '../database/prisma.service';
export declare class StatsController {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        users: number;
        institutions: number;
        courses: number;
        subjects: number;
    }>;
}
