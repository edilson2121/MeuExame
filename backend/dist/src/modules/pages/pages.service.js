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
const prisma_service_1 = require("../../prisma/prisma.service");
let PagesService = class PagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPage(userId, data) {
        const slug = data.slug || this.generateSlug(data.title);
        const payload = {
            title: data.title,
            slug: slug,
            content: data.content || '',
            description: data.description,
            keywords: data.keywords,
            showInMenu: data.showInMenu || false,
            status: data.status ? data.status.toUpperCase() : 'DRAFT',
            authorId: userId,
        };
        return this.prisma.page.create({ data: payload });
    }
    async findAll() {
        return this.prisma.page.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        });
    }
    async findOne(id) {
        return this.prisma.page.findUnique({
            where: { id },
            include: { sections: { orderBy: { sortOrder: 'asc' } } },
        });
    }
    async findBySlug(slug) {
        return this.prisma.page.findFirst({
            where: { slug, status: 'PUBLISHED' },
            include: { sections: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
        });
    }
    async update(id, data) {
        const payload = { ...data };
        if (payload.status)
            payload.status = payload.status.toUpperCase();
        return this.prisma.page.update({ where: { id }, data: payload });
    }
    async delete(id) {
        return this.prisma.page.delete({ where: { id } });
    }
    async publish(id) {
        return this.prisma.page.update({
            where: { id },
            data: { status: 'PUBLISHED', publishedAt: new Date() },
        });
    }
    async getMenuPages() {
        return this.prisma.page.findMany({
            where: { status: 'PUBLISHED', showInMenu: true },
            select: { id: true, title: true, slug: true, menuOrder: true },
            orderBy: { menuOrder: 'asc' },
        });
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagesService);
//# sourceMappingURL=pages.service.js.map