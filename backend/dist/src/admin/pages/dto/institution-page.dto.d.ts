import { PublishStatus } from '@prisma/client';
export declare class CreateInstitutionPageDto {
    institutionId: string;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    layoutId: string;
    settings?: Record<string, any>;
    showInMenu?: boolean;
    menuOrder?: number;
    seoTitle?: string;
    seoKeywords?: string;
}
export declare class UpdateInstitutionPageDto {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    layoutId?: string;
    settings?: Record<string, any>;
    status?: PublishStatus;
    showInMenu?: boolean;
    menuOrder?: number;
    seoTitle?: string;
    seoKeywords?: string;
}
export declare class PublishInstitutionPageDto {
    publish: boolean;
}
