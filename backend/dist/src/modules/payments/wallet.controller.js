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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet-service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let WalletController = class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async initiatePayment(req, body) {
        const { examId, method, phone, amount } = body;
        const userId = req.user.id;
        const result = await this.walletService.initiatePayment(userId, examId, method, phone, amount);
        return result;
    }
    async getTransactionStatus(reference) {
        return this.walletService.getTransactionStatus(reference);
    }
    async getUserTransactions(req) {
        return this.walletService.getUserTransactions(req.user.id);
    }
    async checkExamAccess(req, examId) {
        const hasAccess = await this.walletService.checkExamAccess(req.user.id, examId);
        return { hasAccess };
    }
    async handleMpesaWebhook(body, signature) {
        return this.walletService.handleMpesaCallback(body);
    }
    async handleEmolaWebhook(body, signature) {
        return this.walletService.handleEmolaCallback(body);
    }
    async handleDebitPayWebhook(body, signature) {
        return this.walletService.handleDebitPayCallback(body);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Get)('status/:reference'),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getTransactionStatus", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getUserTransactions", null);
__decorate([
    (0, common_1.Get)('access/:examId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "checkExamAccess", null);
__decorate([
    (0, common_1.Post)('webhooks/mpesa'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-mpesa-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "handleMpesaWebhook", null);
__decorate([
    (0, common_1.Post)('webhooks/emola'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-emola-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "handleEmolaWebhook", null);
__decorate([
    (0, common_1.Post)('webhooks/debitpay'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-debitpay-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "handleDebitPayWebhook", null);
exports.WalletController = WalletController = __decorate([
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map