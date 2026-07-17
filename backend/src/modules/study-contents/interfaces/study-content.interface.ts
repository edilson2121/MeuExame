import { StudyContent } from '@prisma/client';

export interface IStudyContentService {
  create(createStudyContentDto: any): Promise<StudyContent>;
  findAll(): Promise<StudyContent[]>;
  findOne(id: string): Promise<StudyContent>;
  update(id: string, updateStudyContentDto: any): Promise<StudyContent>;
  remove(id: string): Promise<StudyContent>;
  findBySubject(subjectId: string): Promise<StudyContent[]>;
  findByAuthor(authorId: string): Promise<StudyContent[]>;
  publishContent(id: string): Promise<StudyContent>;
  incrementViews(id: string): Promise<StudyContent>;
  incrementLikes(id: string): Promise<StudyContent>;
}
