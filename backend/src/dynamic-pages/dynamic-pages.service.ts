import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateDynamicPageDto } from './dto/create-dynamic-page.dto';
import { UpdateDynamicPageDto } from './dto/update-dynamic-page.dto';

@Injectable()
export class DynamicPagesService {
  constructor(private prisma: PrismaService) {}

  async create(createDynamicPageDto: CreateDynamicPageDto) {
    return this.prisma.dynamicPage.create({
      data: createDynamicPageDto,
    });
  }

  async findAll() {
    return this.prisma.dynamicPage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    return this.prisma.dynamicPage.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.dynamicPage.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    if (!page.isPublished) {
      throw new NotFoundException('Página não publicada');
    }

    return page;
  }

  async findOne(id: string) {
    const page = await this.prisma.dynamicPage.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    return page;
  }

  async update(id: string, updateDynamicPageDto: UpdateDynamicPageDto) {
    const page = await this.findOne(id);
    return this.prisma.dynamicPage.update({
      where: { id },
      data: updateDynamicPageDto,
    });
  }

  async remove(id: string) {
    const page = await this.findOne(id);
    return this.prisma.dynamicPage.delete({
      where: { id },
    });
  }
}
