import api from '@/lib/api';

export interface Course {
  id: string;
  name: string;
  description?: string;
  institutionId: string;
  institution?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const courseService = {
  async findAll(): Promise<Course[]> {
    const response = await api.get('/courses');
    return response.data;
  },

  async findOne(id: string): Promise<Course> {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async create(data: Partial<Course>): Promise<Course> {
    const response = await api.post('/courses', data);
    return response.data;
  },

  async update(id: string, data: Partial<Course>): Promise<Course> {
    const response = await api.patch(`/courses/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },
};