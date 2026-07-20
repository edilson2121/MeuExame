import { Question } from '@prisma/client';

export interface IQuestionService {
  create(createQuestionDto: any): Promise<Question>;
  findAll(): Promise<Question[]>;
  findOne(id: string): Promise<Question>;
  update(id: string, updateQuestionDto: any): Promise<Question>;
  remove(id: string): Promise<Question>;
  findByExercise(exerciseId: string): Promise<Question[]>;
  findByType(type: string): Promise<Question[]>;
}
