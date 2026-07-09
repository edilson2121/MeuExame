'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Building2, Search } from 'lucide-react';
import { institutionService, Institution } from '@/services/institution.service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filtered, setFiltered] = useState<Institution[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadInstitutions();
  }, [router]);

  const loadInstitutions = async () => {
    try {
      const data = await institutionService.findAll();
      setInstitutions(Array.isArray(data) ? data : []);
      setFiltered(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
      setInstitutions([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta instituição?')) {
      try {
        await institutionService.remove(id);
        await loadInstitutions();
      } catch (error) {
        alert('Erro ao excluir instituição');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      institutions.filter((inst) =>
        inst.name.toLowerCase().includes(value) ||
        (inst.description?.toLowerCase().includes(value) || '')
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Instituições</h1>
            <p className="text-muted-foreground mt-1">Gerencie todas as instituições cadastradas</p>
          </div>
          <Button onClick={() => router.push('/institutions/new')}>
            <Plus className="w-4 h-4 mr-2" /> Nova Instituição
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar instituições..."
              value={search}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Nenhuma instituição cadastrada</p>
            <p className="text-sm text-muted-foreground mt-2">Clique em "Nova Instituição" para começar</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((institution) => (
              <Card key={institution.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{institution.name}</h3>
                    {institution.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{institution.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {institution.email && <Badge variant="info">{institution.email}</Badge>}
                      {institution.phone && <Badge variant="primary">{institution.phone}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/institutions/${institution.id}`)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(institution.id)}
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