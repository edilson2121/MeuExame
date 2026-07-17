import { Controller, Get, Put, Body, UseGuards, Request, Post } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private prisma: PrismaService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        phone: true,
        bio: true,
        createdAt: true,
        subscription: true,
      },
    });

    return user;
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name: dto.name,
        phone: dto.phone,
        bio: dto.bio,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        phone: true,
        bio: true,
        createdAt: true,
        subscription: true,
      },
    });

    return user;
  }
}
