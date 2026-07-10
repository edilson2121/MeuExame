import { useState, useEffect } from 'react';
import { materialsService } from '@/services/materials.service';

export function usePublishedMaterials(institutionId: string, subjectId?: string) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!institutionId) return;

    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await materialsService.getPublishedMaterials(institutionId, subjectId);
        setMaterials(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [institutionId, subjectId]);

  return { materials, loading, error };
}

export function useInstitutionPage(institutionId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!institutionId) return;

    const fetchPage = async () => {
      try {
        setLoading(true);
        const result = await materialsService.getInstitutionPage(institutionId);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [institutionId]);

  return { data, loading, error };
}

export function useMaterial(materialId: string) {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!materialId) return;

    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const data = await materialsService.getMaterial(materialId);
        setMaterial(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  return { material, loading, error };
}

export function useUserResults() {
  const [results, setResults] = useState({ list: [], totalExams: 0, averageScore: 0, examsPassed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const stats = await materialsService.getUserStats();
        const list = await materialsService.getUserResults();
        setResults({ ...stats, list });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return { results, loading, error };
}

export function useAdminMaterials(institutionId?: string) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await materialsService.getAdminMaterials(institutionId);
        setMaterials(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [institutionId]);

  const togglePublish = async (id: string, publish: boolean) => {
    await materialsService.togglePublish(id, publish);
    const data = await materialsService.getAdminMaterials(institutionId);
    setMaterials(data);
  };

  const toggleBlock = async (id: string, block: boolean, reason?: string) => {
    await materialsService.toggleBlock(id, block, reason);
    const data = await materialsService.getAdminMaterials(institutionId);
    setMaterials(data);
  };

  return { materials, loading, error, togglePublish, toggleBlock };
}
