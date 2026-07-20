import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.institution.create({ data });
  }

  async findAll() {
    return this.prisma.institution.findMany();
  }

  async findOne(id: string) {
    return this.prisma.institution.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.institution.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.institution.delete({ where: { id } });
  }
}
