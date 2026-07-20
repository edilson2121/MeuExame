import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    getStatus(): Promise<{
        connected: boolean;
        latency: number;
        backupCount: number;
        config: import("./backup.service").BackupConfig;
        lastBackup: import("./backup.service").BackupInfo;
    }>;
    testConnection(): Promise<{
        connected: boolean;
        latency: number;
        error?: string;
    }>;
    listBackups(): Promise<import("./backup.service").BackupInfo[]>;
    createBackup(): Promise<import("./backup.service").BackupInfo>;
    downloadBackup(filename: string, res: Response): Promise<StreamableFile>;
    restoreBackup(filename: string): Promise<{
        restored: number;
        errors: string[];
    }>;
    deleteBackup(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
    startScheduler(): {
        success: boolean;
        message: string;
    };
    stopScheduler(): {
        success: boolean;
        message: string;
    };
}
