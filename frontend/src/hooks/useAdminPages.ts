import { useState, useCallback } from 'react';
import {
  adminPagesService,
  CreatePageRequest,
  UpdatePageRequest,
  PageResponse,
  LayoutTemplate,
} from '@/services/admin-pages.service';

export function useAdminPages(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPage = useCallback(
    async (data: CreatePageRequest): Promise<PageResponse> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPagesService.createPage(data, token);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updatePage = useCallback(
    async (pageId: string, data: UpdatePageRequest): Promise<PageResponse> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPagesService.updatePage(pageId, data, token);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const publishPage = useCallback(
    async (pageId: string, publish: boolean): Promise<PageResponse> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPagesService.publishPage(pageId, publish, token);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const getInstitutionPages = useCallback(
    async (institutionId: string): Promise<PageResponse[]> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPagesService.getInstitutionPages(
          institutionId,
          token,
        );
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const deletePage = useCallback(
    async (pageId: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        await adminPagesService.deletePage(pageId, token);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    loading,
    error,
    createPage,
    updatePage,
    publishPage,
    getInstitutionPages,
    deletePage,
  };
}

export function useAdminLayouts(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getLayouts = useCallback(async (): Promise<LayoutTemplate[]> => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminPagesService.getLayouts(token);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getLayout = useCallback(
    async (layoutId: string): Promise<LayoutTemplate> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPagesService.getLayout(layoutId, token);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    loading,
    error,
    getLayouts,
    getLayout,
  };
}
