import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: createSubjectDto,
      include: {
        course: true,
      },
    });
  }

  async findAll() {
    return this.prisma.subject.findMany({
      include: {
        course: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByInstitution(institutionId: string) {
    return this.prisma.subject.findMany({
      where: { institutionId },
      include: {
        course: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.subject.findMany({
      where: { courseId },
      include: {
        course: true,
      },
      orderBy: { name: 'asc' },
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

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.findOne(id);
    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
      include: {
        course: true,
      },
    });
  }

  async remove(id: string) {
    const subject = await this.findOne(id);
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
