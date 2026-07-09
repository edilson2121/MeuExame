import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.content.create({
      data: {
        title: data.name,
        body: data.description || '',
        userId: 'admin',
      },
    });
  }

  async findAll() {
    return this.prisma.content.findMany();
  }

  async findOne(id: string) {
    return this.prisma.content.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.content.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.content.delete({ where: { id } });
  }
}
