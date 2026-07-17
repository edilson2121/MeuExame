import { Difficulty } from '@prisma/client';

export class CreateExerciseDto {
  title: string;
  description?: string;
  subjectId: string;
  authorId: string;
  difficulty?: Difficulty;
}
