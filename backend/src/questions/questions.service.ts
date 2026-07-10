import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: createQuestionDto.exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercício não encontrado');
    }

    return this.prisma.question.create({
      data: {
        text: createQuestionDto.text,
        exerciseId: createQuestionDto.exerciseId,
      },
    });
  }

  async findAll() {
    return this.prisma.question.findMany({
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        exercise: {
          include: {
            content: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    return question;
  }

  async findByExercise(exerciseId: string) {
    return this.prisma.question.findMany({
      where: { exerciseId },
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    await this.findOne(id);
    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
