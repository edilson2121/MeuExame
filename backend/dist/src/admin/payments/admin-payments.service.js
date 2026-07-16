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
exports.AdminPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
const safeUserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    institutionId: true,
    createdAt: true,
    updatedAt: true,
};
let AdminPaymentsService = class AdminPaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSubscription(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const existingSubscription = await this.prisma.subscription.findUnique({
            where: { userId: dto.userId },
        });
        if (existingSubscription) {
            throw new common_1.BadRequestException('Este usuário já possui uma assinatura');
        }
        return this.prisma.subscription.create({
            data: {
                userId: dto.userId,
                plan: dto.plan,
                amount: dto.amount,
                currency: dto.currency ?? 'MZN',
                status: client_1.SubscriptionStatus.INACTIVE,
                isActive: false,
            },
            include: {
                user: { select: safeUserSelect },
            },
        });
    }
    async recordPayment(dto, adminId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: dto.subscriptionId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Assinatura não encontrada');
        }
        if (subscription.userId !== dto.userId) {
            throw new common_1.BadRequestException('Assinatura não pertence a este usuário');
        }
        const payment = await this.prisma.paymentTransaction.create({
            data: {
                userId: dto.userId,
                subscriptionId: dto.subscriptionId,
                amount: dto.amount,
                method: dto.method,
                reference: dto.reference,
                currency: dto.currency ?? 'MZN',
                status: client_1.PaymentStatus.PENDING,
            },
            include: {
                user: { select: safeUserSelect },
                subscription: true,
            },
        });
        return payment;
    }
    async markUserPaid(dto, adminId) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            select: safeUserSelect,
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const now = new Date();
        const endDate = this.calculateEndDate(dto.plan, now);
        const subscription = await this.prisma.subscription.upsert({
            where: { userId: dto.userId },
            create: {
                userId: dto.userId,
                plan: dto.plan,
                amount: dto.amount,
                currency: dto.currency ?? 'MZN',
                status: client_1.SubscriptionStatus.ACTIVE,
                isActive: true,
                startDate: now,
                endDate,
            },
            update: {
                plan: dto.plan,
                amount: dto.amount,
                currency: dto.currency ?? 'MZN',
                status: client_1.SubscriptionStatus.ACTIVE,
                isActive: true,
                startDate: now,
                endDate,
            },
        });
        const payment = await this.prisma.paymentTransaction.create({
            data: {
                userId: dto.userId,
                subscriptionId: subscription.id,
                amount: dto.amount,
                currency: dto.currency ?? 'MZN',
                method: dto.method,
                reference: dto.reference,
                status: client_1.PaymentStatus.APPROVED,
                approvedBy: adminId,
                approvedAt: now,
            },
            include: {
                user: { select: safeUserSelect },
                subscription: true,
            },
        });
        if (user.institutionId) {
            await this.prisma.institution.update({
                where: { id: user.institutionId },
                data: {
                    isPaid: true,
                    paidAt: now,
                },
            });
        }
        return { subscription, payment };
    }
    async approvePayment(paymentId, dto, adminId) {
        const payment = await this.prisma.paymentTransaction.findUnique({
            where: { id: paymentId },
            include: {
                subscription: true,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Pagamento não encontrado');
        }
        const newStatus = dto.approve ? client_1.PaymentStatus.APPROVED : client_1.PaymentStatus.REJECTED;
        const updatedPayment = await this.prisma.paymentTransaction.update({
            where: { id: paymentId },
            data: {
                status: newStatus,
                approvedBy: adminId,
                approvedAt: new Date(),
            },
        });
        if (dto.approve) {
            await this.prisma.subscription.update({
                where: { id: payment.subscriptionId },
                data: {
                    status: client_1.SubscriptionStatus.ACTIVE,
                    isActive: true,
                    startDate: new Date(),
                    endDate: this.calculateEndDate(payment.subscription.plan),
                },
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payment.userId },
            });
            if (user?.institutionId) {
                await this.prisma.institution.update({
                    where: { id: user.institutionId },
                    data: {
                        isPaid: true,
                        paidAt: new Date(),
                    },
                });
            }
        }
        return updatedPayment;
    }
    async getSubscriptionByUserId(userId) {
        return this.prisma.subscription.findUnique({
            where: { userId },
            include: {
                user: { select: safeUserSelect },
                payments: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    async getPaymentsByUserId(userId) {
        return this.prisma.paymentTransaction.findMany({
            where: { userId },
            include: {
                user: { select: safeUserSelect },
                subscription: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllPendingPayments() {
        return this.prisma.paymentTransaction.findMany({
            where: { status: client_1.PaymentStatus.PENDING },
            include: {
                user: { select: safeUserSelect },
                subscription: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getAllPayments(status) {
        return this.prisma.paymentTransaction.findMany({
            where: status ? { status } : {},
            include: {
                user: { select: safeUserSelect },
                subscription: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getInstitutionPaymentStatus(institutionId) {
        const institution = await this.prisma.institution.findUnique({
            where: { id: institutionId },
            include: {
                users: {
                    include: {
                        subscription: {
                            include: {
                                payments: true,
                            },
                        },
                    },
                },
            },
        });
        if (!institution) {
            throw new common_1.NotFoundException('Instituição não encontrada');
        }
        return {
            institution,
            isPaid: institution.isPaid,
            paidAt: institution.paidAt,
            users: institution.users,
        };
    }
    calculateEndDate(plan, from = new Date()) {
        const endDate = new Date(from);
        const daysByPlan = {
            BASIC: 30,
            DAILY: 1,
            WEEKLY: 7,
            MONTHLY: 30,
        };
        endDate.setDate(endDate.getDate() + daysByPlan[plan]);
        return endDate;
    }
};
exports.AdminPaymentsService = AdminPaymentsService;
exports.AdminPaymentsService = AdminPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminPaymentsService);
//# sourceMappingURL=admin-payments.service.js.map