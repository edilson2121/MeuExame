import { IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  institutionId?: string;
}
