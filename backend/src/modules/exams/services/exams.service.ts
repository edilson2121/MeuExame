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

  async findOne(id: string, userId?: string): Promise<any> {
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

    // Transformar as questões para o formato esperado pelo frontend
    const questions = exam.examQuestions.map((eq) => {
      const question = eq.question;
      let options: { id: number; text: string; isCorrect: boolean }[] = [];
      
      // Parse options if it's a JSON string
      if (typeof question.options === 'string') {
        try {
          options = JSON.parse(question.options);
        } catch (e) {
          options = [];
        }
      } else if (Array.isArray(question.options)) {
        options = question.options;
      }

      return {
        id: question.id,
        text: question.text,
        type: question.type,
        imageUrl: question.imageUrl,
        options,
        explanation: question.explanation,
      };
    });

    // Verificar acesso
    let hasAccess = true;
    if (userId) {
      // Verificar se o exame é pago
      const access = await this.checkExamAccess(id, userId);
      hasAccess = access.hasAccess;
    }

    return {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      status: exam.status,
      imageUrl: exam.imageUrl,
      hasAccess,
      subject: exam.subject,
      author: exam.author,
      questions,
    };
  }

  async checkExamAccess(examId: string, userId: string): Promise<{ hasAccess: boolean; accessType?: string }> {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado');
    }

    // Se for um exame gratuito, tem acesso
    if (!exam.price || exam.price === 0) {
      return { hasAccess: true, accessType: 'FREE' };
    }

    // Verificar se tem acesso através de ExamAccess
    const examAccess = await this.prisma.examAccess.findFirst({
      where: {
        examId,
        userId,
      },
    });

    if (examAccess) {
      return { hasAccess: true, accessType: examAccess.type };
    }

    // Verificar se tem subscrição ativa
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (subscription) {
      return { hasAccess: true, accessType: 'SUBSCRIPTION' };
    }

    // Verificar se o utilizador tem acesso total
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.hasFullAccess) {
      return { hasAccess: true, accessType: 'FULL_ACCESS' };
    }

    return { hasAccess: false };
  }

  async submitExam(
    examId: string,
    userId: string,
    answers: { questionId: string; selectedOption: number }[],
  ): Promise<{ score: number; total: number; percentage: number }> {
    const exam = await this.findOne(examId);

    // Verificar acesso
    const access = await this.checkExamAccess(examId, userId);
    if (!access.hasAccess) {
      throw new BadRequestException('Não tem acesso a este exame');
    }

    let correct = 0;
    let total = 0;

    // Calcular pontuação
    for (const answer of answers) {
      const question = exam.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      total++;
      const correctOptionIndex = question.options.findIndex((o: any) => o.isCorrect);

      if (correctOptionIndex === answer.selectedOption) {
        correct++;
      }
    }

    // Criar resultado
    await this.prisma.result.create({
      data: {
        score: correct,
        userId,
        examId,
        answers: answers as any,
      },
    });

    return {
      score: correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }
}
