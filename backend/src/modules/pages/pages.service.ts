import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async createPage(userId: string, data: CreatePageDto) {
    const slug = data.slug || this.generateSlug(data.title);
    const payload: any = {
      title: data.title,
      slug: slug,
      content: data.content || '',
      description: data.description,
      keywords: data.keywords,
      showInMenu: data.showInMenu || false,
      status: data.status ? (data.status as string).toUpperCase() : 'DRAFT',
      authorId: userId,
    };

    return this.prisma.page.create({ data: payload });
  }

  async findAll() {
    return this.prisma.page.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.page.findUnique({
      where: { id },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.page.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: { sections: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    });
  }

  async update(id: string, data: Partial<CreatePageDto>) {
    const payload: any = { ...data };
    if (payload.status) payload.status = (payload.status as string).toUpperCase();
    return this.prisma.page.update({ where: { id }, data: payload });
  }

  async delete(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }

  async publish(id: string) {
    return this.prisma.page.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() } as any,
    });
  }

  async getMenuPages() {
    return this.prisma.page.findMany({
      where: { status: 'PUBLISHED', showInMenu: true },
      select: { id: true, title: true, slug: true, menuOrder: true },
      orderBy: { menuOrder: 'asc' },
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
