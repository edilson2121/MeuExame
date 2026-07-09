import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class PublicPagesService {
  constructor(private prisma: PrismaService) {}

  async getPublishedPagesByInstitution(institutionId: string) {
    return this.prisma.institutionPage.findMany({
      where: {
        institutionId,
        status: PublishStatus.PUBLISHED,
        isActive: true,
      },
      include: {
        layout: true,
        institution: true,
      },
      orderBy: { menuOrder: 'asc' },
    });
  }

  async getPublishedPageBySlug(slug: string, institutionId: string) {
    const page = await this.prisma.institutionPage.findUnique({
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

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    // Only return if published
    if (page.status !== PublishStatus.PUBLISHED || !page.isActive) {
      throw new NotFoundException('Página não encontrada');
    }

    return page;
  }

  async getPublicMenu(institutionId: string) {
    return this.prisma.institutionPage.findMany({
      where: {
        institutionId,
        status: PublishStatus.PUBLISHED,
        showInMenu: true,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        menuOrder: true,
      },
      orderBy: { menuOrder: 'asc' },
    });
  }
}
