import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalInstitutions,
      totalDisciplines,
      totalExams,
      totalResults,
      publishedExams,
      draftExams,
    ] = await Promise.all([
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

    const monthlyData: Record<string, number> = {};
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Initialize all months
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
      monthlyData[key] = 0;
    }

    // Count results by month
    results.forEach((result) => {
      const date = new Date(result.createdAt);
      const key = `${months[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
      if (monthlyData[key] !== undefined) {
        monthlyData[key]++;
      }
    });

    // Convert to array and sort
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

    const methods: Record<string, number> = {
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

    if (results.length === 0) return 0;

    const total = results.reduce((sum, r) => sum + r.score, 0);
    return Math.round((total / results.length) * 100) / 100;
  }

  async logActivity(
    userId: string | null,
    action: string,
    entity: string,
    entityId?: string,
    details?: any,
    ipAddress?: string,
  ) {
    // Log to console - in production, you might want to store this
    console.log(`[Activity] ${action} on ${entity}${entityId ? ` (${entityId})` : ''} by user ${userId}`);
    return { success: true };
  }
}
