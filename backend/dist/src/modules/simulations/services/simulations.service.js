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
exports.SimulationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SimulationsService = class SimulationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSimulationDto) {
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
    async findAll() {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Simulação não encontrada');
        }
        return simulation;
    }
    async update(id, updateSimulationDto) {
        return this.prisma.examSimulation.update({
            where: { id },
            data: updateSimulationDto,
        });
    }
    async remove(id) {
        return this.prisma.examSimulation.delete({
            where: { id },
        });
    }
    async findByUser(userId) {
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
    async findByExam(examId) {
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
    async startSimulation(examId, userId) {
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
        if (exam.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Exame não está publicado');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
            },
        });
        const hasActiveSubscription = user?.subscription?.isActive &&
            new Date(user.subscription.endDate) > new Date();
        const existingSimulation = await this.prisma.examSimulation.findFirst({
            where: {
                examId,
                userId,
                status: client_1.SimulationStatus.IN_PROGRESS,
            },
        });
        if (existingSimulation) {
            return existingSimulation;
        }
        const simulation = await this.prisma.examSimulation.create({
            data: {
                examId,
                userId,
                status: client_1.SimulationStatus.IN_PROGRESS,
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
        if (!hasActiveSubscription && exam.examQuestions.length > 3) {
            simulation.exam.examQuestions = exam.examQuestions.slice(0, 3);
        }
        return simulation;
    }
    async completeSimulation(id, answers) {
        const simulation = await this.findOne(id);
        if (simulation.status !== client_1.SimulationStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Simulação já foi concluída');
        }
        const score = await this.calculateScore(id);
        return this.prisma.examSimulation.update({
            where: { id },
            data: {
                answers,
                score,
                status: client_1.SimulationStatus.COMPLETED,
                completedAt: new Date(),
            },
        });
    }
    async calculateScore(id) {
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
            throw new common_1.NotFoundException('Simulação não encontrada');
        }
        const hasActiveSubscription = simulation.user?.subscription?.isActive &&
            new Date(simulation.user.subscription.endDate) > new Date();
        let correctAnswers = 0;
        let totalPoints = 0;
        let questionsToEvaluate = simulation.exam.examQuestions;
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
};
exports.SimulationsService = SimulationsService;
exports.SimulationsService = SimulationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SimulationsService);
//# sourceMappingURL=simulations.service.js.map