import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { existsSync, mkdirSync, writeFileSync, readdirSync, unlinkSync, readFileSync, createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as bcrypt from 'bcryptjs';

const execAsync = promisify(exec);

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  type: 'FULL' | 'INCREMENTAL';
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
  checksum?: string;
  tables?: string[];
  recordsCount?: Record<string, number>;
}

export interface BackupConfig {
  maxBackups: number;
  backupPath: string;
  schedule: string; // cron expression
  compress: boolean;
  includeUsers: boolean;
  includeExams: boolean;
  includePayments: boolean;
  includeAll: boolean;
}

@Injectable()
export class BackupService implements OnModuleInit {
  private readonly logger = new Logger(BackupService.name);
  private backupPath: string;
  private config: BackupConfig;
  private backupCronJob: NodeJS.Timeout | null = null;

  constructor(private prisma: PrismaService) {
    this.backupPath = process.env.BACKUP_PATH || './backups';
    this.config = {
      maxBackups: parseInt(process.env.MAX_BACKUPS || '7'),
      backupPath: this.backupPath,
      schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
      compress: process.env.COMPRESS_BACKUPS !== 'false',
      includeAll: true,
      includeUsers: true,
      includeExams: true,
      includePayments: true,
    };
  }

  async onModuleInit() {
    this.ensureBackupDirectory();
    await this.cleanOldBackups();
    
    // Auto-start backup scheduler in production
    if (process.env.NODE_ENV === 'production') {
      this.startBackupScheduler();
    }
  }

  private ensureBackupDirectory(): void {
    if (!existsSync(this.backupPath)) {
      mkdirSync(this.backupPath, { recursive: true });
      this.logger.log(`Backup directory created: ${this.backupPath}`);
    }
  }

  /**
   * Start automatic backup scheduler
   */
  startBackupScheduler(): void {
    if (this.backupCronJob) {
      this.logger.warn('Backup scheduler already running');
      return;
    }

    this.logger.log(`Starting backup scheduler with schedule: ${this.config.schedule}`);
    
    // Simple cron-like scheduler (for production use @nestjs/schedule)
    const scheduleParts = this.config.schedule.split(' ');
    const [minute, hour] = scheduleParts;
    
    const checkAndRun = async () => {
      const now = new Date();
      const currentMinute = now.getMinutes();
      const currentHour = now.getHours();
      
      if (currentMinute === parseInt(minute) && currentHour === parseInt(hour)) {
        this.logger.log('Scheduled backup triggered');
        try {
          await this.createBackup();
        } catch (error) {
          this.logger.error('Scheduled backup failed:', error);
        }
      }
    };

    // Check every minute
    this.backupCronJob = setInterval(checkAndRun, 60000);
    this.logger.log('Backup scheduler started');
  }

  /**
   * Stop automatic backup scheduler
   */
  stopBackupScheduler(): void {
    if (this.backupCronJob) {
      clearInterval(this.backupCronJob);
      this.backupCronJob = null;
      this.logger.log('Backup scheduler stopped');
    }
  }

