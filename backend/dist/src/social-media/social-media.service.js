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
exports.SocialMediaService = exports.SOCIAL_MEDIA_COLORS = exports.SOCIAL_MEDIA_ICONS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
exports.SOCIAL_MEDIA_ICONS = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    whatsapp: 'MessageCircle',
    youtube: 'Youtube',
    linkedin: 'Linkedin',
    tiktok: 'Video',
    telegram: 'Send',
};
exports.SOCIAL_MEDIA_COLORS = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    whatsapp: '#25D366',
    youtube: '#FF0000',
    linkedin: '#0A66C2',
    tiktok: '#000000',
    telegram: '#0088CC',
};
let SocialMediaService = class SocialMediaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const platformLower = data.platform.toLowerCase();
        return this.prisma.socialMedia.create({
            data: {
                platform: platformLower,
                url: data.url,
                icon: data.icon || exports.SOCIAL_MEDIA_ICONS[platformLower] || 'Globe',
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
    async update(id, data) {
        const social = await this.prisma.socialMedia.findUnique({ where: { id } });
        if (!social) {
            throw new common_1.NotFoundException('Rede social não encontrada');
        }
        return this.prisma.socialMedia.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        const social = await this.prisma.socialMedia.findUnique({ where: { id } });
        if (!social) {
            throw new common_1.NotFoundException('Rede social não encontrada');
        }
        return this.prisma.socialMedia.delete({ where: { id } });
    }
    async toggleActive(id) {
        const social = await this.prisma.socialMedia.findUnique({ where: { id } });
        if (!social) {
            throw new common_1.NotFoundException('Rede social não encontrada');
        }
        return this.prisma.socialMedia.update({
            where: { id },
            data: { isActive: !social.isActive },
        });
    }
};
exports.SocialMediaService = SocialMediaService;
exports.SocialMediaService = SocialMediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SocialMediaService);
//# sourceMappingURL=social-media.service.js.map