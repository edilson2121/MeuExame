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
exports.ManualsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ManualsService = class ManualsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(subjectId, data) {
        const subject = await this.prisma.subject.findUnique({
            where: { id: subjectId },
        });
        if (!subject) {
            throw new common_1.NotFoundException('Disciplina não encontrada');
        }
        return this.prisma.manual.create({
            data: {
                title: data.title,
                description: data.description,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
                fileType: data.fileType || 'application/pdf',
                subjectId,
            },
            include: {
                subject: {
                    select: { id: true, name: true },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.manual.findMany({
            include: {
                subject: {
                    select: { id: true, name: true, institutionId: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findBySubject(subjectId) {
        return this.prisma.manual.findMany({
            where: {
                subjectId,
                isActive: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const manual = await this.prisma.manual.findUnique({
            where: { id },
            include: {
                subject: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!manual) {
            throw new common_1.NotFoundException('Manual não encontrado');
        }
        return manual;
    }
    async update(id, data) {
        const manual = await this.prisma.manual.findUnique({ where: { id } });
        if (!manual) {
            throw new common_1.NotFoundException('Manual não encontrado');
        }
        return this.prisma.manual.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                fileUrl: data.fileUrl,
                isActive: data.isActive,
            },
        });
    }
    async delete(id) {
        const manual = await this.prisma.manual.findUnique({ where: { id } });
        if (!manual) {
            throw new common_1.NotFoundException('Manual não encontrado');
        }
        return this.prisma.manual.delete({ where: { id } });
    }
    async toggleActive(id) {
        const manual = await this.prisma.manual.findUnique({ where: { id } });
        if (!manual) {
            throw new common_1.NotFoundException('Manual não encontrado');
        }
        return this.prisma.manual.update({
            where: { id },
            data: { isActive: !manual.isActive },
        });
    }
};
exports.ManualsService = ManualsService;
exports.ManualsService = ManualsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ManualsService);
//# sourceMappingURL=manuals.service.js.map