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
exports.AdminLayoutsController = void 0;
const common_1 = require("@nestjs/common");
const admin_layouts_service_1 = require("./admin-layouts.service");
const layout_template_dto_1 = require("./dto/layout-template.dto");
let AdminLayoutsController = class AdminLayoutsController {
    constructor(layoutsService) {
        this.layoutsService = layoutsService;
    }
    async create(dto) {
        return this.layoutsService.createLayout(dto);
    }
    async update(id, dto) {
        return this.layoutsService.updateLayout(id, dto);
    }
    async getById(id) {
        return this.layoutsService.getLayoutById(id);
    }
    async getAll(active = 'false') {
        const onlyActive = active === 'true';
        return this.layoutsService.getAllLayouts(onlyActive);
    }
    async delete(id) {
        await this.layoutsService.deleteLayout(id);
    }
};
exports.AdminLayoutsController = AdminLayoutsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [layout_template_dto_1.CreateLayoutTemplateDto]),
    __metadata("design:returntype", Promise)
], AdminLayoutsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, layout_template_dto_1.UpdateLayoutTemplateDto]),
    __metadata("design:returntype", Promise)
], AdminLayoutsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminLayoutsController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminLayoutsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminLayoutsController.prototype, "delete", null);
exports.AdminLayoutsController = AdminLayoutsController = __decorate([
    (0, common_1.Controller)('admin/layouts'),
    __metadata("design:paramtypes", [admin_layouts_service_1.AdminLayoutsService])
], AdminLayoutsController);
//# sourceMappingURL=admin-layouts.controller.js.map