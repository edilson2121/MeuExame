import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        totalUsers: number;
        totalInstitutions: number;
        totalDisciplines: number;
        totalExams: number;
        totalResults: number;
        publishedExams: number;
        draftExams: number;
    }>;
    getExamsByMonth(): Promise<{
        month: string;
        count: number;
    }[]>;
    getUsersByInstitution(): Promise<{
        name: string;
        count: number;
    }[]>;
    getRevenueByMethod(): Promise<{
        method: string;
        amount: number;
    }[]>;
    getAccessTypeDistribution(): Promise<{
        type: string;
        count: number;
        color: string;
    }[]>;
    getRecentActivity(): Promise<{
        id: string;
        userName: string;
        action: string;
        entity: string;
        createdAt: Date;
    }[]>;
    getExamStats(): Promise<{
        status: string;
        count: number;
    }[]>;
    getAverageScore(): Promise<{
        score: number;
    }>;
}
