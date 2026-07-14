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
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PagesService = class PagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPageDto, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Apenas administradores podem criar p�ginas');
        }
        const existingPage = await this.prisma.page.findUnique({
            where: { slug: createPageDto.slug },
        });
        if (existingPage) {
            throw new common_1.NotFoundException('Slug j� est� em uso');
        }
        const pageData = {
            title: createPageDto.title,
            slug: createPageDto.slug,
            content: createPageDto.content,
            description: createPageDto.description,
            keywords: createPageDto.keywords,
            template: createPageDto.template || 'default',
            showInMenu: createPageDto.showInMenu || false,
            menuOrder: createPageDto.menuOrder || 0,
            status: createPageDto.status || 'DRAFT',
            authorId: userId,
        };
        if (createPageDto.status === 'PUBLISHED') {
            pageData.publishedAt = new Date();
        }
        const page = await this.prisma.page.create({
            data: pageData,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return page;
    }
    async findAll(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Apenas administradores podem listar todas as p�ginas');
        }
        return this.prisma.page.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneAdmin(id, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Apenas administradores podem visualizar esta p�gina');
        }
        const page = await this.prisma.page.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        if (!page) {
            throw new common_1.NotFoundException('P�gina n�o encontrada');
        }
        return page;
    }
    async update(id, updatePageDto, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Apenas administradores podem atualizar p�ginas');
        }
        const page = await this.prisma.page.findUnique({
            where: { id },
        });
        if (!page) {
            throw new common_1.NotFoundException('P�gina n�o encontrada');
        }
        if (updatePageDto.slug && updatePageDto.slug !== page.slug) {
            const existingPage = await this.prisma.page.findUnique({
                where: { slug: updatePageDto.slug },
            });
            if (existingPage) {
                throw new common_1.NotFoundException('Slug j� est� em uso');
            }
        }
        const updateData = {
            title: updatePageDto.title,
            slug: updatePageDto.slug,
            content: updatePageDto.content,
            description: updatePageDto.description,
            keywords: updatePageDto.keywords,
            template: updatePageDto.template,
            showInMenu: updatePageDto.showInMenu,
            menuOrder: updatePageDto.menuOrder,
            status: updatePageDto.status,
        };
        if (updatePageDto.status === 'PUBLISHED' && page.status !== 'PUBLISHED') {
            updateData.publishedAt = new Date();
        }
        return this.prisma.page.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async publish(id, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Apenas administradores podem publicar p�ginas');
        }
        const page = await this.prisma.page.findUnique({
            where: { id },
        });
        if (!page) {
            throw new common_1.NotFoundException('P�gina n�o encontrada');
        }
        return this.prisma.page.update({
            where: { id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
            },
        });
    }
    async archive(id, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Apenas administradores podem arquivar p�ginas');
        }
        const page = await this.prisma.page.findUnique({
            where: { id },
        });
        if (!page) {
            throw new common_1.NotFoundException('P�gina n�o encontrada');
        }
        return this.prisma.page.update({
            where: { id },
            data: {
                status: 'ARCHIVED',
            },
        });
    }
    async remove(id, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Apenas administradores podem remover p�ginas');
        }
        const page = await this.prisma.page.findUnique({
            where: { id },
        });
        if (!page) {
            throw new common_1.NotFoundException('P�gina n�o encontrada');
        }
        return this.prisma.page.delete({
            where: { id },
        });
    }
    async findBySlug(slug) {
        const page = await this.prisma.page.findFirst({
            where: {
                slug,
                status: 'PUBLISHED',
            },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!page) {
            throw new common_1.NotFoundException('P�gina n�o encontrada ou n�o publicada');
        }
        return page;
    }
    async findPublishedMenu() {
        console.warn('findPublishedMenu: Retornando array vazio temporariamente');
        return [];
    }
    async findPublished() {
        return this.prisma.page.findMany({
            where: {
                status: 'PUBLISHED',
            },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                publishedAt: true,
                user: {
                    select: { name: true },
                },
            },
            orderBy: { publishedAt: 'desc' },
        });
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagesService);
//# sourceMappingURL=pages.service.js.map