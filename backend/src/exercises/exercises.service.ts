import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(createExerciseDto: CreateExerciseDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createExerciseDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const content = await this.prisma.content.findUnique({
      where: { id: createExerciseDto.contentId },
    });

    if (!content) {
      throw new NotFoundException('Conteúdo não encontrado');
    }

    return this.prisma.exercise.create({
      data: {
        title: createExerciseDto.title,
        body: createExerciseDto.body,
        userId: createExerciseDto.userId,
        contentId: createExerciseDto.contentId,
      },
    });
  }

  async findAll() {
    return this.prisma.exercise.findMany({
      include: {
        user: true,
        content: true,
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        user: true,
        content: true,
        questions: true,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Exercício não encontrado');
    }

    return exercise;
  }

  async findByContent(contentId: string) {
    return this.prisma.exercise.findMany({
      where: { contentId },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    await this.findOne(id);

    if (updateExerciseDto.contentId) {
      const content = await this.prisma.content.findUnique({
        where: { id: updateExerciseDto.contentId },
      });

      if (!content) {
        throw new NotFoundException('Conteúdo não encontrado');
      }
    }

    return this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.exercise.delete({
      where: { id },
    });
  }
}
