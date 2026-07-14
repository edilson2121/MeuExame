import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContentsModule } from './contents/contents.module';
import { CoursesModule } from './courses/courses.module';
import { ExamsModule } from './exams/exams.module';
import { ExercisesModule } from './exercises/exercises.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { PagesModule } from './pages/pages.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicPagesModule } from './public-pages/public-pages.module';
import { QuestionsModule } from './questions/questions.module';
import { ResultsModule } from './results/results.module';
import { StatsModule } from './stats/stats.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    InstitutionsModule,
    CoursesModule,
    SubjectsModule,
    ContentsModule,
    ExercisesModule,
    QuestionsModule,
    ExamsModule,
    ResultsModule,
    PagesModule,
    PublicPagesModule,
    AdminModule,
    UploadsModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
