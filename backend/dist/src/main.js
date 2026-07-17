"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const fs_1 = require("fs");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const custom_validation_pipe_1 = require("./common/pipes/custom-validation.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const uploadDir = process.env.UPLOAD_DIR || (0, path_1.join)(process.cwd(), 'uploads');
    if (!(0, fs_1.existsSync)(uploadDir)) {
        (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
    }
    app.useGlobalPipes(new custom_validation_pipe_1.CustomValidationPipe());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useStaticAssets(uploadDir, { prefix: '/uploads/' });
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log('Backend rodando em http://localhost:' + port + '/api');
}
bootstrap();
//# sourceMappingURL=main.js.map