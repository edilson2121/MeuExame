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
exports.AdminPagesController = void 0;
const common_1 = require("@nestjs/common");
const admin_pages_service_1 = require("./admin-pages.service");
const institution_page_dto_1 = require("./dto/institution-page.dto");
let AdminPagesController = class AdminPagesController {
    constructor(pagesService) {
        this.pagesService = pagesService;
    }
    async create(dto) {
        return this.pagesService.createPage(dto);
    }
    async update(id, dto) {
        return this.pagesService.updatePage(id, dto);
    }
    async publish(id, dto) {
        return this.pagesService.publishPage(id, dto);
    }
    async getByInstitution(institutionId) {
        return this.pagesService.getPagesByInstitution(institutionId, false);
    }
    async getPublishedByInstitution(institutionId) {
        return this.pagesService.getPagesByInstitution(institutionId, true);
    }
    async getById(id) {
        return this.pagesService.getPageById(id);
    }
    async delete(id) {
        await this.pagesService.deletePage(id);
    }
};
exports.AdminPagesController = AdminPagesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [institution_page_dto_1.CreateInstitutionPageDto]),
    __metadata("design:returntype", Promise)
], AdminPagesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, institution_page_dto_1.UpdateInstitutionPageDto]),
    __metadata("design:returntype", Promise)
], AdminPagesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, institution_page_dto_1.PublishInstitutionPageDto]),
    __metadata("design:returntype", Promise)
], AdminPagesController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)('institution/:institutionId'),
    __param(0, (0, common_1.Param)('institutionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPagesController.prototype, "getByInstitution", null);
__decorate([
    (0, common_1.Get)('institution/:institutionId/published'),
    __param(0, (0, common_1.Param)('institutionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPagesController.prototype, "getPublishedByInstitution", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPagesController.prototype, "getById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPagesController.prototype, "delete", null);
exports.AdminPagesController = AdminPagesController = __decorate([
    (0, common_1.Controller)('admin/pages'),
    __metadata("design:paramtypes", [admin_pages_service_1.AdminPagesService])
], AdminPagesController);
//# sourceMappingURL=admin-pages.controller.js.map