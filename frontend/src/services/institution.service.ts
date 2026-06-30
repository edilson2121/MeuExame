import api from '@/lib/api';

export interface Institution {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export const institutionService = {
  async findAll(): Promise<Institution[]> {
    const response = await api.get('/institutions');
    return response.data;
  },

  async findOne(id: string): Promise<Institution> {
    const response = await api.get(`/institutions/${id}`);
    return response.data;
  },

  async create(data: Partial<Institution>): Promise<Institution> {
    const response = await api.post('/institutions', data);
    return response.data;
  },

  async update(id: string, data: Partial<Institution>): Promise<Institution> {
    const response = await api.patch(`/institutions/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/institutions/${id}`);
  },
};