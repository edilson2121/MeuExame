import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: createSubjectDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return this.prisma.subject.create({
      data: {
        name: createSubjectDto.name,
        courseId: createSubjectDto.courseId,
      },
    });
  }

  async findAll() {
    return this.prisma.subject.findMany({
      include: {
        course: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return subject;
  }

  async findByCourse(courseId: string) {
    return this.prisma.subject.findMany({
      where: { courseId },
      include: {
        course: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(id);

    if (updateSubjectDto.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: updateSubjectDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Curso não encontrado');
      }
    }

    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
