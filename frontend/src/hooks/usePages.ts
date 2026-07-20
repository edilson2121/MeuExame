import { useEffect, useState } from 'react';
import { pagesService, PublishedPage, MenuItem } from '@/services/pages.service';

export function usePublishedPages(institutionId: string) {
  const [pages, setPages] = useState<PublishedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!institutionId) return;

    const fetchPages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pagesService.getPublishedPages(institutionId);
        setPages(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [institutionId]);

  return { pages, loading, error };
}

export function usePageBySlug(institutionId: string, slug: string) {
  const [page, setPage] = useState<PublishedPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!institutionId || !slug) return;

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pagesService.getPageBySlug(institutionId, slug);
        setPage(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [institutionId, slug]);

  return { page, loading, error };
}

export function useInstitutionMenu(institutionId: string) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!institutionId) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pagesService.getMenu(institutionId);
        setMenu(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [institutionId]);

  return { menu, loading, error };
}
