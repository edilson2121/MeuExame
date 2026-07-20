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
exports.SimulationsController = void 0;
const common_1 = require("@nestjs/common");
const simulations_service_1 = require("../services/simulations.service");
const create_simulation_dto_1 = require("../dto/create-simulation.dto");
const update_simulation_dto_1 = require("../dto/update-simulation.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SimulationsController = class SimulationsController {
    constructor(simulationsService) {
        this.simulationsService = simulationsService;
    }
    create(createSimulationDto) {
        return this.simulationsService.create(createSimulationDto);
    }
    findAll() {
        return this.simulationsService.findAll();
    }
    findOne(id) {
        return this.simulationsService.findOne(id);
    }
    findByUser(userId) {
        return this.simulationsService.findByUser(userId);
    }
    findByExam(examId) {
        return this.simulationsService.findByExam(examId);
    }
    startSimulation(examId, body) {
        return this.simulationsService.startSimulation(examId, body.userId);
    }
    completeSimulation(id, body) {
        return this.simulationsService.completeSimulation(id, body.answers);
    }
    update(id, updateSimulationDto) {
        return this.simulationsService.update(id, updateSimulationDto);
    }
    remove(id) {
        return this.simulationsService.remove(id);
    }
};
exports.SimulationsController = SimulationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_simulation_dto_1.CreateSimulationDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('exam/:examId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "findByExam", null);
__decorate([
    (0, common_1.Post)('start/:examId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('examId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "startSimulation", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "completeSimulation", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_simulation_dto_1.UpdateSimulationDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "remove", null);
exports.SimulationsController = SimulationsController = __decorate([
    (0, common_1.Controller)('simulations'),
    __metadata("design:paramtypes", [simulations_service_1.SimulationsService])
], SimulationsController);
//# sourceMappingURL=simulations.controller.js.map