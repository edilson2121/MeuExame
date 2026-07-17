import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ContentType } from '@prisma/client';

export class CreateStudyContentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  content: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsString()
  authorId: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
