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
exports.DynamicPagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let DynamicPagesService = class DynamicPagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDynamicPageDto) {
        return this.prisma.dynamicPage.create({
            data: createDynamicPageDto,
        });
    }
    async findAll() {
        return this.prisma.dynamicPage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPublished() {
        return this.prisma.dynamicPage.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findBySlug(slug) {
        const page = await this.prisma.dynamicPage.findUnique({
            where: { slug },
        });
        if (!page) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        if (!page.isPublished) {
            throw new common_1.NotFoundException('Página não publicada');
        }
        return page;
    }
    async findOne(id) {
        const page = await this.prisma.dynamicPage.findUnique({
            where: { id },
        });
        if (!page) {
            throw new common_1.NotFoundException('Página não encontrada');
        }
        return page;
    }
    async update(id, updateDynamicPageDto) {
        const page = await this.findOne(id);
        return this.prisma.dynamicPage.update({
            where: { id },
            data: updateDynamicPageDto,
        });
    }
    async remove(id) {
        const page = await this.findOne(id);
        return this.prisma.dynamicPage.delete({
            where: { id },
        });
    }
};
exports.DynamicPagesService = DynamicPagesService;
exports.DynamicPagesService = DynamicPagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DynamicPagesService);
//# sourceMappingURL=dynamic-pages.service.js.map