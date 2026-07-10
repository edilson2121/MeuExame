import { API_URL } from '@/lib/config';

export interface Material {
  id: string;
  title: string;
  description?: string;
  content?: string;
  type: 'MANUAL' | 'EXAM';
  accessLevel: 'FREE' | 'PAID' | 'BLOCKED';
  subjectId: string;
  institutionId: string;
  duration?: number;
  passingScore?: number;
  isPublished: boolean;
  isActive: boolean;
  questions?: Question[];
  results?: Result[];
  subject?: any;
  institution?: any;
}

export interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
}

export interface Result {
  id: string;
  score: number;
  total: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedAt: string;
  material: Material;
}

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { 'Authorization': Bearer  } : {})
});

export const materialsService = {
  // Admin
  async createMaterial(data: any) {
    const response = await fetch(${API_URL}/materials, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao criar material');
    return response.json();
  },

  async updateMaterial(id: string, data: any) {
    const response = await fetch(${API_URL}/materials/, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao atualizar material');
    return response.json();
  },

  async togglePublish(id: string, publish: boolean) {
    const response = await fetch(${API_URL}/materials//publish, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ publish })
    });
    if (!response.ok) throw new Error('Erro ao publicar/despublicar');
    return response.json();
  },

  async toggleBlock(id: string, block: boolean, reason?: string) {
    const response = await fetch(${API_URL}/materials//block, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ block, reason })
    });
    if (!response.ok) throw new Error('Erro ao bloquear/desbloquear');
    return response.json();
  },

  async getAdminMaterials(institutionId?: string) {
    const url = institutionId 
      ? ${API_URL}/materials/admin?institutionId=
      : ${API_URL}/materials/admin;
    const response = await fetch(url, { headers: headers() });
    if (!response.ok) throw new Error('Erro ao buscar materiais');
    return response.json();
  },

  // Public
  async getPublishedMaterials(institutionId: string, subjectId?: string) {
    const url = subjectId 
      ? ${API_URL}/materials/institution/?subjectId=
      : ${API_URL}/materials/institution/;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar materiais');
    return response.json();
  },

  async getInstitutionPage(institutionId: string) {
    const response = await fetch(${API_URL}/materials/institution//page);
    if (!response.ok) throw new Error('Erro ao buscar página da instituição');
    return response.json();
  },

  async getMaterial(id: string) {
    const response = await fetch(${API_URL}/materials/, {
      headers: headers()
    });
    if (!response.ok) throw new Error('Erro ao buscar material');
    return response.json();
  },

  // User
  async submitExam(materialId: string, answers: Record<string, string>) {
    const response = await fetch(${API_URL}/materials/submit, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ materialId, answers })
    });
    if (!response.ok) throw new Error('Erro ao enviar exame');
    return response.json();
  },

  async getUserResults() {
    const response = await fetch(${API_URL}/materials/user/results, {
      headers: headers()
    });
    if (!response.ok) throw new Error('Erro ao buscar resultados');
    return response.json();
  },

  async getUserStats() {
    const response = await fetch(${API_URL}/materials/user/stats, {
      headers: headers()
    });
    if (!response.ok) throw new Error('Erro ao buscar estatísticas');
    return response.json();
  }
};
