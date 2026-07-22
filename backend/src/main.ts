import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });
  
  // CORS configurável para produção
  const corsOrigins = process.env.CORS_ORIGIN || '*';
  const allowedOrigins = corsOrigins.split(',').map(o => o.trim());
  
  app.enableCors({
    origin: allowedOrigins.length === 1 && allowedOrigins[0] === '*' 
      ? true 
      : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });
  
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend running on http://0.0.0.0:${port}/api`);
  console.log(`📊 Health check: http://0.0.0.0:${port}/api/health`);
}

bootstrap();
