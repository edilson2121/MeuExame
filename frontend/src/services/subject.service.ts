import api from '@/lib/api';

export interface Subject {
  id: string;
  name: string;
  description?: string;
  courseId: string;
  course?: {
    id: string;
    name: string;
    institution?: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export const subjectService = {
  async findAll(): Promise<Subject[]> {
    const response = await api.get('/subjects');
    return response.data;
  },

  async findOne(id: string): Promise<Subject> {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  async create(data: Partial<Subject>): Promise<Subject> {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  async update(id: string, data: Partial<Subject>): Promise<Subject> {
    const response = await api.patch(`/subjects/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/subjects/${id}`);
  },
};