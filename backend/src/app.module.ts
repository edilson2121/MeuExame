import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { CoursesModule } from './courses/courses.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './modules/pages/pages.module';
import { AdminModule } from './admin/admin.module';
import { PublicPagesModule } from './public-pages/public-pages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    InstitutionsModule,
    CoursesModule,
    SubjectsModule,
    AuthModule,
    PagesModule,
    AdminModule,
    PublicPagesModule,
  ],
})
export class AppModule {}
