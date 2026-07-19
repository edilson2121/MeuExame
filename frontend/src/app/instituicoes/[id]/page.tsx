'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Building2,
  ChevronRight,
  BookOpen,
  Loader2,
  GraduationCap,
  FileQuestion,
} from 'lucide-react';

interface Discipline {
  id: string;
  name: string;
  description: string | null;
  _count: {
    exams: number;
  };
}

interface Institution {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
}

function InstitutionDisciplinesContent() {
  const params = useParams();
  const institutionId = params.id as string;
  
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch institution
      const instRes = await fetch(`${apiUrl}/institutions/${institutionId}`, { headers });
      if (instRes.ok) {
        const instData = await instRes.json();
        setInstitution(instData);
      }

      // Fetch disciplines
      const discRes = await fetch(`${apiUrl}/disciplines?institutionId=${institutionId}`, { headers });
      if (discRes.ok) {
        const discData = await discRes.json();
        setDisciplines(Array.isArray(discData) ? discData : []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback
      setInstitution({ id: institutionId, name: 'Universidade Eduardo Mondlane', logo: null, description: 'Descrição da instituição' });
      setDisciplines([
        { id: '1', name: 'Matemática', description: 'Disciplina de matemática', _count: { exams: 5 } },
        { id: '2', name: 'Física', description: 'Disciplina de física', _count: { exams: 3 } },
        { id: '3', name: 'Química', description: 'Disciplina de química', _count: { exams: 4 } },
        { id: '4', name: 'Biologia', description: 'Disciplina de biologia', _count: { exams: 2 } },
      ]);
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <Header showBackButton backHref="/instituicoes" />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Institution Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-24 bg-gradient-to-r from-primary to-primary-light flex items-center px-8">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 size={32} className="text-white" />
            </div>
            <div className="ml-4 text-white">
              <h1 className="text-2xl font-bold">{institution?.name}</h1>
              {institution?.description && (
                <p className="text-green-100 text-sm mt-1">{institution.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Disciplines Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Disciplinas</h2>
          <p className="text-gray-500 text-sm mt-1">
            Selecione uma disciplina para ver os exames disponíveis
          </p>
        </div>

        {disciplines.length > 0 ? (
          <div className="space-y-4">
            {disciplines.map((discipline, index) => (
              <Link
                key={discipline.id}
                href={`/disciplinas/${discipline.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-green-200 transition-all block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <GraduationCap size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{discipline.name}</h3>
                      {discipline.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{discipline.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FileQuestion size={14} />
                          {discipline._count?.exams || 0} exames
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Nenhuma disciplina disponível</h3>
            <p className="text-gray-500 mt-2">Esta instituição ainda não tem disciplinas</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function InstitutionDisciplinesPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <InstitutionDisciplinesContent />
    </ProtectedRoute>
  );
}
