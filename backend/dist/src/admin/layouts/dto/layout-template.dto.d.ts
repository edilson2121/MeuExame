export declare class CreateLayoutTemplateDto {
    name: string;
    description?: string;
    html: string;
    css?: string;
    thumbnail?: string;
    config?: Record<string, any>;
}
export declare class UpdateLayoutTemplateDto {
    name?: string;
    description?: string;
    html?: string;
    css?: string;
    thumbnail?: string;
    config?: Record<string, any>;
    isActive?: boolean;
}
