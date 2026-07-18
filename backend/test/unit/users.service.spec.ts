import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/modules/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@test.com', name: 'User 1' },
        { id: '2', email: 'user2@test.com', name: 'User 2' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: '1', email: 'user@test.com', name: 'Test User' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { id: '1', email: 'user@test.com', name: 'Test User' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('user@test.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
      });
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const mockUser = { id: '1', email: 'user@test.com', name: 'Updated Name' };
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.update('1', { name: 'Updated Name' });

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Name' },
      });
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      const mockUser = { id: '1', email: 'user@test.com', name: 'Test User' };
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      await service.remove('1');

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
