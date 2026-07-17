import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByInstitution(institutionId: string) {
    return this.prisma.subject.findMany({
      where: { institutionId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return subject;
  }

  async create(name: string, institutionId?: string) {
    return this.prisma.subject.create({
      data: {
        name,
        institutionId,
      },
    });
  }

  async update(id: string, name: string, institutionId?: string) {
    await this.findOne(id);

    return this.prisma.subject.update({
      where: { id },
      data: {
        name,
        institutionId,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
