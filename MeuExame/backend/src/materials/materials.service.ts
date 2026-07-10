import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto, SubmitExamDto } from './dto/material.dto';
import { MaterialType, AccessLevel, QuestionType } from '@prisma/client';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  // =============================================
  // ADMIN: CREATE MATERIAL
  // =============================================
  async createMaterial(adminId: string, dto: CreateMaterialDto) {
    // Verify admin exists
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' }
    });
    if (!admin) throw new ForbiddenException('Apenas administradores podem criar materiais');

    // Verify institution exists
    const institution = await this.prisma.institution.findUnique({
      where: { id: dto.institutionId }
    });
    if (!institution) throw new NotFoundException('Instituição não encontrada');

    // Verify subject exists and belongs to institution
    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId }
    });
    if (!subject) throw new NotFoundException('Disciplina não encontrada');
    
    if (subject.institutionId !== dto.institutionId) {
      throw new BadRequestException('Esta disciplina não pertence à instituição informada');
    }

    // Create material
    const material = await this.prisma.educationalMaterial.create({
      data: {
        title: dto.title,
        description: dto.description,
        content: dto.content,
        type: dto.type,
        accessLevel: dto.accessLevel || 'FREE',
        subjectId: dto.subjectId,
        institutionId: dto.institutionId,
        createdBy: adminId,
        duration: dto.duration,
        passingScore: dto.passingScore || 60,
        ...(dto.type === 'EXAM' && dto.questions ? {
          questions: {
            create: dto.questions.map((q, index) => ({
              text: q.text,
              type: q.type || 'MULTIPLE_CHOICE',
              options: q.options || [],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: index,
              points: q.points || 1
            }))
          }
        } : {})
      },
      include: {
        subject: true,
        institution: true,
        questions: true
      }
    });

    return material;
  }

  // =============================================
  // ADMIN: UPDATE MATERIAL
  // =============================================
  async updateMaterial(adminId: string, materialId: string, dto: UpdateMaterialDto) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' }
    });
    if (!admin) throw new ForbiddenException('Apenas administradores podem atualizar materiais');

    const material = await this.prisma.educationalMaterial.findUnique({
      where: { id: materialId }
    });
    if (!material) throw new NotFoundException('Material não encontrado');

    // Update material
    return this.prisma.educationalMaterial.update({
      where: { id: materialId },
      data: {
        title: dto.title,
        description: dto.description,
        content: dto.content,
        accessLevel: dto.accessLevel,
        duration: dto.duration,
        passingScore: dto.passingScore,
        ...(dto.questions ? {
          questions: {
            deleteMany: {},
            create: dto.questions.map((q, index) => ({
              text: q.text,
              type: q.type || 'MULTIPLE_CHOICE',
              options: q.options || [],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: index,
              points: q.points || 1
            }))
          }
        } : {})
      },
      include: {
        subject: true,
        institution: true,
        questions: true
      }
    });
  }

  // =============================================
  // ADMIN: TOGGLE BLOCK/UNBLOCK
  // =============================================
  async toggleBlock(adminId: string, materialId: string, block: boolean, reason?: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' }
    });
    if (!admin) throw new ForbiddenException('Apenas administradores podem bloquear/desbloquear');

    const material = await this.prisma.educationalMaterial.findUnique({
      where: { id: materialId }
    });
    if (!material) throw new NotFoundException('Material não encontrado');

    return this.prisma.educationalMaterial.update({
      where: { id: materialId },
      data: {
        isActive: !block,
        blockedBy: block ? adminId : null,
        blockedAt: block ? new Date() : null,
        blockReason: block ? reason : null
      }
    });
  }

  // =============================================
  // ADMIN: TOGGLE PUBLISH
  // =============================================
  async togglePublish(materialId: string, publish: boolean) {
    const material = await this.prisma.educationalMaterial.findUnique({
      where: { id: materialId }
    });
    if (!material) throw new NotFoundException('Material não encontrado');

    return this.prisma.educationalMaterial.update({
      where: { id: materialId },
      data: {
        isPublished: publish,
        publishedAt: publish ? new Date() : null
      }
    });
  }

  // =============================================
  // ADMIN: GET ALL MATERIALS
  // =============================================
  async getAdminMaterials(institutionId?: string) {
    const where: any = {};
    if (institutionId) where.institutionId = institutionId;

    return this.prisma.educationalMaterial.findMany({
      where,
      include: {
        subject: true,
        institution: true,
        _count: {
          select: { questions: true, results: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // =============================================
  // PUBLIC: GET PUBLISHED MATERIALS
  // =============================================
  async getPublishedMaterials(institutionId: string, subjectId?: string) {
    const where: any = {
      institutionId,
      isPublished: true,
      isActive: true
    };

    if (subjectId) {
      where.subjectId = subjectId;
    }

    return this.prisma.educationalMaterial.findMany({
      where,
      include: {
        subject: true,
        institution: true,
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            order: true,
            points: true
          }
        }
      },
      orderBy: [
        { type: 'asc' },
        { title: 'asc' }
      ]
    });
  }

  // =============================================
  // PUBLIC: GET MATERIAL DETAILS
  // =============================================
  async getMaterialDetails(materialId: string, userId?: string) {
    const material = await this.prisma.educationalMaterial.findUnique({
      where: { id: materialId },
      include: {
        subject: true,
        institution: true,
        questions: {
          orderBy: { order: 'asc' }
        },
        results: {
          where: userId ? { userId } : {},
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!material) throw new NotFoundException('Material não encontrado');

    // Check if material is blocked
    if (!material.isActive) {
      throw new ForbiddenException('Este material está bloqueado');
    }

    // Check if material is published
    if (!material.isPublished) {
      throw new ForbiddenException('Este material não está disponível');
    }

    // For paid exams, check if user has access
    if (material.accessLevel === 'PAID' && material.type === 'EXAM') {
      // Here you would check if user has paid for this exam
      // For now, just return basic info without questions
      if (!userId) {
        return {
          ...material,
          questions: [],
          isLocked: true,
          message: 'Este é um exame pago. Faça login e adquira acesso para visualizar as questões.'
        };
      }
    }

    return material;
  }

  // =============================================
  // PUBLIC: GET INSTITUTION PAGE (Organized)
  // =============================================
  async getInstitutionPage(institutionId: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId }
    });

    if (!institution) throw new NotFoundException('Instituição não encontrada');

    // Get all published materials
    const materials = await this.prisma.educationalMaterial.findMany({
      where: {
        institutionId,
        isPublished: true,
        isActive: true
      },
      include: {
        subject: true,
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            order: true,
            points: true
          }
        },
        results: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: [
        { type: 'asc' },
        { title: 'asc' }
      ]
    });

    // Group by subject
    const groupedBySubject = materials.reduce((acc, material) => {
      const subjectId = material.subjectId;
      if (!acc[subjectId]) {
        acc[subjectId] = {
          subject: material.subject,
          materials: []
        };
      }
      acc[subjectId].materials.push(material);
      return acc;
    }, {});

    return {
      institution,
      subjects: Object.values(groupedBySubject),
      totalManuals: materials.filter(m => m.type === 'MANUAL').length,
      totalExams: materials.filter(m => m.type === 'EXAM').length
    };
  }

  // =============================================
  // USER: SUBMIT EXAM
  // =============================================
  async submitExam(userId: string, dto: SubmitExamDto) {
    const material = await this.prisma.educationalMaterial.findUnique({
      where: { id: dto.materialId },
      include: {
        questions: true
      }
    });

    if (!material) throw new NotFoundException('Exame não encontrado');
    if (material.type !== 'EXAM') throw new BadRequestException('Este material não é um exame');
    if (!material.isPublished) throw new ForbiddenException('Este exame não está disponível');
    if (!material.isActive) throw new ForbiddenException('Este exame está bloqueado');

    // Check if user already took this exam
    const existingResult = await this.prisma.result.findFirst({
      where: {
        userId,
        materialId: dto.materialId
      }
    });

    if (existingResult) {
      throw new BadRequestException('Você já realizou este exame');
    }

    // Calculate result
    let correct = 0;
    const total = material.questions.length;
    const detailedAnswers = [];

    for (const question of material.questions) {
      const userAnswer = dto.answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correct++;
      
      detailedAnswers.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: question.points || 1
      });
    }

    const percentage = (correct / total) * 100;
    const passed = percentage >= (material.passingScore || 60);

    // Save result
    const result = await this.prisma.result.create({
      data: {
        userId,
        materialId: dto.materialId,
        score: correct,
        total,
        percentage,
        correctAnswers: correct,
        wrongAnswers: total - correct,
        answers: detailedAnswers,
        completedAt: new Date()
      }
    });

    return {
      result,
      passed,
      percentage,
      correct,
      total,
      detailedAnswers
    };
  }

  // =============================================
  // USER: GET RESULTS
  // =============================================
  async getUserResults(userId: string) {
    return this.prisma.result.findMany({
      where: { userId },
      include: {
        material: {
          include: {
            subject: true,
            institution: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });
  }

  // =============================================
  // USER: GET STATISTICS
  // =============================================
  async getUserStats(userId: string) {
    const results = await this.prisma.result.findMany({
      where: { userId },
      include: {
        material: true
      }
    });

    const totalExams = results.length;
    const averageScore = totalExams > 0 
      ? results.reduce((sum, r) => sum + r.percentage, 0) / totalExams 
      : 0;
    const examsPassed = results.filter(r => r.percentage >= (r.material.passingScore || 60)).length;

    return {
      totalExams,
      averageScore: Math.round(averageScore),
      examsPassed,
      examsFailed: totalExams - examsPassed,
      results: results.slice(0, 10) // Last 10 results
    };
  }
}
