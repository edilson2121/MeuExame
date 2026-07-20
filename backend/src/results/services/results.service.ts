import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.result.findMany({
      where: { userId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByExam(examId: string) {
    return this.prisma.result.findMany({
      where: { examId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.result.findUnique({
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
      },
    });

    if (!result) throw new NotFoundException('Resultado não encontrado');
    return result;
  }
}
