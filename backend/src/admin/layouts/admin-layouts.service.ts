import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateLayoutTemplateDto, UpdateLayoutTemplateDto } from './dto/layout-template.dto';

@Injectable()
export class AdminLayoutsService {
  constructor(private prisma: PrismaService) {}

  async createLayout(dto: CreateLayoutTemplateDto) {
    // Check if layout name already exists
    const existing = await this.prisma.layoutTemplate.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Já existe um layout com este nome');
    }

    return this.prisma.layoutTemplate.create({
      data: {
        name: dto.name,
        description: dto.description,
        html: dto.html,
        css: dto.css,
        thumbnail: dto.thumbnail,
        config: dto.config,
      },
    });
  }

  async updateLayout(layoutId: string, dto: UpdateLayoutTemplateDto) {
    const layout = await this.prisma.layoutTemplate.findUnique({
      where: { id: layoutId },
    });

    if (!layout) {
      throw new NotFoundException('Layout não encontrado');
    }

    // Check name uniqueness if being changed
    if (dto.name && dto.name !== layout.name) {
      const existing = await this.prisma.layoutTemplate.findUnique({
        where: { name: dto.name },
      });

      if (existing) {
        throw new BadRequestException('Já existe um layout com este nome');
      }
    }

    return this.prisma.layoutTemplate.update({
      where: { id: layoutId },
      data: {
        name: dto.name,
        description: dto.description,
        html: dto.html,
        css: dto.css,
        thumbnail: dto.thumbnail,
        config: dto.config,
        isActive: dto.isActive,
      },
    });
  }

  async getLayoutById(layoutId: string) {
    const layout = await this.prisma.layoutTemplate.findUnique({
      where: { id: layoutId },
    });

    if (!layout) {
      throw new NotFoundException('Layout não encontrado');
    }

    return layout;
  }

  async getAllLayouts(onlyActive = false) {
    return this.prisma.layoutTemplate.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteLayout(layoutId: string) {
    const layout = await this.prisma.layoutTemplate.findUnique({
      where: { id: layoutId },
      include: { institutionPages: true },
    });

    if (!layout) {
      throw new NotFoundException('Layout não encontrado');
    }

    if (layout.institutionPages && layout.institutionPages.length > 0) {
      throw new BadRequestException(
        'Não é possível deletar um layout que está sendo utilizado por páginas',
      );
    }

    return this.prisma.layoutTemplate.delete({
      where: { id: layoutId },
    });
  }
}
