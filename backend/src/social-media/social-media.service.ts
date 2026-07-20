import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export const SOCIAL_MEDIA_ICONS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  whatsapp: 'MessageCircle',
  youtube: 'Youtube',
  linkedin: 'Linkedin',
  tiktok: 'Video',
  telegram: 'Send',
};

export const SOCIAL_MEDIA_COLORS: Record<string, string> = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  whatsapp: '#25D366',
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  tiktok: '#000000',
  telegram: '#0088CC',
};

@Injectable()
export class SocialMediaService {
  constructor(private prisma: PrismaService) {}

  async create(data: { platform: string; url: string; icon?: string; position?: number }) {
    const platformLower = data.platform.toLowerCase();
    
    return this.prisma.socialMedia.create({
      data: {
        platform: platformLower,
        url: data.url,
        icon: data.icon || SOCIAL_MEDIA_ICONS[platformLower] || 'Globe',
        position: data.position || 0,
      },
    });
  }

  async findAll() {
    return this.prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: string, data: { url?: string; icon?: string; position?: number; isActive?: boolean }) {
    const social = await this.prisma.socialMedia.findUnique({ where: { id } });
    if (!social) {
      throw new NotFoundException('Rede social não encontrada');
    }

    return this.prisma.socialMedia.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const social = await this.prisma.socialMedia.findUnique({ where: { id } });
    if (!social) {
      throw new NotFoundException('Rede social não encontrada');
    }

    return this.prisma.socialMedia.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const social = await this.prisma.socialMedia.findUnique({ where: { id } });
    if (!social) {
      throw new NotFoundException('Rede social não encontrada');
    }

    return this.prisma.socialMedia.update({
      where: { id },
      data: { isActive: !social.isActive },
    });
  }
}
