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
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExercisesService = class ExercisesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createExerciseDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: createExerciseDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const content = await this.prisma.content.findUnique({
            where: { id: createExerciseDto.contentId },
        });
        if (!content) {
            throw new common_1.NotFoundException('Conteúdo não encontrado');
        }
        return this.prisma.exercise.create({
            data: {
                title: createExerciseDto.title,
                body: createExerciseDto.body,
                userId: createExerciseDto.userId,
                contentId: createExerciseDto.contentId,
            },
        });
    }
    async findAll() {
        return this.prisma.exercise.findMany({
            include: {
                user: true,
                content: true,
                questions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const exercise = await this.prisma.exercise.findUnique({
            where: { id },
            include: {
                user: true,
                content: true,
                questions: true,
            },
        });
        if (!exercise) {
            throw new common_1.NotFoundException('Exercício não encontrado');
        }
        return exercise;
    }
    async findByContent(contentId) {
        return this.prisma.exercise.findMany({
            where: { contentId },
            include: {
                questions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async update(id, updateExerciseDto) {
        await this.findOne(id);
        if (updateExerciseDto.contentId) {
            const content = await this.prisma.content.findUnique({
                where: { id: updateExerciseDto.contentId },
            });
            if (!content) {
                throw new common_1.NotFoundException('Conteúdo não encontrado');
            }
        }
        return this.prisma.exercise.update({
            where: { id },
            data: updateExerciseDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.exercise.delete({
            where: { id },
        });
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map