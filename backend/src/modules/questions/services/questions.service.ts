import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Question } from '@prisma/client';
import { IQuestionService } from '../interfaces/question.interface';

@Injectable()
export class QuestionsService implements IQuestionService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: any): Promise<Question> {
    return this.prisma.question.create({
      data: createQuestionDto,
    });
  }

  async findAll(): Promise<Question[]> {
    return this.prisma.question.findMany({
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        exercise: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada');
    }

    return question;
  }

  async update(id: string, updateQuestionDto: any): Promise<Question> {
    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  async remove(id: string): Promise<Question> {
    return this.prisma.question.delete({
      where: { id },
    });
  }

  async findByExercise(exerciseId: string): Promise<Question[]> {
    return this.prisma.question.findMany({
      where: { exerciseId },
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByType(type: string): Promise<Question[]> {
    return this.prisma.question.findMany({
      where: { type: type as any },
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
