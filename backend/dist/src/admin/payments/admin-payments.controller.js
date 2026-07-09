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
exports.AdminPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const admin_payments_service_1 = require("./admin-payments.service");
const payment_dto_1 = require("./dto/payment.dto");
const client_1 = require("@prisma/client");
let AdminPaymentsController = class AdminPaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createSubscription(dto) {
        return this.paymentsService.createSubscription(dto);
    }
    async recordPayment(dto) {
        const adminId = 'admin-default';
        return this.paymentsService.recordPayment(dto, adminId);
    }
    async approvePayment(paymentId, dto) {
        const adminId = 'admin-default';
        return this.paymentsService.approvePayment(paymentId, dto, adminId);
    }
    async getSubscriptionByUserId(userId) {
        return this.paymentsService.getSubscriptionByUserId(userId);
    }
    async getPaymentsByUserId(userId) {
        return this.paymentsService.getPaymentsByUserId(userId);
    }
    async getPendingPayments() {
        return this.paymentsService.getAllPendingPayments();
    }
    async getAllPayments(status) {
        return this.paymentsService.getAllPayments(status);
    }
    async getInstitutionPaymentStatus(institutionId) {
        return this.paymentsService.getInstitutionPaymentStatus(institutionId);
    }
};
exports.AdminPaymentsController = AdminPaymentsController;
__decorate([
    (0, common_1.Post)('subscription'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Post)('record'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.RecordPaymentDto]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Put)('approve/:paymentId'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.ApprovePaymentDto]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "approvePayment", null);
__decorate([
    (0, common_1.Get)('subscription/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getSubscriptionByUserId", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getPaymentsByUserId", null);
__decorate([
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getPendingPayments", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Get)('institution/:institutionId/status'),
    __param(0, (0, common_1.Param)('institutionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getInstitutionPaymentStatus", null);
exports.AdminPaymentsController = AdminPaymentsController = __decorate([
    (0, common_1.Controller)('admin/payments'),
    __metadata("design:paramtypes", [admin_payments_service_1.AdminPaymentsService])
], AdminPaymentsController);
//# sourceMappingURL=admin-payments.controller.js.map