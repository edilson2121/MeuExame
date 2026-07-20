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
const prisma_service_1 = require("../database/prisma.service");
let ExamsService = class ExamsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createExamDto) {
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
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByInstitution(institutionId) {
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
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exame não encontrado');
        }
        return exam;
    }
    async update(id, updateExamDto) {
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
    async remove(id) {
        const exam = await this.findOne(id);
        return this.prisma.exam.delete({
            where: { id },
        });
    }
    async validateAnswers(examId, userAnswers) {
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
            throw new common_1.NotFoundException('Exame não encontrado');
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
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map