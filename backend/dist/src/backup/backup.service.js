"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
const util_1 = require("util");
const bcrypt = __importStar(require("bcryptjs"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let BackupService = BackupService_1 = class BackupService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BackupService_1.name);
        this.backupCronJob = null;
        this.backupPath = process.env.BACKUP_PATH || './backups';
        this.config = {
            maxBackups: parseInt(process.env.MAX_BACKUPS || '7'),
            backupPath: this.backupPath,
            schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
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
        if (process.env.NODE_ENV === 'production') {
            this.startBackupScheduler();
        }
    }
    ensureBackupDirectory() {
        if (!(0, fs_1.existsSync)(this.backupPath)) {
            (0, fs_1.mkdirSync)(this.backupPath, { recursive: true });
            this.logger.log(`Backup directory created: ${this.backupPath}`);
        }
    }
    startBackupScheduler() {
        if (this.backupCronJob) {
            this.logger.warn('Backup scheduler already running');
            return;
        }
        this.logger.log(`Starting backup scheduler with schedule: ${this.config.schedule}`);
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
                }
                catch (error) {
                    this.logger.error('Scheduled backup failed:', error);
                }
            }
        };
        this.backupCronJob = setInterval(checkAndRun, 60000);
        this.logger.log('Backup scheduler started');
    }
    stopBackupScheduler() {
        if (this.backupCronJob) {
            clearInterval(this.backupCronJob);
            this.backupCronJob = null;
            this.logger.log('Backup scheduler stopped');
        }
    }
    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.json`;
        const filepath = (0, path_1.join)(this.backupPath, filename);
        const backupInfo = {
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
            const data = {};
            const tables = [
                'User', 'Institution', 'Subject', 'Exam', 'Question',
                'Content', 'Plan', 'Subscription', 'Payment', 'Result',
                'Notification', 'Manual', 'SocialMedia', 'WalletTransaction',
                'ExamAccess', 'ExamSimulation', 'DynamicPage', 'Page', 'PageSection'
            ];
            for (const table of tables) {
                try {
                    const records = await this.prisma[table.charAt(0).toLowerCase() + table.slice(1)].findMany?.();
                    if (records) {
                        data[table] = records;
                        backupInfo.recordsCount[table] = records.length;
                        backupInfo.tables.push(table);
                    }
                }
                catch (e) {
                }
            }
            if (data['User']) {
                data['User'] = data['User'].map((user) => ({
                    ...user,
                    password: '**BACKUP_REDACTED**',
                }));
            }
            const backup = {
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                database: process.env.DATABASE_URL?.split('@')[1] || 'unknown',
                tables: Object.keys(data),
                data,
            };
            const content = JSON.stringify(backup, null, 2);
            (0, fs_1.writeFileSync)(filepath, content);
            backupInfo.size = Buffer.byteLength(content, 'utf8');
            backupInfo.status = 'COMPLETED';
            this.logger.log(`Backup completed: ${filename} (${backupInfo.size} bytes)`);
            await this.cleanOldBackups();
            return backupInfo;
        }
        catch (error) {
            backupInfo.status = 'FAILED';
            this.logger.error('Backup failed:', error);
            throw error;
        }
    }
    async listBackups() {
        try {
            const files = (0, fs_1.readdirSync)(this.backupPath)
                .filter(f => f.endsWith('.json'))
                .sort()
                .reverse();
            return files.map((filename) => {
                const filepath = (0, path_1.join)(this.backupPath, filename);
                const stats = require('fs').statSync(filepath);
                const content = (0, fs_1.readFileSync)(filepath, 'utf8');
                let metadata = {};
                try {
                    metadata = JSON.parse(content);
                }
                catch (e) { }
                return {
                    id: filename.replace('.json', ''),
                    filename,
                    size: stats.size,
                    createdAt: stats.mtime,
                    type: 'FULL',
                    status: 'COMPLETED',
                    tables: metadata.tables || [],
                    recordsCount: metadata.data ?
                        Object.fromEntries(Object.entries(metadata.data).map(([k, v]) => [k, v.length])) : {},
                };
            });
        }
        catch (error) {
            this.logger.error('Error listing backups:', error);
            return [];
        }
    }
    async restoreBackup(filename) {
        const filepath = (0, path_1.join)(this.backupPath, filename);
        if (!(0, fs_1.existsSync)(filepath)) {
            throw new Error(`Backup file not found: ${filename}`);
        }
        const content = (0, fs_1.readFileSync)(filepath, 'utf8');
        const backup = JSON.parse(content);
        if (!backup.data) {
            throw new Error('Invalid backup file format');
        }
        const result = { restored: 0, errors: [] };
        this.logger.log(`Starting restore from: ${filename}`);
        for (const [tableName, records] of Object.entries(backup.data)) {
            try {
                const model = this.prisma[tableName.charAt(0).toLowerCase() + tableName.slice(1)];
                if (!model)
                    continue;
                if (tableName === 'User') {
                    for (const record of records) {
                        try {
                            if (record.password === '**BACKUP_REDACTED**') {
                                const existing = await model.findUnique({ where: { id: record.id } });
                                if (existing) {
                                    record.password = existing.password;
                                }
                                else {
                                    record.password = await bcrypt.hash('default-password', 10);
                                }
                            }
                            await model.upsert({
                                where: { id: record.id },
                                create: record,
                                update: record,
                            });
                            result.restored++;
                        }
                        catch (e) {
                            result.errors.push(`Error restoring ${tableName}.${record.id}: ${e.message}`);
                        }
                    }
                }
                else {
                    for (const record of records) {
                        try {
                            await model.upsert({
                                where: { id: record.id },
                                create: record,
                                update: record,
                            });
                            result.restored++;
                        }
                        catch (e) {
                            result.errors.push(`Error restoring ${tableName}.${record.id}: ${e.message}`);
                        }
                    }
                }
                this.logger.log(`Restored ${tableName}: ${records.length} records`);
            }
            catch (error) {
                result.errors.push(`Error restoring ${tableName}: ${error.message}`);
            }
        }
        this.logger.log(`Restore completed: ${result.restored} records restored, ${result.errors.length} errors`);
        return result;
    }
    getBackupPath(filename) {
        const filepath = (0, path_1.join)(this.backupPath, filename);
        if (!(0, fs_1.existsSync)(filepath)) {
            throw new Error(`Backup file not found: ${filename}`);
        }
        return filepath;
    }
    async deleteBackup(filename) {
        const filepath = (0, path_1.join)(this.backupPath, filename);
        if ((0, fs_1.existsSync)(filepath)) {
            (0, fs_1.unlinkSync)(filepath);
            this.logger.log(`Backup deleted: ${filename}`);
        }
    }
    async cleanOldBackups() {
        const backups = await this.listBackups();
        if (backups.length > this.config.maxBackups) {
            const toDelete = backups.slice(this.config.maxBackups);
            for (const backup of toDelete) {
                await this.deleteBackup(backup.filename);
            }
            this.logger.log(`Cleaned ${toDelete.length} old backups`);
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.logger.log('Backup configuration updated');
    }
    async testConnection() {
        const start = Date.now();
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                connected: true,
                latency: Date.now() - start,
            };
        }
        catch (error) {
            return {
                connected: false,
                latency: Date.now() - start,
                error: error.message,
            };
        }
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BackupService);
//# sourceMappingURL=backup.service.js.map