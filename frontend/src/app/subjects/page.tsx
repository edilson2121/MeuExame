'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, GraduationCap, Search } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import Navbar from '@/components/navbar/Navbar';

interface Subject {
  id: string;
  name: string;
  description?: string;
  courseId: string;
  course?: { 
    id: string; 
    name: string; 
    institution?: { 
      id: string; 
      name: string;
    };
  };
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filtered, setFiltered] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadSubjects();
  }, [router]);

  const loadSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      const data = Array.isArray(response.data) ? response.data : [];
      setSubjects(data);
      setFiltered(data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      setSubjects([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
      try {
        await api.delete(`/subjects/${id}`);
        await loadSubjects();
      } catch (error) {
        alert('Erro ao excluir disciplina');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      subjects.filter((s) =>
        s.name.toLowerCase().includes(value) ||
        (s.description?.toLowerCase().includes(value) || '') ||
        (s.course?.name?.toLowerCase().includes(value) || '')
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
      <Navbar />
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Disciplinas</h1>
            <p className="text-muted-foreground mt-1">Gerencie todas as disciplinas cadastradas</p>
          </div>
          <Button variant="warning" onClick={() => router.push('/subjects/new')}>
            <Plus className="w-4 h-4 mr-2" /> Nova Disciplina
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar disciplinas..." 
              value={search} 
              onChange={handleSearch} 
              className="pl-10" 
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Nenhuma disciplina cadastrada</p>
            <p className="text-sm text-muted-foreground mt-2">Clique em "Nova Disciplina" para começar</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {subject.course && (
                        <Badge variant="secondary">
                          {subject.course.name}
                        </Badge>
                      )}
                      {subject.course?.institution && (
                        <Badge variant="info">
                          {subject.course.institution.name}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Descrição */}
                    {subject.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {subject.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => router.push(`/subjects/${subject.id}`)} 
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => handleDelete(subject.id)}
                  >
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