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
exports.PublicPagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let PublicPagesService = class PublicPagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublishedPagesByInstitution(institutionId) {
        return this.prisma.institutionPage.findMany({
            where: {
                institutionId,
                status: client_1.PublishStatus.PUBLISHED,
                isActive: true,
            },
            include: {
                layout: true,
                institution: true,
            },
            orderBy: { menuOrder: 'asc' },
        });
    }
    async getPublishedPageBySlug(slug, institutionId) {
        const page = await this.prisma.institutionPage.findUnique({
            where: {
                institutionId_slug: {
                    institutionId,
                    slug,
                },
            },
            include: {
                layout: true,
                institution: true,
            },
        });
        if (!page) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        if (page.status !== client_1.PublishStatus.PUBLISHED || !page.isActive) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        return page;
    }
    async getPublicMenu(institutionId) {
        return this.prisma.institutionPage.findMany({
            where: {
                institutionId,
                status: client_1.PublishStatus.PUBLISHED,
                showInMenu: true,
                isActive: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                menuOrder: true,
            },
            orderBy: { menuOrder: 'asc' },
        });
    }
};
exports.PublicPagesService = PublicPagesService;
exports.PublicPagesService = PublicPagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicPagesService);
//# sourceMappingURL=public-pages.service.js.map