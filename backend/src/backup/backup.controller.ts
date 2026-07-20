import { Controller, Get, Post, Delete, Param, UseGuards, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getStatus() {
    const [backups, config, connection] = await Promise.all([
      this.backupService.listBackups(),
      Promise.resolve(this.backupService.getConfig()),
      this.backupService.testConnection(),
    ]);

    return {
      connected: connection.connected,
      latency: connection.latency,
      backupCount: backups.length,
      config,
      lastBackup: backups[0] || null,
    };
  }

  @Get('test-connection')
  @Public()
  async testConnection() {
    return this.backupService.testConnection();
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async listBackups() {
    return this.backupService.listBackups();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createBackup() {
    return this.backupService.createBackup();
  }

  @Get('download/:filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async downloadBackup(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const filepath = this.backupService.getBackupPath(filename);
      const file = createReadStream(filepath);
      
      res.set({
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      });

      return new StreamableFile(file);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  @Post('restore/:filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async restoreBackup(@Param('filename') filename: string) {
    return this.backupService.restoreBackup(filename);
  }

  @Delete(':filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteBackup(@Param('filename') filename: string) {
    await this.backupService.deleteBackup(filename);
    return { success: true, message: 'Backup deleted' };
  }

  @Post('scheduler/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  startScheduler() {
    this.backupService.startBackupScheduler();
    return { success: true, message: 'Backup scheduler started' };
  }

  @Post('scheduler/stop')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  stopScheduler() {
    this.backupService.stopBackupScheduler();
    return { success: true, message: 'Backup scheduler stopped' };
  }
}
