import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { NotificationType } from '@prisma/client';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findByUser(@Request() req) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  findUnread(@Request() req) {
    return this.notificationsService.findUnread(req.user.id);
  }

  @Get('unread/count')
  @UseGuards(JwtAuthGuard)
  countUnread(@Request() req) {
    return this.notificationsService.countUnread(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(
    @Body() data: {
      title: string;
      message: string;
      type?: NotificationType;
      link?: string;
      userId?: string;
      isGlobal?: boolean;
    },
  ) {
    return this.notificationsService.create(data);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req) {
    return this.notificationsService.delete(id, req.user.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteAll(@Request() req) {
    return this.notificationsService.deleteAll(req.user.id);
  }
}
