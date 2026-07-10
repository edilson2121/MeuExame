import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string }) {
    return this.prisma.course.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        subjects: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        subjects: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  async update(id: string, data: { name?: string }) {
    await this.findOne(id);
    return this.prisma.course.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
