"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicPagesModule = void 0;
const common_1 = require("@nestjs/common");
const dynamic_pages_service_1 = require("./dynamic-pages.service");
const dynamic_pages_controller_1 = require("./dynamic-pages.controller");
const prisma_service_1 = require("../database/prisma.service");
let DynamicPagesModule = class DynamicPagesModule {
};
exports.DynamicPagesModule = DynamicPagesModule;
exports.DynamicPagesModule = DynamicPagesModule = __decorate([
    (0, common_1.Module)({
        controllers: [dynamic_pages_controller_1.DynamicPagesController],
        providers: [dynamic_pages_service_1.DynamicPagesService, prisma_service_1.PrismaService],
        exports: [dynamic_pages_service_1.DynamicPagesService],
    })
], DynamicPagesModule);
//# sourceMappingURL=dynamic-pages.module.js.map