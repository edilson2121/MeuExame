import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('stats')
export class StatsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getStats() {
    const [users, institutions, courses, subjects] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.institution.count(),
      this.prisma.course.count(),
      this.prisma.subject.count(),
    ]);

    return { users, institutions, courses, subjects };
  }
}
