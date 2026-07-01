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
const users_module_1 = require("./users/users.module");
const institutions_module_1 = require("./institutions/institutions.module");
const courses_module_1 = require("./courses/courses.module");
const subjects_module_1 = require("./subjects/subjects.module");
const contents_module_1 = require("./contents/contents.module");
const exercises_module_1 = require("./exercises/exercises.module");
const exams_module_1 = require("./exams/exams.module");
const results_module_1 = require("./results/results.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            users_module_1.UsersModule,
            institutions_module_1.InstitutionsModule,
            courses_module_1.CoursesModule,
            subjects_module_1.SubjectsModule,
            contents_module_1.ContentsModule,
            exercises_module_1.ExercisesModule,
            exams_module_1.ExamsModule,
            results_module_1.ResultsModule,
            auth_module_1.AuthModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map