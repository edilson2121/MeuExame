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
exports.AdminLayoutsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AdminLayoutsService = class AdminLayoutsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLayout(dto) {
        const existing = await this.prisma.layoutTemplate.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.BadRequestException('Já existe um layout com este nome');
        }
        return this.prisma.layoutTemplate.create({
            data: {
                name: dto.name,
                description: dto.description,
                html: dto.html,
                css: dto.css,
                thumbnail: dto.thumbnail,
                config: dto.config,
            },
        });
    }
    async updateLayout(layoutId, dto) {
        const layout = await this.prisma.layoutTemplate.findUnique({
            where: { id: layoutId },
        });
        if (!layout) {
            throw new common_1.NotFoundException('Layout não encontrado');
        }
        if (dto.name && dto.name !== layout.name) {
            const existing = await this.prisma.layoutTemplate.findUnique({
                where: { name: dto.name },
            });
            if (existing) {
                throw new common_1.BadRequestException('Já existe um layout com este nome');
            }
        }
        return this.prisma.layoutTemplate.update({
            where: { id: layoutId },
            data: {
                name: dto.name,
                description: dto.description,
                html: dto.html,
                css: dto.css,
                thumbnail: dto.thumbnail,
                config: dto.config,
                isActive: dto.isActive,
            },
        });
    }
    async getLayoutById(layoutId) {
        const layout = await this.prisma.layoutTemplate.findUnique({
            where: { id: layoutId },
        });
        if (!layout) {
            throw new common_1.NotFoundException('Layout não encontrado');
        }
        return layout;
    }
    async getAllLayouts(onlyActive = false) {
        return this.prisma.layoutTemplate.findMany({
            where: onlyActive ? { isActive: true } : {},
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteLayout(layoutId) {
        const layout = await this.prisma.layoutTemplate.findUnique({
            where: { id: layoutId },
            include: { pages: true },
        });
        if (!layout) {
            throw new common_1.NotFoundException('Layout não encontrado');
        }
        if (layout.pages && layout.pages.length > 0) {
            throw new common_1.BadRequestException('Não é possível deletar um layout que está sendo utilizado por páginas');
        }
        return this.prisma.layoutTemplate.delete({
            where: { id: layoutId },
        });
    }
};
exports.AdminLayoutsService = AdminLayoutsService;
exports.AdminLayoutsService = AdminLayoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminLayoutsService);
//# sourceMappingURL=admin-layouts.service.js.map