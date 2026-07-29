'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

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

      let data: any[] = [];
      try {
        const res = await fetch(`${apiUrl}/institutions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (fetchError) {
        console.warn('Backend indisponível, usando dados de demonstração');
      }

      if (Array.isArray(data) && data.length > 0) {
        setInstitutions(data.filter((i: any) => i.isActive !== false));
      } else {
        // Fallback data quando API não responde
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
      }
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
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
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escolha sua Instituição</h1>
          <p className="text-gray-500">
            Clique em uma instituição para ver os exames disponíveis
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar instituição..."
              className="w-full pl-14 pr-6 py-4 bg-white border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm"
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
                className="bg-white rounded-3xl shadow-lg border-2 border-green-100 overflow-hidden hover:shadow-2xl hover:border-green-400 transition-all group transform hover:-translate-y-1"
              >
                {/* Card Image/Logo */}
                <div className="h-40 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative">
                  {institution.logo ? (
                    <img
                      src={institution.logo}
                      alt={institution.name}
                      className="w-24 h-24 object-contain rounded-2xl bg-white p-3 shadow-xl"
                    />
                  ) : (
                    <BuildingOffice2Icon className="w-16 h-16 text-white/90" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-semibold flex items-center gap-2">
                      <BookOpenIcon className="w-4 h-4" />
                      {institution._count?.disciplines || 0}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-2">
                    {institution.name}
                  </h2>
                  {institution.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {institution.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{institution._count?.users || 0}</span>
                      </div>
                      <span>estudantes</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                      <span>Estudar</span>
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BuildingOffice2Icon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma instituição encontrada</h3>
            <p className="text-gray-500 mb-6">Tente ajustar a sua pesquisa</p>
            <button
              onClick={() => setSearch('')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Limpar pesquisa
            </button>
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
