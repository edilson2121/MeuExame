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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    async handleDebitoPayWebhook(payload) {
        this.logger.log(`Received DebitoPay webhook: ${JSON.stringify(payload)}`);
        try {
            const { event, data } = payload;
            let payment = await this.prisma.payment.findFirst({
                where: {
                    OR: [
                        { instructionId: data.instructionId },
                        { transactionId: data.transactionId },
                    ],
                },
                include: {
                    user: true,
                    exam: true,
                },
            });
            if (!payment) {
                this.logger.warn(`Payment not found for instructionId: ${data.instructionId}`);
                return { success: false, message: 'Payment not found' };
            }
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    webhookData: payload,
                    transactionId: data.transactionId || payment.transactionId,
                    paidAt: data.status === 'SUCCESS' ? new Date() : null,
                },
            });
            if (data.status === 'SUCCESS') {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'APPROVED' },
                });
                if (payment.examId) {
                    await this.grantExamAccess(payment.userId, payment.examId);
                }
                else if (payment.planId) {
                    await this.activateSubscription(payment.userId, payment.planId);
                }
                this.logger.log(`Payment completed for user ${payment.userId}: ${payment.amount} MZN`);
                return { success: true, message: 'Payment processed successfully' };
            }
            else if (data.status === 'FAILED') {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'REJECTED' },
                });
                this.logger.warn(`Payment failed for user ${payment.userId}`);
                return { success: true, message: 'Payment failure recorded' };
            }
            return { success: true, message: 'Webhook processed' };
        }
        catch (error) {
            this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
            return { success: false, message: 'Internal server error' };
        }
    }
    async grantExamAccess(userId, examId) {
        const existingAccess = await this.prisma.examAccess.findUnique({
            where: {
                examId_userId: { examId, userId },
            },
        });
        if (!existingAccess) {
            await this.prisma.examAccess.create({
                data: {
                    userId,
                    examId,
                    type: 'PAID',
                    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                },
            });
            this.logger.log(`Exam access granted to user ${userId} for exam ${examId}`);
        }
    }
    async activateSubscription(userId, planId) {
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan)
            return;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration);
        await this.prisma.subscription.upsert({
            where: { userId },
            update: {
                planId,
                status: 'ACTIVE',
                startDate: new Date(),
                endDate,
                isActive: true,
                amount: plan.price,
            },
            create: {
                userId,
                planId,
                status: 'ACTIVE',
                startDate: new Date(),
                endDate,
                isActive: true,
                amount: plan.price,
            },
        });
        this.logger.log(`Subscription activated for user ${userId} until ${endDate}`);
    }
    verifyWebhookSignature(payload, signature, secret) {
        return true;
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map