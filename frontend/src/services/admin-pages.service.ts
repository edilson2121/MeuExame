import { API_URL } from '@/lib/config';

export interface CreatePageRequest {
  institutionId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  layoutId: string;
  settings?: Record<string, any>;
  showInMenu?: boolean;
  menuOrder?: number;
  seoTitle?: string;
  seoKeywords?: string;
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  layoutId?: string;
  settings?: Record<string, any>;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  showInMenu?: boolean;
  menuOrder?: number;
  seoTitle?: string;
  seoKeywords?: string;
}

export interface PageResponse {
  id: string;
  institutionId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  layoutId: string;
  settings?: Record<string, any>;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  showInMenu: boolean;
  menuOrder: number;
  seoTitle?: string;
  seoKeywords?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  layout?: {
    id: string;
    name: string;
    html: string;
    css?: string;
  };
  institution?: {
    id: string;
    name: string;
  };
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description?: string;
  html: string;
  css?: string;
  thumbnail?: string;
  config?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminPagesService = {
  /**
   * Criar nova página de instituição
   */
  async createPage(
    data: CreatePageRequest,
    token: string,
  ): Promise<PageResponse> {
    const response = await fetch(`${API_URL}/admin/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar página: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Atualizar página
   */
  async updatePage(
    pageId: string,
    data: UpdatePageRequest,
    token: string,
  ): Promise<PageResponse> {
    const response = await fetch(`${API_URL}/admin/pages/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar página: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Publicar/Despublicar página
   */
  async publishPage(
    pageId: string,
    publish: boolean,
    token: string,
  ): Promise<PageResponse> {
    const response = await fetch(`${API_URL}/admin/pages/${pageId}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ publish }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao publicar página: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter páginas da instituição
   */
  async getInstitutionPages(
    institutionId: string,
    token: string,
  ): Promise<PageResponse[]> {
    const response = await fetch(
      `${API_URL}/admin/pages/institution/${institutionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar páginas: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter página por ID
   */
  async getPageById(pageId: string, token: string): Promise<PageResponse> {
    const response = await fetch(`${API_URL}/admin/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar página: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Deletar página
   */
  async deletePage(pageId: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/admin/pages/${pageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar página: ${response.statusText}`);
    }
  },

  /**
   * Obter todos os layouts
   */
  async getLayouts(token: string): Promise<LayoutTemplate[]> {
    const response = await fetch(`${API_URL}/admin/layouts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar layouts: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter layout por ID
   */
  async getLayout(layoutId: string, token: string): Promise<LayoutTemplate> {
    const response = await fetch(`${API_URL}/admin/layouts/${layoutId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar layout: ${response.statusText}`);
    }

    return response.json();
  },
};