  /**
   * Create a new backup
   */
  async createBackup(): Promise<BackupInfo> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json`;
    const filepath = join(this.backupPath, filename);

    const backupInfo: BackupInfo = {
      id: `backup-${Date.now()}`,
      filename,
      size: 0,
      createdAt: new Date(),
      type: 'FULL',
      status: 'IN_PROGRESS',
      tables: [],
      recordsCount: {},
    };

    try {
      this.logger.log('Starting backup...');
      
      // Backup all data
      const data: Record<string, any[]> = {};
      const tables = [
        'User', 'Institution', 'Subject', 'Exam', 'Question',
        'Content', 'Plan', 'Subscription', 'Payment', 'Result',
        'Notification', 'Manual', 'SocialMedia', 'WalletTransaction',
        'ExamAccess', 'ExamSimulation', 'DynamicPage', 'Page', 'PageSection'
      ];

      for (const table of tables) {
        try {
          // @ts-ignore - dynamic model access
          const records = await (this.prisma as any)[table.charAt(0).toLowerCase() + table.slice(1)].findMany?.();
          if (records) {
            data[table] = records;
            backupInfo.recordsCount![table] = records.length;
            backupInfo.tables!.push(table);
          }
        } catch (e) {
          // Table might not exist, skip
        }
      }

      // Remove sensitive data (passwords) from users
      if (data['User']) {
        data['User'] = data['User'].map((user: any) => ({
          ...user,
          password: '**BACKUP_REDACTED**',
        }));
      }

      // Add metadata
      const backup = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        database: process.env.DATABASE_URL?.split('@')[1] || 'unknown',
        tables: Object.keys(data),
        data,
      };

      // Write backup file
      const content = JSON.stringify(backup, null, 2);
      writeFileSync(filepath, content);
      
      backupInfo.size = Buffer.byteLength(content, 'utf8');
      backupInfo.status = 'COMPLETED';
      
      this.logger.log(`Backup completed: ${filename} (${backupInfo.size} bytes)`);
      
      // Clean old backups
      await this.cleanOldBackups();
      
      return backupInfo;
    } catch (error) {
      backupInfo.status = 'FAILED';
      this.logger.error('Backup failed:', error);
      throw error;
    }
  }

  /**
   * Get list of all backups
   */
  async listBackups(): Promise<BackupInfo[]> {
    try {
      const files = readdirSync(this.backupPath)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();

      return files.map((filename) => {
        const filepath = join(this.backupPath, filename);
        const stats = require('fs').statSync(filepath);
        const content = readFileSync(filepath, 'utf8');
        let metadata: any = {};
        
        try {
          metadata = JSON.parse(content);
        } catch (e) {}

        return {
          id: filename.replace('.json', ''),
          filename,
          size: stats.size,
          createdAt: stats.mtime,
          type: 'FULL',
          status: 'COMPLETED',
          tables: metadata.tables || [],
          recordsCount: metadata.data ? 
            Object.fromEntries(
              Object.entries(metadata.data).map(([k, v]: [string, any]) => [k, v.length])
            ) : {},
        };
      });
    } catch (error) {
      this.logger.error('Error listing backups:', error);
      return [];
    }
  }

  /**
   * Restore from a backup file
   */
  async restoreBackup(filename: string): Promise<{ restored: number; errors: string[] }> {
    const filepath = join(this.backupPath, filename);
    
    if (!existsSync(filepath)) {
      throw new Error(`Backup file not found: ${filename}`);
    }

    const content = readFileSync(filepath, 'utf8');
    const backup = JSON.parse(content);
    
    if (!backup.data) {
      throw new Error('Invalid backup file format');
    }

    const result = { restored: 0, errors: [] as string[] };

    this.logger.log(`Starting restore from: ${filename}`);

    // Restore each table
    for (const [tableName, records] of Object.entries(backup.data)) {
      try {
        // @ts-ignore - dynamic model access
        const model = this.prisma[tableName.charAt(0).toLowerCase() + tableName.slice(1)];
        if (!model) continue;

        // For User table, we need to handle password differently
        if (tableName === 'User') {
          for (const record of records as any[]) {
            try {
              if (record.password === '**BACKUP_REDACTED**') {
                // Skip password - keep existing
                const existing = await model.findUnique({ where: { id: record.id } });
                if (existing) {
                  record.password = existing.password;
                } else {
                  record.password = await bcrypt.hash('default-password', 10);
                }
              }
              
              await model.upsert({
                where: { id: record.id },
                create: record,
                update: record,
              });
              result.restored++;
            } catch (e: any) {
              result.errors.push(`Error restoring ${tableName}.${record.id}: ${e.message}`);
            }
          }
        } else {
          // Regular tables
          for (const record of records as any[]) {
            try {
              await model.upsert({
                where: { id: record.id },
                create: record,
                update: record,
              });
              result.restored++;
            } catch (e: any) {
              result.errors.push(`Error restoring ${tableName}.${record.id}: ${e.message}`);
            }
          }
        }
        
        this.logger.log(`Restored ${tableName}: ${(records as any[]).length} records`);
      } catch (error: any) {
        result.errors.push(`Error restoring ${tableName}: ${error.message}`);
      }
    }

    this.logger.log(`Restore completed: ${result.restored} records restored, ${result.errors.length} errors`);
    return result;
  }

  /**
   * Download a backup file
   */
  getBackupPath(filename: string): string {
    const filepath = join(this.backupPath, filename);
    if (!existsSync(filepath)) {
      throw new Error(`Backup file not found: ${filename}`);
    }
    return filepath;
  }

  /**
   * Delete a backup file
   */
  async deleteBackup(filename: string): Promise<void> {
    const filepath = join(this.backupPath, filename);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
      this.logger.log(`Backup deleted: ${filename}`);
    }
  }

  /**
   * Clean old backups, keeping only the configured max number
   */
  private async cleanOldBackups(): Promise<void> {
    const backups = await this.listBackups();
    
    if (backups.length > this.config.maxBackups) {
      const toDelete = backups.slice(this.config.maxBackups);
      for (const backup of toDelete) {
        await this.deleteBackup(backup.filename);
      }
      this.logger.log(`Cleaned ${toDelete.length} old backups`);
    }
  }

  /**
   * Get backup configuration
   */
  getConfig(): BackupConfig {
    return { ...this.config };
  }

  /**
   * Update backup configuration
   */
  updateConfig(newConfig: Partial<BackupConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.log('Backup configuration updated');
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<{ connected: boolean; latency: number; error?: string }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        connected: true,
        latency: Date.now() - start,
      };
    } catch (error: any) {
      return {
        connected: false,
        latency: Date.now() - start,
        error: error.message,
      };
    }
  }
}
