import { SocialMediaService } from './social-media.service';
export declare class SocialMediaController {
    private readonly socialMediaService;
    constructor(socialMediaService: SocialMediaService);
    findAll(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }[]>;
    findAllAdmin(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }[]>;
    create(data: {
        platform: string;
        url: string;
        icon?: string;
        position?: number;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        url: string;
        icon: string | null;
        position: number;
    }>;
}
