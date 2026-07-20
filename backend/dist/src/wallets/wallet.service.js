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
var WalletService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let WalletService = WalletService_1 = class WalletService {
    constructor(prisma, configService, httpService) {
        this.prisma = prisma;
        this.configService = configService;
        this.httpService = httpService;
        this.logger = new common_1.Logger(WalletService_1.name);
        this.config = {
            apiKey: this.configService.get('DEBITPAY_API_KEY') || 'demo_key',
            merchantId: this.configService.get('DEBITPAY_MERCHANT_ID') || 'demo_merchant',
            walletCodeMpesa: this.configService.get('DEBITPAY_WALLET_CODE') || 'mpesa_wallet',
            walletCodeEmola: this.configService.get('DEBITPAY_WALLET_CODE_EMOLA') || 'emola_wallet',
            baseUrl: this.configService.get('DEBITPAY_API_URL') || 'https://api.debito.co.mz',
            callbackUrl: this.configService.get('DEBITPAY_CALLBACK_URL') || 'http://localhost:3001/api/wallet/webhook',
        };
    }
    generateReference() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ME${timestamp}${random}`;
    }
    async getAccessToken() {
        if (this.config.apiKey === 'demo_key') {
            return 'demo_token_' + Date.now();
        }
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.config.baseUrl}/auth/token`, {
                apiKey: this.config.apiKey,
            }));
            return response.data.accessToken;
        }
        catch (error) {
            this.logger.error('Failed to get DebitPay access token', error);
            throw new common_1.BadRequestException('Erro ao conectar com DebitPay');
        }
    }
    async initiateMpesaPayment(phone, amount, reference, userId) {
        if (this.config.apiKey === 'demo_key') {
            this.logger.log(`[DEMO] Initiating M-Pesa payment: ${reference}`);
            await this.createTransaction({
                reference,
                userId,
                method: 'MPESA',
                amount,
                phone,
            });
            setTimeout(() => {
                this.simulatePaymentSuccess(reference);
            }, 10000 + Math.random() * 5000);
            return {
                success: true,
                reference,
                message: 'STK Push enviado! Confirme no seu celular.',
                method: 'MPESA',
            };
        }
        try {
            const token = await this.getAccessToken();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.config.baseUrl}/payments/mpesa/stk`, {
                phone: this.formatPhone(phone),
                amount,
                reference,
                walletCode: this.config.walletCodeMpesa,
                callbackUrl: `${this.config.callbackUrl}/mpesa`,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }));
            await this.createTransaction({
                reference,
                userId,
                method: 'MPESA',
                amount,
                phone,
                externalId: response.data?.transactionId,
            });
            return {
                success: true,
                reference,
                message: 'STK Push enviado! Confirme no seu celular.',
                method: 'MPESA',
            };
        }
        catch (error) {
            this.logger.error('M-Pesa payment initiation failed', error);
            throw new common_1.BadRequestException(error?.response?.data?.message || 'Erro ao processar pagamento M-Pesa');
        }
    }
    async initiateEmolaPayment(phone, amount, reference, userId) {
        if (this.config.apiKey === 'demo_key') {
            this.logger.log(`[DEMO] Initiating eMola payment: ${reference}`);
            await this.createTransaction({
                reference,
                userId,
                method: 'EMOLA',
                amount,
                phone,
            });
            setTimeout(() => {
                this.simulatePaymentSuccess(reference);
            }, 10000 + Math.random() * 5000);
            return {
                success: true,
                reference,
                message: 'Notificação enviada para eMola! Confirme no seu celular.',
                method: 'EMOLA',
            };
        }
        try {
            const token = await this.getAccessToken();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.config.baseUrl}/payments/emola/push`, {
                phone: this.formatPhone(phone),
                amount,
                reference,
                walletCode: this.config.walletCodeEmola,
                callbackUrl: `${this.config.callbackUrl}/emola`,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }));
            await this.createTransaction({
                reference,
                userId,
                method: 'EMOLA',
                amount,
                phone,
                externalId: response.data?.transactionId,
            });
            return {
                success: true,
                reference,
                message: 'Notificação enviada para eMola! Confirme no seu celular.',
                method: 'EMOLA',
            };
        }
        catch (error) {
            this.logger.error('eMola payment initiation failed', error);
            throw new common_1.BadRequestException(error?.response?.data?.message || 'Erro ao processar pagamento eMola');
        }
    }
    formatPhone(phone) {
        let formatted = phone.replace(/\D/g, '');
        if (formatted.startsWith('258')) {
            formatted = formatted.substring(3);
        }
        if (!formatted.startsWith('258')) {
            formatted = '258' + formatted;
        }
        return formatted;
    }
    async createTransaction(data) {
        return this.prisma.walletTransaction.create({
            data: {
                reference: data.reference,
                externalId: data.externalId,
                method: data.method,
                amount: data.amount,
                phone: data.phone,
                status: 'PENDING',
            },
        });
    }
    async simulatePaymentSuccess(reference) {
        try {
            await this.prisma.walletTransaction.update({
                where: { reference },
                data: {
                    status: 'COMPLETED',
                    paidAt: new Date(),
                },
            });
            this.logger.log(`[DEMO] Payment completed: ${reference}`);
        }
        catch (error) {
            this.logger.error('Failed to update demo payment status', error);
        }
    }
    async initiatePayment(data) {
        const reference = this.generateReference();
        const exam = await this.prisma.exam.findUnique({
            where: { id: data.examId },
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exame não encontrado');
        }
        if (!this.isValidPhone(data.phone, data.method)) {
            throw new common_1.BadRequestException(`Número de telefone inválido para ${data.method === 'MPESA' ? 'M-Pesa' : 'eMola'}`);
        }
        if (data.method === 'MPESA') {
            return this.initiateMpesaPayment(data.phone, data.amount, reference, data.userId);
        }
        else {
            return this.initiateEmolaPayment(data.phone, data.amount, reference, data.userId);
        }
    }
    isValidPhone(phone, method) {
        const cleaned = phone.replace(/\D/g, '');
        if (method === 'MPESA') {
            return /^(258)?(82|83|84|85|86|87)\d{7}$/.test(cleaned);
        }
        else {
            return /^(258)?(82|83|84|85|86|87)\d{7}$/.test(cleaned);
        }
    }
    async checkPaymentStatus(reference) {
        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { reference },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transação não encontrada');
        }
        return {
            status: transaction.status,
            reference: transaction.reference,
            message: this.getStatusMessage(transaction.status),
            amount: transaction.amount,
            transactionId: transaction.externalId || undefined,
            paidAt: transaction.paidAt || undefined,
        };
    }
    getStatusMessage(status) {
        const messages = {
            PENDING: 'Aguardando confirmação no celular',
            COMPLETED: 'Pagamento confirmado!',
            FAILED: 'Pagamento recusado',
            EXPIRED: 'Pagamento expirado',
        };
        return messages[status] || 'Status desconhecido';
    }
    async handleMpesaCallback(payload) {
        this.logger.log('M-Pesa webhook received:', JSON.stringify(payload));
        const { reference, resultCode, mpesaReceiptNumber } = payload;
        if (!reference) {
            this.logger.warn('M-Pesa callback missing reference');
            return;
        }
        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { reference },
        });
        if (!transaction) {
            this.logger.warn(`Transaction not found: ${reference}`);
            return;
        }
        if (resultCode === 0 || resultCode === '0') {
            await this.prisma.walletTransaction.update({
                where: { reference },
                data: {
                    status: 'COMPLETED',
                    paidAt: new Date(),
                    externalId: mpesaReceiptNumber,
                },
            });
            if (transaction.userId) {
                await this.grantExamAccess(transaction.userId, transaction.reference);
            }
        }
        else {
            await this.prisma.walletTransaction.update({
                where: { reference },
                data: { status: 'FAILED' },
            });
        }
    }
    async handleEmolaCallback(payload) {
        this.logger.log('eMola webhook received:', JSON.stringify(payload));
        const { reference, status, transactionId } = payload;
        if (!reference) {
            this.logger.warn('eMola callback missing reference');
            return;
        }
        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { reference },
        });
        if (!transaction) {
            this.logger.warn(`Transaction not found: ${reference}`);
            return;
        }
        if (status === 'SUCCESS' || status === 'COMPLETED') {
            await this.prisma.walletTransaction.update({
                where: { reference },
                data: {
                    status: 'COMPLETED',
                    paidAt: new Date(),
                    externalId: transactionId,
                },
            });
            if (transaction.userId) {
                await this.grantExamAccess(transaction.userId, transaction.reference);
            }
        }
        else {
            await this.prisma.walletTransaction.update({
                where: { reference },
                data: { status: 'FAILED' },
            });
        }
    }
    async grantExamAccess(userId, transactionReference) {
        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { reference: transactionReference },
        });
        if (!transaction) {
            this.logger.warn(`Transaction not found for access grant: ${transactionReference}`);
            return;
        }
        const examId = transaction.reference.includes('EXAM')
            ? transaction.reference.split('EXAM')[1]?.substring(0, 24)
            : null;
        if (examId) {
            await this.prisma.examAccess.create({
                data: {
                    userId,
                    examId,
                    transactionReference,
                    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                },
            });
        }
    }
    async getUserTransactions(userId) {
        return this.prisma.walletTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getAllTransactions(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.prisma.walletTransaction.findMany({
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.walletTransaction.count(),
        ]);
        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = WalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService, typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], WalletService);
//# sourceMappingURL=wallet.service.js.map