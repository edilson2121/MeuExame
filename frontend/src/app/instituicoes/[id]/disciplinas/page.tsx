'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpenIcon, ArrowLeftIcon, BuildingOffice2Icon, FunnelIcon } from '@heroicons/react/24/outline';

export default function DisciplinasPage() {
  const [subjects, setSubjects] = useState([]);
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchInstitutionAndSubjects();
  }, [params.id]);

  const fetchInstitutionAndSubjects = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch institution
      const instResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const instData = await instResponse.json();
      setInstitution(instData);

      // Fetch subjects for this institution
      const subjectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/institution/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const subjectsData = await subjectsResponse.json();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = filter === 'all'
    ? subjects
    : subjects.filter((s: any) => s.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/instituicoes"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Voltar às Instituições
              </Link>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BuildingOffice2Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {institution?.name || 'Disciplinas'}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {subjects.length} {subjects.length === 1 ? 'disciplina disponível' : 'disciplinas disponíveis'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Filters */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
              }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('exatas')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'exatas'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
              }`}
          >
            Exatas
          </button>
          <button
            onClick={() => setFilter('humanas')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'humanas'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
              }`}
          >
            Humanas
          </button>
          <button
            onClick={() => setFilter('saude')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'saude'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
              }`}
          >
            Saúde
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando disciplinas...</p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-20">
            <BookOpenIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma disciplina disponível</h3>
            <p className="text-gray-500">Esta instituição ainda não possui disciplinas cadastradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject: any) => (
              <Link
                key={subject.id}
                href={`/instituicoes/${params.id}/disciplinas/${subject.id}/exames`}
                className="bg-white rounded-3xl shadow-lg border-2 border-green-100 hover:shadow-2xl hover:border-green-400 transition-all group transform hover:-translate-y-1 p-6"
              >
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpenIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Clique para ver os exames disponíveis
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {subject._count?.exams || 0} exames
                  </span>
                  <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Ver exames</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
