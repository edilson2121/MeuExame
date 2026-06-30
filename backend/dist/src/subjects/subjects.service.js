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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let SubjectsService = class SubjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.subject.create({
            data,
            include: {
                course: {
                    include: {
                        institution: true,
                    },
                },
            },
        });
    }
    async findAll() {
        const subjects = await this.prisma.subject.findMany({
            include: {
                course: {
                    include: {
                        institution: true,
                    },
                },
            },
        });
        return subjects.map(subject => ({
            ...subject,
            _count: {
                contents: 0,
                exercises: 0,
                exams: 0,
            },
        }));
    }
    async findOne(id) {
        const subject = await this.prisma.subject.findUnique({
            where: { id },
            include: {
                course: {
                    include: {
                        institution: true,
                    },
                },
            },
        });
        if (!subject) {
            throw new common_1.NotFoundException('Disciplina não encontrada');
        }
        return subject;
    }
    async update(id, data) {
        const subject = await this.prisma.subject.findUnique({ where: { id } });
        if (!subject) {
            throw new common_1.NotFoundException('Disciplina não encontrada');
        }
        return this.prisma.subject.update({
            where: { id },
            data,
            include: {
                course: {
                    include: {
                        institution: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        const subject = await this.prisma.subject.findUnique({ where: { id } });
        if (!subject) {
            throw new common_1.NotFoundException('Disciplina não encontrada');
        }
        return this.prisma.subject.delete({ where: { id } });
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map