"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        if (data.isGlobal) {
            const users = await this.prisma.user.findMany({
                select: { id: true, email: true, name: true },
            });
            const notifications = users.map((user) => ({
                title: data.title,
                message: data.message,
                type: data.type || 'GENERAL',
                link: data.link,
                userId: user.id,
                isGlobal: true,
            }));
            return this.prisma.notification.createMany({
                data: notifications,
            });
        }
        return this.prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type || 'GENERAL',
                link: data.link,
                userId: data.userId,
                isGlobal: data.isGlobal || false,
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.notification.findMany({
            where: {
                OR: [
                    { userId },
                    { isGlobal: true },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findUnread(userId) {
        return this.prisma.notification.findMany({
            where: {
                OR: [
                    { userId },
                    { isGlobal: true },
                ],
                isRead: false,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async countUnread(userId) {
        return this.prisma.notification.count({
            where: {
                OR: [
                    { userId },
                    { isGlobal: true },
                ],
                isRead: false,
            },
        });
    }
    async markAsRead(id, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notificação não encontrada');
        }
        if (notification.userId && notification.userId !== userId) {
            throw new common_1.NotFoundException('Notificação não encontrada');
        }
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                OR: [
                    { userId },
                    { isGlobal: true },
                ],
                isRead: false,
            },
            data: { isRead: true },
        });
    }
    async delete(id, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notificação não encontrada');
        }
        if (notification.userId && notification.userId !== userId) {
            throw new common_1.NotFoundException('Notificação não encontrada');
        }
        return this.prisma.notification.delete({ where: { id } });
    }
    async deleteAll(userId) {
        return this.prisma.notification.deleteMany({
            where: {
                OR: [
                    { userId },
                    { isGlobal: true },
                ],
            },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map