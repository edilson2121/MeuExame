import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
    userId?: string;
    isGlobal?: boolean;
  }) {
    if (data.isGlobal) {
      // Send to all users
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

      // Create notifications in batches
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

  async findByUser(userId: string) {
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

  async findUnread(userId: string) {
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

  async countUnread(userId: string) {
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

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    // Only allow marking as read if user owns the notification or it's global
    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
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

  async delete(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return this.prisma.notification.delete({ where: { id } });
  }

  async deleteAll(userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        OR: [
          { userId },
          { isGlobal: true },
        ],
      },
    });
  }
}
