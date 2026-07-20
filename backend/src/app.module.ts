import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BackupModule } from './backup/backup.module';
import { ContentsModule } from './contents/contents.module';
import { CoursesModule } from './courses/courses.module';
import { DynamicPagesModule } from './dynamic-pages/dynamic-pages.module';
import { ExamsModule } from './exams/exams.module';
import { ExercisesModule } from './exercises/exercises.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { ManualsModule } from './manuals/manuals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PagesModule } from './pages/pages.module';
import { PaymentsModule } from './payments/payments.module';
import { PlansModule } from './plans/plans.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicPagesModule } from './public-pages/public-pages.module';
import { QuestionsModule } from './questions/questions.module';
import { ResultsModule } from './results/results.module';
import { SimulationsModule } from './modules/simulations/simulations.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { StatsModule } from './stats/stats.module';
import { StudyContentsModule } from './modules/study-contents/study-contents.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BackupModule,
    UsersModule,
    InstitutionsModule,
    CoursesModule,
    SubjectsModule,
    ContentsModule,
    ExercisesModule,
    QuestionsModule,
    ExamsModule,
    ResultsModule,
    SimulationsModule,
    StudyContentsModule,
    PagesModule,
    PublicPagesModule,
    AdminModule,
    PlansModule,
    PaymentsModule,
    SubscriptionsModule,
    DynamicPagesModule,
    UploadsModule,
    StatsModule,
    ManualsModule,
    NotificationsModule,
    SocialMediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}