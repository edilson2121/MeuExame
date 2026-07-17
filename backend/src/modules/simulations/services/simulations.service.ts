import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ExamSimulation, SimulationStatus } from '@prisma/client';
import { ISimulationService } from '../interfaces/simulation.interface';

@Injectable()
export class SimulationsService implements ISimulationService {
  constructor(private prisma: PrismaService) {}

  async create(createSimulationDto: any): Promise<ExamSimulation> {
    return this.prisma.examSimulation.create({
      data: createSimulationDto,
      include: {
        exam: {
          include: {
            examQuestions: {
              include: {
                question: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<ExamSimulation[]> {
    return this.prisma.examSimulation.findMany({
      include: {
        exam: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<ExamSimulation> {
    const simulation = await this.prisma.examSimulation.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            examQuestions: {
              include: {
                question: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!simulation) {
      throw new NotFoundException('Simulação não encontrada');
    }

    return simulation;
  }

  async update(id: string, updateSimulationDto: any): Promise<ExamSimulation> {
    return this.prisma.examSimulation.update({
      where: { id },
      data: updateSimulationDto,
    });
  }

  async remove(id: string): Promise<ExamSimulation> {
    return this.prisma.examSimulation.delete({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<ExamSimulation[]> {
    return this.prisma.examSimulation.findMany({
      where: { userId },
      include: {
        exam: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByExam(examId: string): Promise<ExamSimulation[]> {
    return this.prisma.examSimulation.findMany({
      where: { examId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async startSimulation(examId: string, userId: string): Promise<ExamSimulation> {
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

    if (exam.status !== 'PUBLISHED') {
      throw new BadRequestException('Exame não está publicado');
    }

    // Check user subscription
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    const hasActiveSubscription = user?.subscription?.isActive && 
      new Date(user.subscription.endDate) > new Date();

    // Check if user already has an in-progress simulation
    const existingSimulation = await this.prisma.examSimulation.findFirst({
      where: {
        examId,
        userId,
        status: SimulationStatus.IN_PROGRESS,
      },
    });

    if (existingSimulation) {
      return existingSimulation;
    }

    const simulation = await this.prisma.examSimulation.create({
      data: {
        examId,
        userId,
        status: SimulationStatus.IN_PROGRESS,
        duration: exam.duration,
      },
      include: {
        exam: {
          include: {
            examQuestions: {
              include: {
                question: true,
              },
            },
          },
        },
      },
    });

    // If user doesn't have active subscription, limit to first 3 questions
    if (!hasActiveSubscription && exam.examQuestions.length > 3) {
      simulation.exam.examQuestions = exam.examQuestions.slice(0, 3);
    }

    return simulation;
  }

  async completeSimulation(id: string, answers: any): Promise<ExamSimulation> {
    const simulation = await this.findOne(id);

    if (simulation.status !== SimulationStatus.IN_PROGRESS) {
      throw new BadRequestException('Simulação já foi concluída');
    }

    const score = await this.calculateScore(id);

    return this.prisma.examSimulation.update({
      where: { id },
      data: {
        answers,
        score,
        status: SimulationStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  async calculateScore(id: string): Promise<number> {
    const simulation = await this.prisma.examSimulation.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            examQuestions: {
              include: {
                question: true,
              },
            },
          },
        },
        user: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!simulation) {
      throw new NotFoundException('Simulação não encontrada');
    }

    const hasActiveSubscription = simulation.user?.subscription?.isActive && 
      new Date(simulation.user.subscription.endDate) > new Date();

    let correctAnswers = 0;
    let totalPoints = 0;
    let questionsToEvaluate = simulation.exam.examQuestions;

    // If user doesn't have active subscription, only evaluate first 3 questions
    if (!hasActiveSubscription && questionsToEvaluate.length > 3) {
      questionsToEvaluate = questionsToEvaluate.slice(0, 3);
    }

    for (const examQuestion of questionsToEvaluate) {
      totalPoints += examQuestion.points;

      const userAnswer = simulation.answers?.[examQuestion.questionId];
      if (userAnswer === examQuestion.question.correctAnswer) {
        correctAnswers += examQuestion.points;
      }
    }

    return totalPoints > 0 ? (correctAnswers / totalPoints) * 100 : 0;
  }
}
