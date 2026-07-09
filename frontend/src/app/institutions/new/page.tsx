'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { institutionService } from '@/services/institution.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function NewInstitutionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await institutionService.create(formData);
      router.push('/institutions');
    } catch (error) {
      alert('Erro ao criar instituição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Nova Instituição</h1>
        
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
                placeholder="Digite o nome da instituição"
              />
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
                placeholder="Digite a descrição da instituição"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="address">
                Endereço
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Digite o endereço"
              />
            </div>

            <div>
              <label className="label" htmlFor="phone">
                Telefone
              </label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
              />
            </div>

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@instituicao.com"
              />
            </div>

            <div>
              <label className="label" htmlFor="website">
                Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.instituicao.com"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                type="submit"
                variant="success"
                loading={loading}
                fullWidth
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/institutions')}
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