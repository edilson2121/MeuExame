import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { PaymentsModule } from './payments/payments.module';
import { PagesModule } from './pages/pages.module';
import { PlansModule } from './plans/plans.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicPagesModule } from './public-pages/public-pages.module';
import { ResultsModule } from './results/results.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './common/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    InstitutionsModule,
    SubjectsModule,
    ExamsModule,
    QuestionsModule,
    PaymentsModule,
    PagesModule,
    PublicPagesModule,
    AdminModule,
    PlansModule,
    ResultsModule,
    UploadsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}