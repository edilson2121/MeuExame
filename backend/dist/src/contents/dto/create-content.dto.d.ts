import { ContentType } from '@prisma/client';
export declare class CreateContentDto {
    title: string;
    description?: string;
    content: string;
    type?: ContentType;
    subjectId: string;
    authorId: string;
    views?: number;
    likes?: number;
}
