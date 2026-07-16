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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.course.findMany({
            include: {
                institution: true,
                subjects: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async findByInstitution(institutionId) {
        return this.prisma.course.findMany({
            where: { institutionId },
            include: {
                subjects: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                institution: true,
                subjects: true,
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Curso não encontrado');
        }
        return course;
    }
    async create(createCourseDto) {
        await this.ensureInstitutionExists(createCourseDto.institutionId);
        return this.prisma.course.create({
            data: createCourseDto,
            include: { institution: true },
        });
    }
    async update(id, updateCourseDto) {
        await this.findOne(id);
        await this.ensureInstitutionExists(updateCourseDto.institutionId);
        return this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
            include: { institution: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.course.delete({
            where: { id },
        });
    }
    async ensureInstitutionExists(institutionId) {
        if (!institutionId) {
            return;
        }
        const institution = await this.prisma.institution.findUnique({
            where: { id: institutionId },
        });
        if (!institution) {
            throw new common_1.BadRequestException('Instituição não encontrada');
        }
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map