import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = './backups';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyBackup() {
    this.logger.log('Starting daily database backup...');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `backup-${timestamp}.sql`;
      const filePath = path.join(this.backupDir, fileName);
      
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      
      // Use pg_dump for PostgreSQL backup
      const command = `pg_dump "${databaseUrl}" > "${filePath}"`;
      
      await execAsync(command);
      
      // Compress the backup
      const compressedPath = `${filePath}.gz`;
      await execAsync(`gzip "${filePath}"`);
      
      this.logger.log(`Backup completed successfully: ${compressedPath}`);
      
      // Clean old backups (keep last 7 days)
      await this.cleanOldBackups();
      
    } catch (error) {
      this.logger.error('Backup failed:', error);
    }
  }

  private async cleanOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backupFiles = files
        .filter(f => f.startsWith('backup-') && f.endsWith('.sql.gz'))
        .sort()
        .reverse(); // Newest first
      
      // Keep only last 7 backups
      const filesToDelete = backupFiles.slice(7);
      
      for (const file of filesToDelete) {
        const filePath = path.join(this.backupDir, file);
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted old backup: ${file}`);
      }
      
    } catch (error) {
      this.logger.error('Error cleaning old backups:', error);
    }
  }

  async createManualBackup(): Promise<string> {
    this.logger.log('Starting manual database backup...');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `manual-backup-${timestamp}.sql`;
      const filePath = path.join(this.backupDir, fileName);
      
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      
      const command = `pg_dump "${databaseUrl}" > "${filePath}"`;
      
      await execAsync(command);
      
      const compressedPath = `${filePath}.gz`;
      await execAsync(`gzip "${filePath}"`);
      
      this.logger.log(`Manual backup completed: ${compressedPath}`);
      
      return compressedPath;
      
    } catch (error) {
      this.logger.error('Manual backup failed:', error);
      throw error;
    }
  }

  async listBackups() {
    try {
      const files = fs.readdirSync(this.backupDir);
      return files
        .filter(f => f.endsWith('.sql.gz'))
        .map(f => ({
          name: f,
          size: fs.statSync(path.join(this.backupDir, f)).size,
          createdAt: fs.statSync(path.join(this.backupDir, f)).birthtime,
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
    } catch (error) {
      this.logger.error('Error listing backups:', error);
      return [];
    }
  }

  async restoreBackup(fileName: string) {
    this.logger.log(`Starting restore from backup: ${fileName}`);
    
    try {
      const filePath = path.join(this.backupDir, fileName);
      
      if (!fs.existsSync(filePath)) {
        throw new Error('Backup file not found');
      }
      
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      
      // Decompress and restore
      const tempPath = filePath.replace('.gz', '');
      await execAsync(`gunzip -c "${filePath}" > "${tempPath}"`);
      
      await execAsync(`psql "${databaseUrl}" < "${tempPath}"`);
      
      // Clean up temp file
      fs.unlinkSync(tempPath);
      
      this.logger.log(`Restore completed successfully from: ${fileName}`);
      
    } catch (error) {
      this.logger.error('Restore failed:', error);
      throw error;
    }
  }
}
