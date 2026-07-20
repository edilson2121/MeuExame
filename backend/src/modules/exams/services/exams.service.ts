import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Exam, ExamStatus } from '@prisma/client';
import { IExamService } from '../interfaces/exam.interface';

@Injectable()
export class ExamsService implements IExamService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: any): Promise<Exam> {
    return this.prisma.exam.create({
      data: {
        ...createExamDto,
        examDate: createExamDto.examDate ? new Date(createExamDto.examDate) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
    });
  }

  async findAll(): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
        examQuestions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
        examQuestions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado');
    }

    return exam;
  }

  async update(id: string, updateExamDto: any): Promise<Exam> {
    const exam = await this.findOne(id);

    if (exam.status === ExamStatus.PUBLISHED) {
      throw new BadRequestException('Não é possível editar um exame publicado');
    }

    return this.prisma.exam.update({
      where: { id },
      data: {
        ...updateExamDto,
        examDate: updateExamDto.examDate ? new Date(updateExamDto.examDate) : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
    });
  }

  async remove(id: string): Promise<Exam> {
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async findBySubject(subjectId: string): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      where: { subjectId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAuthor(authorId: string): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addQuestion(examId: string, questionId: string, order: number, points: number): Promise<void> {
    const exam = await this.findOne(examId);

    if (exam.status === ExamStatus.PUBLISHED) {
      throw new BadRequestException('Não é possível adicionar questões a um exame publicado');
    }

    await this.prisma.examQuestion.create({
      data: {
        examId,
        questionId,
        order,
        points,
      },
    });

    // Update total points
    const examQuestions = await this.prisma.examQuestion.findMany({
      where: { examId },
    });

    const totalPoints = examQuestions.reduce((sum, eq) => sum + eq.points, 0);

    await this.prisma.exam.update({
      where: { id: examId },
      data: { totalPoints },
    });
  }

  async removeQuestion(examId: string, questionId: string): Promise<void> {
    const exam = await this.findOne(examId);

    if (exam.status === ExamStatus.PUBLISHED) {
      throw new BadRequestException('Não é possível remover questões de um exame publicado');
    }

    await this.prisma.examQuestion.deleteMany({
      where: {
        examId,
        questionId,
      },
    });

    // Update total points
    const examQuestions = await this.prisma.examQuestion.findMany({
      where: { examId },
    });

    const totalPoints = examQuestions.reduce((sum, eq) => sum + eq.points, 0);

    await this.prisma.exam.update({
      where: { id: examId },
      data: { totalPoints },
    });
  }

  async publishExam(id: string): Promise<Exam> {
    const exam = await this.findOne(id);

    const examQuestions = await this.prisma.examQuestion.findMany({
      where: { examId: id },
    });

    if (examQuestions.length === 0) {
      throw new BadRequestException('Não é possível publicar um exame sem questões');
    }

    return this.prisma.exam.update({
      where: { id },
      data: { status: ExamStatus.PUBLISHED },
    });
  }
}
