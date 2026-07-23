"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_module_1 = require("./admin/admin.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const institutions_module_1 = require("./institutions/institutions.module");
const subjects_module_1 = require("./subjects/subjects.module");
const exams_module_1 = require("./exams/exams.module");
const questions_module_1 = require("./questions/questions.module");
const payments_module_1 = require("./payments/payments.module");
const pages_module_1 = require("./pages/pages.module");
const plans_module_1 = require("./plans/plans.module");
const prisma_module_1 = require("./prisma/prisma.module");
const public_pages_module_1 = require("./public-pages/public-pages.module");
const results_module_1 = require("./results/results.module");
const uploads_module_1 = require("./uploads/uploads.module");
const users_module_1 = require("./users/users.module");
const health_module_1 = require("./common/health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            institutions_module_1.InstitutionsModule,
            subjects_module_1.SubjectsModule,
            exams_module_1.ExamsModule,
            questions_module_1.QuestionsModule,
            payments_module_1.PaymentsModule,
            pages_module_1.PagesModule,
            public_pages_module_1.PublicPagesModule,
            admin_module_1.AdminModule,
            plans_module_1.PlansModule,
            results_module_1.ResultsModule,
            uploads_module_1.UploadsModule,
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map