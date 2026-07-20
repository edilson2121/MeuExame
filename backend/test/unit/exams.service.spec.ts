import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from '../../src/modules/exams/exams.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ExamsService', () => {
  let service: ExamsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    exam: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    examQuestion: {
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
    question: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return array of exams', async () => {
      const mockExams = [
        { id: '1', title: 'Exam 1', status: 'PUBLISHED' },
        { id: '2', title: 'Exam 2', status: 'DRAFT' },
      ];

      mockPrismaService.exam.findMany.mockResolvedValue(mockExams);

      const result = await service.findAll();

      expect(result).toEqual(mockExams);
    });
  });

  describe('findOne', () => {
    it('should return exam with questions', async () => {
      const mockExam = {
        id: '1',
        title: 'Math Exam',
        questions: [
          { id: 'q1', text: 'Question 1' },
        ],
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

      const result = await service.findOne('1');

      expect(result).toEqual(mockExam);
    });

    it('should throw NotFoundException when exam not found', async () => {
      mockPrismaService.exam.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new exam', async () => {
      const createExamDto = {
        title: 'New Exam',
        description: 'Test exam',
        duration: 60,
        subjectId: 'sub-1',
      };

      const mockCreated = { id: 'new-1', ...createExamDto, status: 'DRAFT' };
      mockPrismaService.exam.create.mockResolvedValue(mockCreated);

      const result = await service.create(createExamDto as any, 'user-1');

      expect(result).toEqual(mockCreated);
    });
  });

  describe('update', () => {
    it('should update exam status', async () => {
      const mockExam = { id: '1', title: 'Updated Exam', status: 'PUBLISHED' };
      mockPrismaService.exam.update.mockResolvedValue(mockExam);

      const result = await service.update('1', { status: 'PUBLISHED' });

      expect(result).toEqual(mockExam);
    });
  });

  describe('submit', () => {
    it('should submit exam and calculate score', async () => {
      const mockExam = {
        id: '1',
        title: 'Math Exam',
        questions: [
          { id: 'q1', correctAnswer: '4', points: 2 },
          { id: 'q2', correctAnswer: '50', points: 2 },
        ],
      };

      mockPrismaService.exam.findUnique.mockResolvedValue(mockExam);

      const answers = [
        { questionId: 'q1', answer: '4' },
        { questionId: 'q2', answer: '45' },
      ];

      const result = await service.submit('1', 'user-1', answers as any);

      expect(result).toHaveProperty('score');
      expect(result.score).toBe(50); // 2/4 = 50%
    });
  });
});
