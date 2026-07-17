import { ContentType } from '@prisma/client';
export declare class CreateStudyContentDto {
    title: string;
    description?: string;
    content: string;
    type: ContentType;
    subjectId?: string;
    authorId: string;
    isPublished?: boolean;
}
