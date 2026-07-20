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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PaymentService = class PaymentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPaymentIntent(userId, planId, phoneNumber) {
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan)
            throw new common_1.NotFoundException('Plano não encontrado');
        if (!plan.isActive)
            throw new Error('Plano não disponível');
        const payment = await this.prisma.payment.create({
            data: {
                userId,
                planId,
                amount: plan.price,
                status: 'PENDING',
                paymentMethod: phoneNumber.startsWith('84') || phoneNumber.startsWith('85') ? 'M_PESA' : 'E_MOLA',
                transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            },
            include: { user: true, plan: true },
        });
        setTimeout(() => this.processPayment(payment.id), 5000);
        return {
            paymentId: payment.id,
            transactionId: payment.transactionId,
            amount: plan.price,
            status: 'PENDING',
            phoneNumber,
            message: 'Aguarde pela confirmação no seu telemóvel',
        };
    }
    async processPayment(paymentId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { plan: true, user: true },
        });
        if (!payment || payment.status !== 'PENDING')
            return;
        await this.prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'APPROVED', paidAt: new Date() },
        });
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + payment.plan.duration);
        await this.prisma.subscription.upsert({
            where: { userId: payment.userId },
            update: {
                planId: payment.planId,
                status: 'ACTIVE',
                startDate,
                endDate,
                amount: payment.amount,
                isActive: true,
            },
            create: {
                userId: payment.userId,
                planId: payment.planId,
                status: 'ACTIVE',
                startDate,
                endDate,
                amount: payment.amount,
                isActive: true,
            },
        });
    }
    async getPaymentById(id) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: { user: true, plan: true },
        });
    }
    async getUserPayments(userId) {
        return this.prisma.payment.findMany({
            where: { userId },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUserSubscription(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
            include: { plan: true },
        });
        if (!subscription)
            return null;
        if (subscription.endDate && new Date() > subscription.endDate) {
            await this.prisma.subscription.update({
                where: { userId },
                data: { status: 'INACTIVE', isActive: false },
            });
            return { ...subscription, status: 'INACTIVE', isActive: false };
        }
        return subscription;
    }
    async getPendingPayments() {
        return this.prisma.payment.findMany({
            where: { status: 'PENDING' },
            include: { user: true, plan: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approvePayment(id) {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        if (!payment)
            throw new common_1.NotFoundException('Pagamento não encontrado');
        await this.processPayment(id);
        return { success: true };
    }
    async rejectPayment(id) {
        await this.prisma.payment.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
        return { success: true };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map