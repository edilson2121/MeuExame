import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('charts/exams-monthly')
  async getExamsByMonth() {
    return this.dashboardService.getExamsByMonth();
  }

  @Get('charts/users-by-institution')
  async getUsersByInstitution() {
    return this.dashboardService.getUsersByInstitution();
  }

  @Get('charts/revenue-by-method')
  async getRevenueByMethod() {
    return this.dashboardService.getRevenueByMethod();
  }

  @Get('charts/access-type-distribution')
  async getAccessTypeDistribution() {
    return this.dashboardService.getAccessTypeDistribution();
  }

  @Get('recent-activity')
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }

  @Get('exam-stats')
  async getExamStats() {
    return this.dashboardService.getExamStats();
  }

  @Get('average-score')
  async getAverageScore() {
    return { score: await this.dashboardService.getAverageScore() };
  }
}
