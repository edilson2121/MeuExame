import { IsString, IsOptional, IsBoolean, IsInt, IsEnum } from 'class-validator';
import { PublishStatus } from '@prisma/client';

export class CreateInstitutionPageDto {
  @IsString()
  institutionId: string;

  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  layoutId: string;

  @IsOptional()
  settings?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  showInMenu?: boolean;

  @IsOptional()
  @IsInt()
  menuOrder?: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoKeywords?: string;
}

export class UpdateInstitutionPageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  layoutId?: string;

  @IsOptional()
  settings?: Record<string, any>;

  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @IsOptional()
  @IsBoolean()
  showInMenu?: boolean;

  @IsOptional()
  @IsInt()
  menuOrder?: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoKeywords?: string;
}

export class PublishInstitutionPageDto {
  @IsBoolean()
  publish: boolean;
}
