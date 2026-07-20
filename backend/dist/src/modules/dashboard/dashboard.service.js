"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [totalUsers, totalInstitutions, totalDisciplines, totalExams, totalResults, publishedExams, draftExams,] = await Promise.all([
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.institution.count({ where: { isActive: true } }),
            this.prisma.subject.count(),
            this.prisma.exam.count(),
            this.prisma.result.count(),
            this.prisma.exam.count({ where: { status: 'PUBLISHED' } }),
            this.prisma.exam.count({ where: { status: 'DRAFT' } }),
        ]);
        return {
            totalUsers,
            totalInstitutions,
            totalDisciplines,
            totalExams,
            totalResults,
            publishedExams,
            draftExams,
        };
    }
    async getExamsByMonth() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const results = await this.prisma.result.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
            },
            select: {
                createdAt: true,
            },
        });
        const monthlyData = {};
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const key = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
            monthlyData[key] = 0;
        }
        results.forEach((result) => {
            const date = new Date(result.createdAt);
            const key = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
            if (monthlyData[key] !== undefined) {
                monthlyData[key]++;
            }
        });
        return Object.entries(monthlyData)
            .map(([month, count]) => ({ month, count }))
            .reverse();
    }
    async getUsersByInstitution() {
        const institutions = await this.prisma.institution.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });
        return institutions.map((inst) => ({
            name: inst.name,
            count: inst._count.users,
        }));
    }
    async getRevenueByMethod() {
        const payments = await this.prisma.payment.findMany({
            where: {
                status: 'APPROVED',
            },
            select: {
                paymentMethod: true,
                amount: true,
            },
        });
        const methods = {
            MPESA: 0,
            EMOLA: 0,
            BANK: 0,
            CASH: 0,
        };
        payments.forEach((payment) => {
            if (payment.paymentMethod && methods[payment.paymentMethod] !== undefined) {
                methods[payment.paymentMethod] += payment.amount;
            }
        });
        return Object.entries(methods)
            .filter(([_, value]) => value > 0)
            .map(([method, amount]) => ({ method, amount }));
    }
    async getAccessTypeDistribution() {
        const [free, paid] = await Promise.all([
            this.prisma.examAccess.count({ where: { type: 'FREE' } }),
            this.prisma.examAccess.count({ where: { type: 'PAID' } }),
        ]);
        return [
            { type: 'Grátis', count: free, color: '#006800' },
            { type: 'Pago', count: paid, color: '#D21034' },
        ];
    }
    async getRecentActivity() {
        const activities = await this.prisma.result.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                exam: { select: { title: true } },
            },
        });
        return activities.map((a) => ({
            id: a.id,
            userName: a.user?.name || 'Unknown',
            action: 'Completou',
            entity: a.exam?.title || 'Exame',
            createdAt: a.createdAt,
        }));
    }
    async getExamStats() {
        const [published, draft, archived] = await Promise.all([
            this.prisma.exam.count({ where: { status: 'PUBLISHED' } }),
            this.prisma.exam.count({ where: { status: 'DRAFT' } }),
            this.prisma.exam.count({ where: { status: 'ARCHIVED' } }),
        ]);
        return [
            { status: 'PUBLISHED', count: published },
            { status: 'DRAFT', count: draft },
            { status: 'ARCHIVED', count: archived },
        ];
    }
    async getAverageScore() {
        const results = await this.prisma.result.findMany({
            select: { score: true },
        });
        if (results.length === 0)
            return 0;
        const total = results.reduce((sum, r) => sum + r.score, 0);
        return Math.round((total / results.length) * 100) / 100;
    }
    async logActivity(userId, action, entity, entityId, details, ipAddress) {
        console.log(`[Activity] ${action} on ${entity}${entityId ? ` (${entityId})` : ''} by user ${userId}`);
        return { success: true };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map