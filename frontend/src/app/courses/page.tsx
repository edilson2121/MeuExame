'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, BookOpen, Search } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface Course {
  id: string;
  name: string;
  description?: string;
  institutionId: string;
  institution?: { id: string; name: string };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadCourses();
  }, [router]);

  const loadCourses = async () => {
    try {
      const response = await api.get('/courses');
      const data = Array.isArray(response.data) ? response.data : [];
      setCourses(data);
      setFiltered(data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setCourses([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await api.delete(`/courses/${id}`);
        await loadCourses();
      } catch (error) {
        alert('Erro ao excluir curso');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      courses.filter((c) =>
        c.name.toLowerCase().includes(value) ||
        (c.description?.toLowerCase().includes(value) || '') ||
        (c.institution?.name?.toLowerCase().includes(value) || '')
      )
    );
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
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cursos</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os cursos cadastrados</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/courses/new')}>
            <Plus className="w-4 h-4 mr-2" /> Novo Curso
          </Button>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar cursos..." value={search} onChange={handleSearch} className="pl-10" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Nenhum curso cadastrado</p>
            <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Curso" para começar</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{course.name}</h3>
                    {course.institution && (
                      <Badge variant="primary" className="mt-1">
                        {course.institution.name}
                      </Badge>
                    )}
                    {course.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button size="sm" variant="outline" onClick={() => router.push(`/courses/${course.id}`)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}