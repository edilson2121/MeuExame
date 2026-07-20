import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem criar páginas');
    }

    const existingPage = await this.prisma.page.findUnique({
      where: { slug: createPageDto.slug },
    });

    if (existingPage) {
      throw new NotFoundException('Slug já está em uso');
    }

    const pageData: any = {
      title: createPageDto.title,
      slug: createPageDto.slug,
      content: createPageDto.content,
      description: createPageDto.description,
      keywords: createPageDto.keywords,
      template: createPageDto.template || 'default',
      showInMenu: createPageDto.showInMenu || false,
      menuOrder: createPageDto.menuOrder || 0,
      status: createPageDto.status || 'DRAFT',
      authorId: userId,
    };

    if (createPageDto.status === 'PUBLISHED') {
      pageData.publishedAt = new Date();
    }

    const page = await this.prisma.page.create({
      data: pageData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return page;
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem listar todas as páginas');
    }

    return this.prisma.page.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAdmin(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem visualizar esta página');
    }

    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem atualizar páginas');
    }

    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    if (updatePageDto.slug && updatePageDto.slug !== page.slug) {
      const existingPage = await this.prisma.page.findUnique({
        where: { slug: updatePageDto.slug },
      });

      if (existingPage) {
        throw new NotFoundException('Slug já está em uso');
      }
    }

    const updateData: any = {
      title: updatePageDto.title,
      slug: updatePageDto.slug,
      content: updatePageDto.content,
      description: updatePageDto.description,
      keywords: updatePageDto.keywords,
      template: updatePageDto.template,
      showInMenu: updatePageDto.showInMenu,
      menuOrder: updatePageDto.menuOrder,
      status: updatePageDto.status,
    };

    if (updatePageDto.status === 'PUBLISHED' && page.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    return this.prisma.page.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async publish(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem publicar páginas');
    }

    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }

  async archive(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem arquivar páginas');
    }

    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem remover páginas');
    }

    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    return this.prisma.page.delete({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada ou não publicada');
    }

    return page;
  }

  // TEMPORÁRIO: Retornando array vazio
  async findPublishedMenu() {
    console.warn('findPublishedMenu: Retornando array vazio temporariamente');
    return [];
  }

  async findPublished() {
    return this.prisma.page.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        publishedAt: true,
        user: {
          select: { name: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }
}
