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
exports.ContentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContentsService = class ContentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createContentDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: createContentDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return this.prisma.content.create({
            data: {
                title: createContentDto.title,
                body: createContentDto.body,
                userId: createContentDto.userId,
            },
        });
    }
    async findAll() {
        return this.prisma.content.findMany({
            include: {
                user: true,
                exercises: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const content = await this.prisma.content.findUnique({
            where: { id },
            include: {
                user: true,
                exercises: {
                    include: {
                        questions: true,
                    },
                },
            },
        });
        if (!content) {
            throw new common_1.NotFoundException('Conteúdo não encontrado');
        }
        return content;
    }
    async findByUser(userId) {
        return this.prisma.content.findMany({
            where: { userId },
            include: {
                exercises: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async update(id, updateContentDto) {
        await this.findOne(id);
        return this.prisma.content.update({
            where: { id },
            data: updateContentDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.content.delete({
            where: { id },
        });
    }
};
exports.ContentsService = ContentsService;
exports.ContentsService = ContentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentsService);
//# sourceMappingURL=contents.service.js.map