import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async create(createContentDto: CreateContentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createContentDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.content.create({
      data: {
        title: createContentDto.title,
        body: createContentDto.body,
        userId: createContentDto.userId,
      },
    });
  }

  async findAll() {
    return this.prisma.content.findMany({
      include: {
        user: true,
        exercises: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        user: true,
        exercises: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!content) {
      throw new NotFoundException('Conteúdo não encontrado');
    }

    return content;
  }

  async findByUser(userId: string) {
    return this.prisma.content.findMany({
      where: { userId },
      include: {
        exercises: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    await this.findOne(id);
    return this.prisma.content.update({
      where: { id },
      data: updateContentDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.content.delete({
      where: { id },
    });
  }
}
