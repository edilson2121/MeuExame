import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ManualsService {
  constructor(private prisma: PrismaService) {}

  async create(subjectId: string, data: any) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return this.prisma.manual.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType || 'application/pdf',
        subjectId,
      },
      include: {
        subject: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.manual.findMany({
      include: {
        subject: {
          select: { id: true, name: true, institutionId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySubject(subjectId: string) {
    return this.prisma.manual.findMany({
      where: {
        subjectId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const manual = await this.prisma.manual.findUnique({
      where: { id },
      include: {
        subject: {
          select: { id: true, name: true },
        },
      },
    });

    if (!manual) {
      throw new NotFoundException('Manual não encontrado');
    }

    return manual;
  }

  async update(id: string, data: any) {
    const manual = await this.prisma.manual.findUnique({ where: { id } });
    if (!manual) {
      throw new NotFoundException('Manual não encontrado');
    }

    return this.prisma.manual.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        isActive: data.isActive,
      },
    });
  }

  async delete(id: string) {
    const manual = await this.prisma.manual.findUnique({ where: { id } });
    if (!manual) {
      throw new NotFoundException('Manual não encontrado');
    }

    return this.prisma.manual.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const manual = await this.prisma.manual.findUnique({ where: { id } });
    if (!manual) {
      throw new NotFoundException('Manual não encontrado');
    }

    return this.prisma.manual.update({
      where: { id },
      data: { isActive: !manual.isActive },
    });
  }
}
