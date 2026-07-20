import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StudyContent } from '@prisma/client';
import { IStudyContentService } from '../interfaces/study-content.interface';

@Injectable()
export class StudyContentsService implements IStudyContentService {
  constructor(private prisma: PrismaService) {}

  async create(createStudyContentDto: any): Promise<StudyContent> {
    return this.prisma.studyContent.create({
      data: createStudyContentDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
    });
  }

  async findAll(): Promise<StudyContent[]> {
    return this.prisma.studyContent.findMany({
      where: {
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<StudyContent> {
    const content = await this.prisma.studyContent.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
    });

    if (!content) {
      throw new NotFoundException('Conteúdo não encontrado');
    }

    return content;
  }

  async update(id: string, updateStudyContentDto: any): Promise<StudyContent> {
    return this.prisma.studyContent.update({
      where: { id },
      data: updateStudyContentDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
    });
  }

  async remove(id: string): Promise<StudyContent> {
    return this.prisma.studyContent.delete({
      where: { id },
    });
  }

  async findBySubject(subjectId: string): Promise<StudyContent[]> {
    return this.prisma.studyContent.findMany({
      where: {
        subjectId,
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAuthor(authorId: string): Promise<StudyContent[]> {
    return this.prisma.studyContent.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async publishContent(id: string): Promise<StudyContent> {
    return this.prisma.studyContent.update({
      where: { id },
      data: { isPublished: true },
    });
  }

  async incrementViews(id: string): Promise<StudyContent> {
    const content = await this.findOne(id);
    return this.prisma.studyContent.update({
      where: { id },
      data: {
        views: content.views + 1,
      },
    });
  }

  async incrementLikes(id: string): Promise<StudyContent> {
    const content = await this.findOne(id);
    return this.prisma.studyContent.update({
      where: { id },
      data: {
        likes: content.likes + 1,
      },
    });
  }
}
