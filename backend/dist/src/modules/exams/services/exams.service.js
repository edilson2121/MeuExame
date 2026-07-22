"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ExamsService = class ExamsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createExamDto) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Exame não encontrado');
        }
        const questions = exam.examQuestions.map((eq) => {
            const question = eq.question;
            let options = [];
            if (typeof question.options === 'string') {
                try {
                    options = JSON.parse(question.options);
                }
                catch (e) {
                    options = [];
                }
            }
            else if (Array.isArray(question.options)) {
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
        return {
            ...exam,
            questions,
        };
    }
    async update(id, updateExamDto) {
        const exam = await this.findOne(id);
        if (exam.status === client_1.ExamStatus.PUBLISHED) {
            throw new common_1.BadRequestException('Não é possível editar um exame publicado');
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
    async remove(id) {
        return this.prisma.exam.delete({
            where: { id },
        });
    }
    async findBySubject(subjectId) {
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
    async findByAuthor(authorId) {
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
    async addQuestion(examId, questionId, order, points) {
        const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
        if (!exam) {
            throw new common_1.NotFoundException('Exame não encontrado');
        }
        if (exam.status === client_1.ExamStatus.PUBLISHED) {
            throw new common_1.BadRequestException('Não é possível adicionar questões a um exame publicado');
        }
        await this.prisma.examQuestion.create({
            data: {
                examId,
                questionId,
                order,
                points,
            },
        });
        const examQuestions = await this.prisma.examQuestion.findMany({
            where: { examId },
        });
        const totalPoints = examQuestions.reduce((sum, eq) => sum + eq.points, 0);
        await this.prisma.exam.update({
            where: { id: examId },
            data: { totalPoints },
        });
    }
    async removeQuestion(examId, questionId) {
        const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
        if (!exam) {
            throw new common_1.NotFoundException('Exame não encontrado');
        }
        if (exam.status === client_1.ExamStatus.PUBLISHED) {
            throw new common_1.BadRequestException('Não é possível remover questões de um exame publicado');
        }
        await this.prisma.examQuestion.deleteMany({
            where: {
                examId,
                questionId,
            },
        });
        const examQuestions = await this.prisma.examQuestion.findMany({
            where: { examId },
        });
        const totalPoints = examQuestions.reduce((sum, eq) => sum + eq.points, 0);
        await this.prisma.exam.update({
            where: { id: examId },
            data: { totalPoints },
        });
    }
    async publishExam(id) {
        const exam = await this.prisma.exam.findUnique({ where: { id } });
        if (!exam) {
            throw new common_1.NotFoundException('Exame não encontrado');
        }
        const examQuestions = await this.prisma.examQuestion.findMany({
            where: { examId: id },
        });
        if (examQuestions.length === 0) {
            throw new common_1.BadRequestException('Não é possível publicar um exame sem questões');
        }
        return this.prisma.exam.update({
            where: { id },
            data: { status: client_1.ExamStatus.PUBLISHED },
        });
    }
    async findOneWithAccess(id, userId) {
        const exam = await this.findOne(id);
        let hasAccess = true;
        if (userId) {
            const access = await this.checkExamAccess(id, userId);
            hasAccess = access.hasAccess;
        }
        return {
            ...exam,
            hasAccess,
        };
    }
    async checkExamAccess(examId, userId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exame não encontrado');
        }
        if (!exam.price || exam.price === 0) {
            return { hasAccess: true, accessType: 'FREE' };
        }
        const examAccess = await this.prisma.examAccess.findFirst({
            where: {
                examId,
                userId,
            },
        });
        if (examAccess) {
            return { hasAccess: true, accessType: examAccess.type };
        }
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
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (user?.hasFullAccess) {
            return { hasAccess: true, accessType: 'FULL_ACCESS' };
        }
        return { hasAccess: false };
    }
    async submitExam(examId, userId, answers) {
        const access = await this.checkExamAccess(examId, userId);
        if (!access.hasAccess) {
            throw new common_1.BadRequestException('Não tem acesso a este exame');
        }
        const exam = await this.findOne(examId);
        let correct = 0;
        let total = 0;
        for (const answer of answers) {
            const question = exam.questions.find((q) => q.id === answer.questionId);
            if (!question)
                continue;
            total++;
            const correctOptionIndex = question.options.findIndex((o) => o.isCorrect);
            if (correctOptionIndex === answer.selectedOption) {
                correct++;
            }
        }
        await this.prisma.result.create({
            data: {
                score: correct,
                userId,
                examId,
                answers: answers,
            },
        });
        return {
            score: correct,
            total,
            percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
        };
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map