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
exports.DynamicPagesController = void 0;
const common_1 = require("@nestjs/common");
const dynamic_pages_service_1 = require("./dynamic-pages.service");
const create_dynamic_page_dto_1 = require("./dto/create-dynamic-page.dto");
const update_dynamic_page_dto_1 = require("./dto/update-dynamic-page.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let DynamicPagesController = class DynamicPagesController {
    constructor(dynamicPagesService) {
        this.dynamicPagesService = dynamicPagesService;
    }
    findAll() {
        return this.dynamicPagesService.findAll();
    }
    findPublished() {
        return this.dynamicPagesService.findPublished();
    }
    findBySlug(slug) {
        return this.dynamicPagesService.findBySlug(slug);
    }
    findOne(id) {
        return this.dynamicPagesService.findOne(id);
    }
    create(createDynamicPageDto) {
        return this.dynamicPagesService.create(createDynamicPageDto);
    }
    update(id, updateDynamicPageDto) {
        return this.dynamicPagesService.update(id, updateDynamicPageDto);
    }
    remove(id) {
        return this.dynamicPagesService.remove(id);
    }
};
exports.DynamicPagesController = DynamicPagesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DynamicPagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('published'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DynamicPagesController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DynamicPagesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DynamicPagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dynamic_page_dto_1.CreateDynamicPageDto]),
    __metadata("design:returntype", void 0)
], DynamicPagesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dynamic_page_dto_1.UpdateDynamicPageDto]),
    __metadata("design:returntype", void 0)
], DynamicPagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DynamicPagesController.prototype, "remove", null);
exports.DynamicPagesController = DynamicPagesController = __decorate([
    (0, common_1.Controller)('dynamic-pages'),
    __metadata("design:paramtypes", [dynamic_pages_service_1.DynamicPagesService])
], DynamicPagesController);
//# sourceMappingURL=dynamic-pages.controller.js.map