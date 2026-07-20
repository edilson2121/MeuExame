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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPaymentDto) {
        const plan = await this.prisma.plan.findUnique({
            where: { id: createPaymentDto.planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Plano não encontrado');
        }
        if (!plan.isActive) {
            throw new common_1.BadRequestException('Plano não está ativo');
        }
        const payment = await this.prisma.payment.create({
            data: {
                userId,
                ...createPaymentDto,
                amount: plan.price,
            },
            include: {
                plan: true,
            },
        });
        return payment;
    }
    async findAll() {
        return this.prisma.payment.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                plan: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUser(userId) {
        return this.prisma.payment.findMany({
            where: { userId },
            include: {
                plan: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                plan: true,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Pagamento não encontrado');
        }
        return payment;
    }
    async updateStatus(id, updatePaymentDto) {
        const payment = await this.findOne(id);
        if (updatePaymentDto.status === client_1.PaymentStatus.APPROVED && payment.status !== client_1.PaymentStatus.APPROVED) {
            await this.createSubscription(payment.userId, payment.planId);
        }
        return this.prisma.payment.update({
            where: { id },
            data: {
                ...updatePaymentDto,
                paidAt: updatePaymentDto.status === client_1.PaymentStatus.APPROVED ? new Date() : payment.paidAt,
            },
        });
    }
    async createSubscription(userId, planId) {
        const plan = await this.prisma.plan.findUnique({
            where: { id: planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Plano não encontrado');
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.duration);
        const existingSubscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (existingSubscription) {
            return this.prisma.subscription.update({
                where: { id: existingSubscription.id },
                data: {
                    planId,
                    status: 'ACTIVE',
                    startDate,
                    endDate,
                },
            });
        }
        return this.prisma.subscription.create({
            data: {
                user: {
                    connect: { id: userId },
                },
                plan: {
                    connect: { id: planId },
                },
                amount: plan.duration * 100,
                currency: 'MZN',
                status: 'ACTIVE',
                startDate,
                endDate,
            },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map