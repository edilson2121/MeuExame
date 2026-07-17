import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('pages')
export class PagesController {
  constructor(private prisma: PrismaService) {}

  @Get(':slug')
  async getPageBySlug(@Param('slug') slug: string) {
    const page = await this.prisma.institutionPage.findUnique({
      where: { slug },
      include: {
        institution: true,
      },
    });

    if (!page) {
      throw new Error('Página não encontrada');
    }

    // Only return published pages
    if (page.status !== 'PUBLISHED') {
      throw new Error('Página não disponível');
    }

    return page;
  }

  @Get()
  async getPublishedPages() {
    return this.prisma.institutionPage.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        institution: true,
      },
      orderBy: {
        menuOrder: 'asc',
      },
    });
  }
}
