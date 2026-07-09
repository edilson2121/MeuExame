"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_pages_service_1 = require("./pages/admin-pages.service");
const admin_pages_controller_1 = require("./pages/admin-pages.controller");
const admin_payments_service_1 = require("./payments/admin-payments.service");
const admin_payments_controller_1 = require("./payments/admin-payments.controller");
const admin_layouts_service_1 = require("./layouts/admin-layouts.service");
const admin_layouts_controller_1 = require("./layouts/admin-layouts.controller");
const prisma_service_1 = require("../database/prisma.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_pages_controller_1.AdminPagesController, admin_payments_controller_1.AdminPaymentsController, admin_layouts_controller_1.AdminLayoutsController],
        providers: [admin_pages_service_1.AdminPagesService, admin_payments_service_1.AdminPaymentsService, admin_layouts_service_1.AdminLayoutsService, prisma_service_1.PrismaService],
        exports: [admin_pages_service_1.AdminPagesService, admin_payments_service_1.AdminPaymentsService, admin_layouts_service_1.AdminLayoutsService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map