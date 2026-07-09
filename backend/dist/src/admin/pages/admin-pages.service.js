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
exports.AdminPagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let AdminPagesService = class AdminPagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPage(dto) {
        const institution = await this.prisma.institution.findUnique({
            where: { id: dto.institutionId },
        });
        if (!institution) {
            throw new common_1.NotFoundException('Instituição não encontrada');
        }
        const layout = await this.prisma.layoutTemplate.findUnique({
            where: { id: dto.layoutId },
        });
        if (!layout) {
            throw new common_1.NotFoundException('Layout não encontrado');
        }
        const existingPage = await this.prisma.institutionPage.findUnique({
            where: {
                institutionId_slug: {
                    institutionId: dto.institutionId,
                    slug: dto.slug,
                },
            },
        });
        if (existingPage) {
            throw new common_1.BadRequestException('Já existe uma página com este slug nesta instituição');
        }
        return this.prisma.institutionPage.create({
            data: {
                institutionId: dto.institutionId,
                title: dto.title,
                slug: dto.slug,
                description: dto.description,
                content: dto.content,
                layoutId: dto.layoutId,
                settings: dto.settings,
                showInMenu: dto.showInMenu ?? false,
                menuOrder: dto.menuOrder ?? 0,
                seoTitle: dto.seoTitle,
                seoKeywords: dto.seoKeywords,
            },
            include: {
                layout: true,
                institution: true,
            },
        });
    }
    async updatePage(pageId, dto) {
        const page = await this.prisma.institutionPage.findUnique({
            where: { id: pageId },
        });
        if (!page) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        if (dto.slug && dto.slug !== page.slug) {
            const existing = await this.prisma.institutionPage.findUnique({
                where: {
                    institutionId_slug: {
                        institutionId: page.institutionId,
                        slug: dto.slug,
                    },
                },
            });
            if (existing) {
                throw new common_1.BadRequestException('Já existe uma página com este slug nesta instituição');
            }
        }
        if (dto.layoutId && dto.layoutId !== page.layoutId) {
            const layout = await this.prisma.layoutTemplate.findUnique({
                where: { id: dto.layoutId },
            });
            if (!layout) {
                throw new common_1.NotFoundException('Layout não encontrado');
            }
        }
        return this.prisma.institutionPage.update({
            where: { id: pageId },
            data: {
                title: dto.title,
                slug: dto.slug,
                description: dto.description,
                content: dto.content,
                layoutId: dto.layoutId,
                settings: dto.settings,
                status: dto.status,
                showInMenu: dto.showInMenu,
                menuOrder: dto.menuOrder,
                seoTitle: dto.seoTitle,
                seoKeywords: dto.seoKeywords,
            },
            include: {
                layout: true,
                institution: true,
            },
        });
    }
    async publishPage(pageId, dto) {
        const page = await this.prisma.institutionPage.findUnique({
            where: { id: pageId },
        });
        if (!page) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        const newStatus = dto.publish ? client_1.PublishStatus.PUBLISHED : client_1.PublishStatus.DRAFT;
        return this.prisma.institutionPage.update({
            where: { id: pageId },
            data: {
                status: newStatus,
                publishedAt: dto.publish ? new Date() : null,
            },
            include: {
                layout: true,
                institution: true,
            },
        });
    }
    async getPagesByInstitution(institutionId, onlyPublished = false) {
        const whereClause = { institutionId };
        if (onlyPublished) {
            whereClause.status = client_1.PublishStatus.PUBLISHED;
        }
        return this.prisma.institutionPage.findMany({
            where: whereClause,
            include: {
                layout: true,
                institution: true,
            },
            orderBy: { menuOrder: 'asc' },
        });
    }
    async getPageById(pageId) {
        const page = await this.prisma.institutionPage.findUnique({
            where: { id: pageId },
            include: {
                layout: true,
                institution: true,
            },
        });
        if (!page) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        return page;
    }
    async deletePage(pageId) {
        const page = await this.prisma.institutionPage.findUnique({
            where: { id: pageId },
        });
        if (!page) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        return this.prisma.institutionPage.delete({
            where: { id: pageId },
        });
    }
    async getPageBySlug(slug, institutionId) {
        return this.prisma.institutionPage.findUnique({
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
    }
};
exports.AdminPagesService = AdminPagesService;
exports.AdminPagesService = AdminPagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminPagesService);
//# sourceMappingURL=admin-pages.service.js.map