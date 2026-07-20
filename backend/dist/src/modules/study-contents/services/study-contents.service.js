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
exports.StudyContentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let StudyContentsService = class StudyContentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudyContentDto) {
        return this.prisma.studyContent.create({
            data: createStudyContentDto,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                subject: true,
            },
        });
    }
    async findAll() {
        return this.prisma.studyContent.findMany({
            where: {
                isPublished: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                subject: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const content = await this.prisma.studyContent.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                subject: true,
            },
        });
        if (!content) {
            throw new common_1.NotFoundException('Conteúdo não encontrado');
        }
        return content;
    }
    async update(id, updateStudyContentDto) {
        return this.prisma.studyContent.update({
            where: { id },
            data: updateStudyContentDto,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                subject: true,
            },
        });
    }
    async remove(id) {
        return this.prisma.studyContent.delete({
            where: { id },
        });
    }
    async findBySubject(subjectId) {
        return this.prisma.studyContent.findMany({
            where: {
                subjectId,
                isPublished: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                subject: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findByAuthor(authorId) {
        return this.prisma.studyContent.findMany({
            where: { authorId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                subject: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async publishContent(id) {
        return this.prisma.studyContent.update({
            where: { id },
            data: { isPublished: true },
        });
    }
    async incrementViews(id) {
        const content = await this.findOne(id);
        return this.prisma.studyContent.update({
            where: { id },
            data: {
                views: content.views + 1,
            },
        });
    }
    async incrementLikes(id) {
        const content = await this.findOne(id);
        return this.prisma.studyContent.update({
            where: { id },
            data: {
                likes: content.likes + 1,
            },
        });
    }
};
exports.StudyContentsService = StudyContentsService;
exports.StudyContentsService = StudyContentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudyContentsService);
//# sourceMappingURL=study-contents.service.js.map