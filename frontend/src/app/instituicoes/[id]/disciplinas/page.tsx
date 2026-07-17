'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function DisciplinasPage() {
  const [subjects, setSubjects] = useState([]);
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/instituicoes"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ← Voltar às Instituições
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {institution?.name || 'Disciplinas'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Carregando disciplinas...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma disciplina disponível para esta instituição.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject: any) => (
              <Link
                key={subject.id}
                href={`/instituicoes/${params.id}/disciplinas/${subject.id}/exames`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {subject.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Clique para ver os exames disponíveis
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
