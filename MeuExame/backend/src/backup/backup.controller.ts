import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class BackupController {
  constructor(private backupService: BackupService) {}

  @Post('manual')
  async createManualBackup() {
    const backupPath = await this.backupService.createManualBackup();
    return { success: true, path: backupPath };
  }

  @Get('list')
  async listBackups() {
    return this.backupService.listBackups();
  }

  @Post('restore')
  async restoreBackup(@Body() body: { fileName: string }) {
    await this.backupService.restoreBackup(body.fileName);
    return { success: true };
  }
}
