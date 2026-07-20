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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let WalletService = WalletService_1 = class WalletService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WalletService_1.name);
        this.MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
        this.MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'demo_key';
        this.MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'demo_secret';
        this.MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://api.meuexame.co.mz/api/wallet/webhooks/mpesa';
        this.MPESA_BASE_URL = process.env.MPESA_ENV === 'production'
            ? 'https://api.safaricom.com'
            : 'https://sandbox.safaricom.com';
        this.EMOLA_API_URL = process.env.EMOLA_API_URL || 'https://api.emola.co.mz';
        this.EMOLA_API_KEY = process.env.EMOLA_API_KEY || 'demo_key';
        this.EMOLA_CALLBACK_URL = process.env.EMOLA_CALLBACK_URL || 'https://api.meuexame.co.mz/api/wallet/webhooks/emola';
        this.DEBITPAY_API_URL = process.env.DEBITPAY_API_URL || 'https://api.debitpay.co.mz';
        this.DEBITPAY_API_KEY = process.env.DEBITPAY_API_KEY || 'demo_key';
        this.DEBITPAY_CALLBACK_URL = process.env.DEBITPAY_CALLBACK_URL || 'https://api.meuexame.co.mz/api/wallet/webhooks/debitpay';
    }
    generateReference() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ME${timestamp}${random}`;
    }
    validatePhone(phone, method) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('258')) {
            return this.validatePhoneNumber(cleanPhone.slice(3), method);
        }
        return this.validatePhoneNumber(cleanPhone, method);
    }
    validatePhoneNumber(phone, method) {
        if (phone.length !== 9)
            return false;
        const prefixes = {
            MPESA: ['84', '85'],
            EMOLA: ['86', '87'],
            DEBITPAY: ['84', '85', '86', '87'],
        };
        const validPrefixes = prefixes[method];
        const prefix = phone.slice(0, 2);
        return validPrefixes.includes(prefix);
    }
    formatPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('258')) {
            return cleanPhone;
        }
        return `258${cleanPhone}`;
    }
    async initiatePayment(userId, examId, method, phone, amount) {
        try {
            if (!this.validatePhone(phone, method)) {
                return {
                    success: false,
                    reference: '',
                    message: `Número de telefone inválido para ${method}`,
                };
            }
            const reference = this.generateReference();
            const formattedPhone = this.formatPhone(phone);
            const transaction = await this.prisma.walletTransaction.create({
                data: {
                    userId,
                    examId,
                    method,
                    phone: formattedPhone,
                    amount,
                    reference,
                    status: 'PENDING',
                },
            });
            let result;
            switch (method) {
                case 'MPESA':
                    result = await this.initiateMpesaPayment(transaction.id, formattedPhone, amount, reference);
                    break;
                case 'EMOLA':
                    result = await this.initiateEmolaPayment(transaction.id, formattedPhone, amount, reference);
                    break;
                case 'DEBITPAY':
                    result = await this.initiateDebitPayPayment(transaction.id, formattedPhone, amount, reference);
                    break;
                default:
                    return { success: false, reference, message: 'Método de pagamento não suportado' };
            }
            if (result.externalId) {
                await this.prisma.walletTransaction.update({
                    where: { id: transaction.id },
                    data: { externalId: result.externalId },
                });
            }
            return result;
        }
        catch (error) {
            this.logger.error('Error initiating payment:', error);
            return { success: false, reference: '', message: 'Erro ao processar pagamento' };
        }
    }
    async initiateMpesaPayment(transactionId, phone, amount, reference) {
        try {
            if (process.env.MPESA_ENV !== 'production') {
                this.logger.log(`[DEMO] M-Pesa payment initiated: ${reference}`);
                const externalId = `MP${Date.now()}${Math.floor(Math.random() * 1000)}`;
                this.scheduleStatusCheck(transactionId);
                return {
                    success: true,
                    reference,
                    externalId,
                    message: 'Aguarde o código no seu telemóvel M-Pesa',
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                };
            }
            const token = await this.getMpesaToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
            const password = Buffer.from(`${this.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893051bef6fdc56b9f39053439'}${timestamp}`).toString('base64');
            const response = await fetch(`${this.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    BusinessShortCode: this.MPESA_SHORTCODE,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: Math.ceil(amount),
                    PartyA: phone,
                    PartyB: this.MPESA_SHORTCODE,
                    PhoneNumber: phone,
                    CallBackURL: this.MPESA_CALLBACK_URL,
                    AccountReference: reference,
                    TransactionDesc: `MeuExame - ${reference}`,
                }),
            });
            const data = await response.json();
            if (data.ResponseCode === '0') {
                this.scheduleStatusCheck(transactionId);
                return {
                    success: true,
                    reference,
                    externalId: data.CheckoutRequestID,
                    message: 'Aguarde o código no seu telemóvel M-Pesa',
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                };
            }
            return { success: false, reference, message: data.ResponseDescription || 'Erro M-Pesa' };
        }
        catch (error) {
            this.logger.error('M-Pesa payment error:', error);
            return { success: false, reference, message: 'Erro ao processar M-Pesa' };
        }
    }
    async initiateEmolaPayment(transactionId, phone, amount, reference) {
        try {
            if (process.env.EMOLA_API_KEY === 'demo_key') {
                this.logger.log(`[DEMO] eMola payment initiated: ${reference}`);
                const externalId = `EM${Date.now()}${Math.floor(Math.random() * 1000)}`;
                this.scheduleStatusCheck(transactionId);
                return {
                    success: true,
                    reference,
                    externalId,
                    message: 'Aguarde notificação no seu telemóvel eMola',
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                };
            }
            const response = await fetch(`${this.EMOLA_API_URL}/v1/payments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.EMOLA_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone,
                    amount: Math.ceil(amount),
                    reference: reference,
                    callback_url: this.EMOLA_CALLBACK_URL,
                }),
            });
            const data = await response.json();
            if (data.status === 'success' || data.status === 'pending') {
                this.scheduleStatusCheck(transactionId);
                return {
                    success: true,
                    reference,
                    externalId: data.transaction_id,
                    message: 'Aguarde notificação no seu telemóvel eMola',
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                };
            }
            return { success: false, reference, message: data.message || 'Erro eMola' };
        }
        catch (error) {
            this.logger.error('eMola payment error:', error);
            return { success: false, reference, message: 'Erro ao processar eMola' };
        }
    }
    async initiateDebitPayPayment(transactionId, phone, amount, reference) {
        try {
            if (process.env.DEBITPAY_API_KEY === 'demo_key') {
                this.logger.log(`[DEMO] DebitPay payment initiated: ${reference}`);
                const externalId = `DP${Date.now()}${Math.floor(Math.random() * 1000)}`;
                const paymentCode = `DP${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
                this.scheduleStatusCheck(transactionId);
                return {
                    success: true,
                    reference,
                    externalId,
                    message: `Código de pagamento: ${paymentCode}`,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
                };
            }
            const response = await fetch(`${this.DEBITPAY_API_URL}/v1/pay`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.DEBITPAY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone,
                    amount: Math.ceil(amount),
                    reference: reference,
                    callback_url: this.DEBITPAY_CALLBACK_URL,
                }),
            });
            const data = await response.json();
            if (data.status === 'success' || data.status === 'pending') {
                this.scheduleStatusCheck(transactionId);
                return {
                    success: true,
                    reference,
                    externalId: data.payment_code || data.transaction_id,
                    message: `Código de pagamento: ${data.payment_code}`,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
                };
            }
            return { success: false, reference, message: data.message || 'Erro DebitPay' };
        }
        catch (error) {
            this.logger.error('DebitPay payment error:', error);
            return { success: false, reference, message: 'Erro ao processar DebitPay' };
        }
    }
    scheduleStatusCheck(transactionId) {
        setTimeout(async () => {
            const transaction = await this.prisma.walletTransaction.findUnique({
                where: { id: transactionId },
            });
            if (transaction && transaction.status === 'PENDING') {
                this.logger.log(`[DEMO] Auto-completing transaction: ${transaction.reference}`);
                await this.completeTransaction(transactionId);
            }
        }, 10000);
    }
    async getTransactionStatus(reference) {
        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { reference },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        if (!transaction) {
            return { status: 'NOT_FOUND', message: 'Transação não encontrada' };
        }
        return {
            status: transaction.status,
            reference: transaction.reference,
            method: transaction.method,
            amount: transaction.amount,
            createdAt: transaction.createdAt,
            paidAt: transaction.paidAt,
        };
    }
    async handleMpesaCallback(data) {
        try {
            const result = data.Body?.stkCallback;
            if (!result)
                return { success: false };
            const checkoutRequestId = result.CheckoutRequestID;
            const resultCode = result.ResultCode;
            const transaction = await this.prisma.walletTransaction.findFirst({
                where: { externalId: checkoutRequestId },
            });
            if (!transaction)
                return { success: false };
            if (resultCode === 0) {
                await this.completeTransaction(transaction.id);
            }
            else {
                await this.failTransaction(transaction.id, 'M-Pesa recusou o pagamento');
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error('M-Pesa callback error:', error);
            return { success: false };
        }
    }
    async handleEmolaCallback(data) {
        try {
            const transactionId = data.transaction_id;
            const status = data.status;
            const transaction = await this.prisma.walletTransaction.findFirst({
                where: { externalId: transactionId },
            });
            if (!transaction)
                return { success: false };
            if (status === 'success' || status === 'completed') {
                await this.completeTransaction(transaction.id);
            }
            else if (status === 'failed' || status === 'rejected') {
                await this.failTransaction(transaction.id, 'eMola recusou o pagamento');
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error('eMola callback error:', error);
            return { success: false };
        }
    }
    async handleDebitPayCallback(data) {
        try {
            const transactionId = data.transaction_id || data.payment_code;
            const status = data.status;
            const transaction = await this.prisma.walletTransaction.findFirst({
                where: { externalId: transactionId },
            });
            if (!transaction)
                return { success: false };
            if (status === 'success' || status === 'completed') {
                await this.completeTransaction(transaction.id);
            }
            else if (status === 'failed') {
                await this.failTransaction(transaction.id, 'DebitPay recusou o pagamento');
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error('DebitPay callback error:', error);
            return { success: false };
        }
    }
    async completeTransaction(transactionId) {
        try {
            const transaction = await this.prisma.walletTransaction.update({
                where: { id: transactionId },
                data: {
                    status: 'COMPLETED',
                    paidAt: new Date(),
                },
                include: { user: true },
            });
            await this.prisma.examAccess.create({
                data: {
                    userId: transaction.userId,
                    examId: transaction.examId,
                    paymentMethod: transaction.method,
                    transactionReference: transaction.reference,
                    amount: transaction.amount,
                    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                },
            });
            this.logger.log(`Transaction completed: ${transaction.reference}`);
            return transaction;
        }
        catch (error) {
            this.logger.error('Error completing transaction:', error);
            throw error;
        }
    }
    async failTransaction(transactionId, reason) {
        await this.prisma.walletTransaction.update({
            where: { id: transactionId },
            data: {
                status: 'FAILED',
                failureReason: reason,
            },
        });
    }
    async getMpesaToken() {
        const auth = Buffer.from(`${this.MPESA_CONSUMER_KEY}:${this.MPESA_CONSUMER_SECRET}`).toString('base64');
        const response = await fetch(`${this.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });
        const data = await response.json();
        return data.access_token;
    }
    async checkExamAccess(userId, examId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
        });
        if (exam?.accessType === 'FREE') {
            return true;
        }
        const access = await this.prisma.examAccess.findFirst({
            where: {
                userId,
                examId,
                expiresAt: { gt: new Date() },
            },
        });
        return !!access;
    }
    async getUserTransactions(userId) {
        return this.prisma.walletTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = WalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet-service.js.map