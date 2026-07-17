import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    return this.prisma.exam.create({
      data: createExamDto,
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

  async findAll() {
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySubject(subjectId: string) {
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByInstitution(institutionId: string) {
    const subjects = await this.prisma.subject.findMany({
      where: { institutionId },
    });

    const subjectIds = subjects.map(s => s.id);
    return this.prisma.exam.findMany({
      where: { subjectId: { in: subjectIds } },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
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
      },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado');
    }

    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto) {
    const exam = await this.findOne(id);
    return this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
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

  async remove(id: string) {
    const exam = await this.findOne(id);
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async validateAnswers(examId: string, userAnswers: any) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examQuestions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado');
    }

    const questions = exam.examQuestions.map(eq => eq.question);
    
    let correctCount = 0;
    const results = [];

    for (const question of questions) {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      });
    }

    const score = (correctCount / questions.length) * 100;

    return {
      score,
      correctCount,
      totalQuestions: questions.length,
      results,
    };
  }
}
