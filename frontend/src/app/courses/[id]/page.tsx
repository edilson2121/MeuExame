'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';

interface Institution {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  description?: string;
  institutionId: string;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    description: '',
    institutionId: '',
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [courseRes, institutionsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get('/institutions'),
      ]);
      
      setFormData(courseRes.data);
      setInstitutions(Array.isArray(institutionsRes.data) ? institutionsRes.data : []);
    } catch (error) {
      alert('Erro ao carregar dados');
      router.push('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch(`/courses/${id}`, formData);
      router.push('/courses');
    } catch (error) {
      alert('Erro ao atualizar curso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader loader-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Editar Curso</h1>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label" htmlFor="name">
                Nome *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Digite o nome do curso"
              />
            </div>

            <div>
              <label className="label" htmlFor="institutionId">
                Instituição *
              </label>
              <select
                id="institutionId"
                name="institutionId"
                required
                value={formData.institutionId || ''}
                onChange={handleChange}
                className="input"
              >
                <option value="">Selecione uma instituição</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Digite a descrição do curso"
                className="input"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                type="submit"
                variant="secondary"
                loading={saving}
                fullWidth
              >
                {saving ? 'Salvando...' : 'Atualizar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/courses')}
                fullWidth
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}