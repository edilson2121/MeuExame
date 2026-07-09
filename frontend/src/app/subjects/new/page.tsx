'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Course {
  id: string;
  name: string;
  institution?: {
    id: string;
    name: string;
  };
}

export default function NewSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    courseId: '',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
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
    setLoading(true);

    try {
      await api.post('/subjects', formData);
      router.push('/subjects');
    } catch (error) {
      alert('Erro ao criar disciplina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Nova Disciplina</h1>
        
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
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome da disciplina"
              />
            </div>

            <div>
              <label className="label" htmlFor="courseId">
                Curso *
              </label>
              <select
                id="courseId"
                name="courseId"
                required
                value={formData.courseId}
                onChange={handleChange}
                className="input"
              >
                <option value="">Selecione um curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} {course.institution ? `(${course.institution.name})` : ''}
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Digite a descrição da disciplina"
                className="input"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                type="submit"
                variant="warning"
                loading={loading}
                fullWidth
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/subjects')}
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