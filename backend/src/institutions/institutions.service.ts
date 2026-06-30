import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string; address?: string; phone?: string; email?: string; website?: string }) {
    return this.prisma.institution.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.institution.findMany({
      include: {
        _count: {
          select: { users: true, courses: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        users: true,
        courses: {
          include: {
            subjects: true,
          },
        },
      },
    });

    if (!institution) {
      throw new NotFoundException('Instituição não encontrada');
    }

    return institution;
  }

  async update(id: string, data: { name?: string; description?: string; address?: string; phone?: string; email?: string; website?: string }) {
    const institution = await this.prisma.institution.findUnique({ where: { id } });

    if (!institution) {
      throw new NotFoundException('Instituição não encontrada');
    }

    return this.prisma.institution.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const institution = await this.prisma.institution.findUnique({ where: { id } });

    if (!institution) {
      throw new NotFoundException('Instituição não encontrada');
    }

    return this.prisma.institution.delete({
      where: { id },
    });
  }
}