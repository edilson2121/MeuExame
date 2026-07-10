import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { CoursesModule } from './courses/courses.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ContentsModule } from './contents/contents.module';
import { ExercisesModule } from './exercises/exercises.module';
import { QuestionsModule } from './questions/questions.module';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    InstitutionsModule,
    CoursesModule,
    SubjectsModule,
    ContentsModule,
    ExercisesModule,
    QuestionsModule,
    AuthModule,
    PagesModule,
  ],
})
export class AppModule {}
