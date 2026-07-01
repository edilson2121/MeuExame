import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { CoursesModule } from './courses/courses.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ContentsModule } from './contents/contents.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ExamsModule } from './exams/exams.module';
import { ResultsModule } from './results/results.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    InstitutionsModule,
    CoursesModule,
    SubjectsModule,
    ContentsModule,
    ExercisesModule,
    ExamsModule,
    ResultsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}