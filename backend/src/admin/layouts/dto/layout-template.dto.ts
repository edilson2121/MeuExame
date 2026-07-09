import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateLayoutTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  css?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  config?: Record<string, any>;
}

export class UpdateLayoutTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  css?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  config?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
