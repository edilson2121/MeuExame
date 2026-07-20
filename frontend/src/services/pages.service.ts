import { API_URL } from '@/lib/config';

export interface PublishedPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  seoTitle: string | null;
  seoKeywords: string | null;
  showInMenu: boolean;
  menuOrder: number;
  layout: {
    id: string;
    name: string;
    html: string;
    css?: string;
    config?: Record<string, any>;
  };
  institution: {
    id: string;
    name: string;
  };
  publishedAt: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  title: string;
  slug: string;
  menuOrder: number;
}

export const pagesService = {
  /**
   * Obtém todas as páginas publicadas de uma instituição
   */
  async getPublishedPages(institutionId: string): Promise<PublishedPage[]> {
    try {
      const response = await fetch(
        `${API_URL}/public/pages/institution/${institutionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar páginas: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar páginas publicadas:', error);
      throw error;
    }
  },

  /**
   * Obtém uma página específica por slug
   */
  async getPageBySlug(
    institutionId: string,
    slug: string,
  ): Promise<PublishedPage | null> {
    try {
      const response = await fetch(
        `${API_URL}/public/pages/institution/${institutionId}/slug/${slug}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erro ao buscar página: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar página por slug:', error);
      throw error;
    }
  },

  /**
   * Obtém o menu de navegação de uma instituição
   */
  async getMenu(institutionId: string): Promise<MenuItem[]> {
    try {
      const response = await fetch(
        `${API_URL}/public/pages/institution/${institutionId}/menu`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar menu: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar menu:', error);
      throw error;
    }
  },
};
