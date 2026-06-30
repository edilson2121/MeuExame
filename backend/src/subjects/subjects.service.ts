import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string; courseId: string }) {
    return this.prisma.subject.create({
      data,
      include: {
        course: {
          include: {
            institution: true,
          },
        },
      },
    });
  }

  async findAll() {
    const subjects = await this.prisma.subject.findMany({
      include: {
        course: {
          include: {
            institution: true,
          },
        },
      },
    });

    // Adicionar contagem manualmente
    return subjects.map(subject => ({
      ...subject,
      _count: {
        contents: 0, // Será implementado depois
        exercises: 0,
        exams: 0,
      },
    }));
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            institution: true,
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return subject;
  }

  async update(id: string, data: { name?: string; description?: string; courseId?: string }) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });

    if (!subject) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return this.prisma.subject.update({
      where: { id },
      data,
      include: {
        course: {
          include: {
            institution: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });

    if (!subject) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return this.prisma.subject.delete({ where: { id } });
  }
}