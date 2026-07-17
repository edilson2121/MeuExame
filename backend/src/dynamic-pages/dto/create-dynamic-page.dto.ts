import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDynamicPageDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
