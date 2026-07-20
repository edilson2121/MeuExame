import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateExamDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  subjectId: string;

  @IsString()
  authorId: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  questions?: any[];

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
