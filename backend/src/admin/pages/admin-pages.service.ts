import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInstitutionPageDto, UpdateInstitutionPageDto, PublishInstitutionPageDto } from './dto/institution-page.dto';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class AdminPagesService {
  constructor(private prisma: PrismaService) {}

  async createPage(dto: CreateInstitutionPageDto) {
    // Verify institution exists
    const institution = await this.prisma.institution.findUnique({
      where: { id: dto.institutionId },
    });

    if (!institution) {
      throw new NotFoundException('Instituição não encontrada');
    }

    // Verify layout exists
    const layout = await this.prisma.layoutTemplate.findUnique({
      where: { id: dto.layoutId },
    });

    if (!layout) {
      throw new NotFoundException('Layout não encontrado');
    }

    // Check if slug is unique for this institution
    const existingPage = await this.prisma.institutionPage.findUnique({
      where: {
        institutionId_slug: {
          institutionId: dto.institutionId,
          slug: dto.slug,
        },
      },
    });

    if (existingPage) {
      throw new BadRequestException('Já existe uma página com este slug nesta instituição');
    }

    return this.prisma.institutionPage.create({
      data: {
        institutionId: dto.institutionId,
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        content: dto.content,
        layoutId: dto.layoutId,
        settings: dto.settings,
        showInMenu: dto.showInMenu ?? false,
        menuOrder: dto.menuOrder ?? 0,
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
      },
      include: {
        layout: true,
        institution: true,
      },
    });
  }

  async updatePage(pageId: string, dto: UpdateInstitutionPageDto) {
    const page = await this.prisma.institutionPage.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    // Check slug uniqueness if it's being changed
    if (dto.slug && dto.slug !== page.slug) {
      const existing = await this.prisma.institutionPage.findUnique({
        where: {
          institutionId_slug: {
            institutionId: page.institutionId,
            slug: dto.slug,
          },
        },
      });

      if (existing) {
        throw new BadRequestException('Já existe uma página com este slug nesta instituição');
      }
    }

    // Verify layout exists if layout is being changed
    if (dto.layoutId && dto.layoutId !== page.layoutId) {
      const layout = await this.prisma.layoutTemplate.findUnique({
        where: { id: dto.layoutId },
      });

      if (!layout) {
        throw new NotFoundException('Layout não encontrado');
      }
    }

    return this.prisma.institutionPage.update({
      where: { id: pageId },
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        content: dto.content,
        layoutId: dto.layoutId,
        settings: dto.settings,
        status: dto.status,
        showInMenu: dto.showInMenu,
        menuOrder: dto.menuOrder,
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
      },
      include: {
        layout: true,
        institution: true,
      },
    });
  }

  async publishPage(pageId: string, dto: PublishInstitutionPageDto) {
    const page = await this.prisma.institutionPage.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    const newStatus = dto.publish ? PublishStatus.PUBLISHED : PublishStatus.DRAFT;

    return this.prisma.institutionPage.update({
      where: { id: pageId },
      data: {
        status: newStatus,
        publishedAt: dto.publish ? new Date() : null,
      },
      include: {
        layout: true,
        institution: true,
      },
    });
  }

  async getPagesByInstitution(institutionId: string, onlyPublished = false) {
    const whereClause: any = { institutionId };

    if (onlyPublished) {
      whereClause.status = PublishStatus.PUBLISHED;
    }

    return this.prisma.institutionPage.findMany({
      where: whereClause,
      include: {
        layout: true,
        institution: true,
      },
      orderBy: { menuOrder: 'asc' },
    });
  }

  async getPageById(pageId: string) {
    const page = await this.prisma.institutionPage.findUnique({
      where: { id: pageId },
      include: {
        layout: true,
        institution: true,
      },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    return page;
  }

  async deletePage(pageId: string) {
    const page = await this.prisma.institutionPage.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    return this.prisma.institutionPage.delete({
      where: { id: pageId },
    });
  }

  async getPageBySlug(slug: string, institutionId: string) {
    return this.prisma.institutionPage.findUnique({
      where: {
        institutionId_slug: {
          institutionId,
          slug,
        },
      },
      include: {
        layout: true,
        institution: true,
      },
    });
  }
}
