import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { MaterialsModule } from './materials/materials.module';
import { AdminModule } from './admin/admin.module';
import { PagesModule } from './pages/pages.module';
import { UploadsModule } from './uploads/uploads.module';
import { BackupModule } from './backup/backup.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PaymentsModule,
    MaterialsModule,
    AdminModule,
    PagesModule,
    UploadsModule,
    BackupModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
