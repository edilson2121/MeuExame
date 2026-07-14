import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        institution: true,
        subjects: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByInstitution(institutionId: string) {
    return this.prisma.course.findMany({
      where: { institutionId },
      include: {
        subjects: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        institution: true,
        subjects: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    await this.ensureInstitutionExists(createCourseDto.institutionId);

    return this.prisma.course.create({
      data: createCourseDto,
      include: { institution: true },
    });
  }

  async update(id: string, updateCourseDto: Partial<CreateCourseDto>) {
    await this.findOne(id);
    await this.ensureInstitutionExists(updateCourseDto.institutionId);

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: { institution: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.course.delete({
      where: { id },
    });
  }

  private async ensureInstitutionExists(institutionId?: string) {
    if (!institutionId) {
      return;
    }

    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      throw new BadRequestException('Instituição não encontrada');
    }
  }
}
