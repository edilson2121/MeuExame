import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  // =============================================
  // ADMIN: GET ALL USERS
  // =============================================
  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            plan: true,
            status: true,
            startDate: true,
            endDate: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // =============================================
  // ADMIN: GET USER BY ID
  // =============================================
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        institution: true,
        subscriptions: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // =============================================
  // ADMIN: UPDATE USER ROLE
  // =============================================
  @Put('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body() body: { role: Role }) {
    return this.prisma.user.update({
      where: { id },
      data: { role: body.role },
    });
  }

  // =============================================
  // ADMIN: GET ALL INSTITUTIONS
  // =============================================
  @Get('institutions')
  async getAllInstitutions() {
    return this.prisma.institution.findMany({
      include: {
        _count: {
          select: {
            users: true,
            subjects: true,
            materials: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // =============================================
  // ADMIN: CREATE INSTITUTION
  // =============================================
  @Post('institutions')
  async createInstitution(@Body() body: { name: string; description?: string; city?: string }) {
    return this.prisma.institution.create({
      data: {
        name: body.name,
        description: body.description,
        city: body.city,
        country: 'Moçambique',
      },
    });
  }

  // =============================================
  // ADMIN: UPDATE INSTITUTION
  // =============================================
  @Put('institutions/:id')
  async updateInstitution(@Param('id') id: string, @Body() body: any) {
    return this.prisma.institution.update({
      where: { id },
      data: body,
    });
  }

  // =============================================
  // ADMIN: DELETE INSTITUTION
  // =============================================
  @Delete('institutions/:id')
  async deleteInstitution(@Param('id') id: string) {
    return this.prisma.institution.delete({
      where: { id },
    });
  }

  // =============================================
  // ADMIN: GET ALL SUBJECTS
  // =============================================
  @Get('subjects')
  async getAllSubjects() {
    return this.prisma.subject.findMany({
      include: {
        institution: true,
        _count: {
          select: {
            materials: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // =============================================
  // ADMIN: CREATE SUBJECT
  // =============================================
  @Post('subjects')
  async createSubject(@Body() body: { name: string; description?: string; institutionId: string }) {
    return this.prisma.subject.create({
      data: {
        name: body.name,
        description: body.description,
        institutionId: body.institutionId,
      },
    });
  }

  // =============================================
  // ADMIN: UPDATE SUBJECT
  // =============================================
  @Put('subjects/:id')
  async updateSubject(@Param('id') id: string, @Body() body: any) {
    return this.prisma.subject.update({
      where: { id },
      data: body,
    });
  }

  // =============================================
  // ADMIN: DELETE SUBJECT
  // =============================================
  @Delete('subjects/:id')
  async deleteSubject(@Param('id') id: string) {
    return this.prisma.subject.delete({
      where: { id },
    });
  }

  // =============================================
  // ADMIN: GET ALL MATERIALS
  // =============================================
  @Get('materials')
  async getAllMaterials() {
    return this.prisma.educationalMaterial.findMany({
      include: {
        subject: {
          include: {
            institution: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            questions: true,
            results: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // =============================================
  // ADMIN: GET DASHBOARD STATS
  // =============================================
  @Get('dashboard')
  async getDashboardStats() {
    const [
      totalUsers,
      totalInstitutions,
      totalSubjects,
      totalMaterials,
      totalPayments,
      activeSubscriptions,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.institution.count(),
      this.prisma.subject.count(),
      this.prisma.educationalMaterial.count(),
      this.prisma.paymentTransaction.count(),
      this.prisma.subscription.count({ where: { isActive: true } }),
    ]);

    const recentPayments = await this.prisma.paymentTransaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      totalUsers,
      totalInstitutions,
      totalSubjects,
      totalMaterials,
      totalPayments,
      activeSubscriptions,
      recentPayments,
    };
  }

  // =============================================
  // ADMIN: GET ALL PAGES
  // =============================================
  @Get('pages')
  async getAllPages() {
    return this.prisma.institutionPage.findMany({
      include: {
        institution: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // =============================================
  // ADMIN: CREATE PAGE
  // =============================================
  @Post('pages')
  async createPage(@Body() body: any) {
    return this.prisma.institutionPage.create({
      data: {
        institutionId: body.institutionId,
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        layoutId: body.layoutId || 'default',
        settings: body.settings || {},
        status: body.status || 'DRAFT',
        showInMenu: body.showInMenu || false,
        menuOrder: body.menuOrder || 0,
      },
    });
  }

  // =============================================
  // ADMIN: UPDATE PAGE
  // =============================================
  @Put('pages/:id')
  async updatePage(@Param('id') id: string, @Body() body: any) {
    return this.prisma.institutionPage.update({
      where: { id },
      data: body,
    });
  }

  // =============================================
  // ADMIN: DELETE PAGE
  // =============================================
  @Delete('pages/:id')
  async deletePage(@Param('id') id: string) {
    return this.prisma.institutionPage.delete({
      where: { id },
    });
  }

  // =============================================
  // ADMIN: PUBLISH PAGE
  // =============================================
  @Put('pages/:id/publish')
  async publishPage(@Param('id') id: string) {
    return this.prisma.institutionPage.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }
}
