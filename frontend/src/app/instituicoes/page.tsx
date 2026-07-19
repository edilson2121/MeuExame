'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Building2,
  Search,
  ChevronRight,
  BookOpen,
  Loader2,
  Users,
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  isActive: boolean;
  _count: {
    disciplines: number;
    users: number;
  };
}

function InstitutionsContent() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchInstitutions = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/institutions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setInstitutions(Array.isArray(data) ? data.filter((i: any) => i.isActive !== false) : []);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
      // Fallback data
      setInstitutions([
        {
          id: '1',
          name: 'Universidade Eduardo Mondlane',
          logo: null,
          description: 'A maior universidade pública de Moçambique',
          isActive: true,
          _count: { disciplines: 12, users: 245 },
        },
        {
          id: '2',
          name: 'Universidade Católica de Moçambique',
          logo: null,
          description: 'Universidade privada católica',
          isActive: true,
          _count: { disciplines: 8, users: 180 },
        },
        {
          id: '3',
          name: 'ISUTC',
          logo: null,
          description: 'Instituto Superior de Transportes e Comunicações',
          isActive: true,
          _count: { disciplines: 6, users: 95 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const filteredInstitutions = institutions.filter(
    (inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={48} className="animate-spin mx-auto text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instituições</h1>
          <p className="text-gray-500 mt-2">
            Selecione uma instituição para ver os exames disponíveis
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar instituição..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>
        </div>

        {/* Institutions Grid */}
        {filteredInstitutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution) => (
              <Link
                key={institution.id}
                href={`/instituicoes/${institution.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all group"
              >
                {/* Card Image/Logo */}
                <div className="h-32 bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center relative">
                  {institution.logo ? (
                    <img
                      src={institution.logo}
                      alt={institution.name}
                      className="w-20 h-20 object-contain rounded-xl bg-white p-2"
                    />
                  ) : (
                    <Building2 size={48} className="text-white/80" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium flex items-center gap-1">
                      <BookOpen size={14} />
                      {institution._count?.disciplines || 0}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {institution.name}
                  </h2>
                  {institution.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {institution.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Users size={14} />
                      {institution._count?.users || 0}
                    </span>
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver exames
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Nenhuma instituição encontrada</h3>
            <p className="text-gray-500 mt-2">Tente ajustar a sua pesquisa</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function InstitutionsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <InstitutionsContent />
    </ProtectedRoute>
  );
}
