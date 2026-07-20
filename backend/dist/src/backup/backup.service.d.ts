import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
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
    schedule: string;
    compress: boolean;
    includeUsers: boolean;
    includeExams: boolean;
    includePayments: boolean;
    includeAll: boolean;
}
export declare class BackupService implements OnModuleInit {
    private prisma;
    private readonly logger;
    private backupPath;
    private config;
    private backupCronJob;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private ensureBackupDirectory;
    startBackupScheduler(): void;
    stopBackupScheduler(): void;
    createBackup(): Promise<BackupInfo>;
    listBackups(): Promise<BackupInfo[]>;
    restoreBackup(filename: string): Promise<{
        restored: number;
        errors: string[];
    }>;
    getBackupPath(filename: string): string;
    deleteBackup(filename: string): Promise<void>;
    private cleanOldBackups;
    getConfig(): BackupConfig;
    updateConfig(newConfig: Partial<BackupConfig>): void;
    testConnection(): Promise<{
        connected: boolean;
        latency: number;
        error?: string;
    }>;
}
