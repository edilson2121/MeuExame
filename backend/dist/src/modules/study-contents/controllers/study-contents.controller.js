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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyContentsController = void 0;
const common_1 = require("@nestjs/common");
const study_contents_service_1 = require("../services/study-contents.service");
const create_study_content_dto_1 = require("../dto/create-study-content.dto");
const update_study_content_dto_1 = require("../dto/update-study-content.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let StudyContentsController = class StudyContentsController {
    constructor(studyContentsService) {
        this.studyContentsService = studyContentsService;
    }
    create(createStudyContentDto) {
        return this.studyContentsService.create(createStudyContentDto);
    }
    findAll() {
        return this.studyContentsService.findAll();
    }
    findOne(id) {
        return this.studyContentsService.findOne(id);
    }
    findBySubject(subjectId) {
        return this.studyContentsService.findBySubject(subjectId);
    }
    findByAuthor(authorId) {
        return this.studyContentsService.findByAuthor(authorId);
    }
    update(id, updateStudyContentDto) {
        return this.studyContentsService.update(id, updateStudyContentDto);
    }
    remove(id) {
        return this.studyContentsService.remove(id);
    }
    publish(id) {
        return this.studyContentsService.publishContent(id);
    }
    incrementViews(id) {
        return this.studyContentsService.incrementViews(id);
    }
    incrementLikes(id) {
        return this.studyContentsService.incrementLikes(id);
    }
};
exports.StudyContentsController = StudyContentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_study_content_dto_1.CreateStudyContentDto]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('subject/:subjectId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "findBySubject", null);
__decorate([
    (0, common_1.Get)('author/:authorId'),
    __param(0, (0, common_1.Param)('authorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "findByAuthor", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_study_content_dto_1.UpdateStudyContentDto]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/views'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "incrementViews", null);
__decorate([
    (0, common_1.Post)(':id/likes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyContentsController.prototype, "incrementLikes", null);
exports.StudyContentsController = StudyContentsController = __decorate([
    (0, common_1.Controller)('study-contents'),
    __metadata("design:paramtypes", [study_contents_service_1.StudyContentsService])
], StudyContentsController);
//# sourceMappingURL=study-contents.controller.js.map