'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Book,
  Search,
  ChevronRight,
  FileText,
  Users,
  Loader2,
  BookOpen,
} from 'lucide-react';

interface Discipline {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  _count: {
    exams: number;
    questions: number;
  };
}

function DisciplinesContent() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDisciplines = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      let data: any[] = [];
      try {
        const res = await fetch(`${apiUrl}/subjects`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (fetchError) {
        console.warn('Backend indisponível, usando dados de demonstração');
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setDisciplines(data);
      } else {
        // Fallback data
        setDisciplines([
          { id: '1', name: 'Matemática', description: 'Álgebra, geometria, trigonometria e cálculo', icon: null, _count: { exams: 12, questions: 450 } },
          { id: '2', name: 'Física', description: 'Mecânica, termodinâmica, óptica e eletricidade', icon: null, _count: { exams: 8, questions: 320 } },
          { id: '3', name: 'Química', description: 'Química geral, orgânica e inorgânica', icon: null, _count: { exams: 6, questions: 280 } },
          { id: '4', name: 'Português', description: 'Gramática, literatura e redação', icon: null, _count: { exams: 10, questions: 400 } },
          { id: '5', name: 'Biologia', description: 'Biologia celular, genética e ecologia', icon: null, _count: { exams: 7, questions: 310 } },
          { id: '6', name: 'História', description: 'História de Moçambique e do mundo', icon: null, _count: { exams: 5, questions: 220 } },
          { id: '7', name: 'Geografia', description: 'Geografia física, humana e de Moçambique', icon: null, _count: { exams: 4, questions: 180 } },
          { id: '8', name: 'Inglês', description: 'Gramática, vocabulário e compreensão', icon: null, _count: { exams: 6, questions: 260 } },
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisciplines();
  }, [fetchDisciplines]);

  const filteredDisciplines = disciplines.filter(discipline =>
    discipline.name.toLowerCase().includes(search.toLowerCase()) ||
    discipline.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">A carregar disciplinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Disciplinas</h1>
          <p className="text-green-100">
            Escolha uma disciplina para ver os exames disponíveis
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar disciplina..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
          </div>
        </div>

        {/* Disciplines Grid */}
        {filteredDisciplines.length === 0 ? (
          <div className="text-center py-12">
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma disciplina encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDisciplines.map((discipline, index) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-yellow-500 to-orange-500',
                'from-green-500 to-emerald-600',
                'from-purple-500 to-pink-500',
                'from-red-500 to-rose-600',
                'from-cyan-500 to-teal-600',
                'from-amber-500 to-orange-600',
                'from-indigo-500 to-purple-600',
              ];
              const icons = ['📐', '⚡', '🧪', '📖', '🧬', '🏛️', '🌍', '🌐'];
              
              return (
                <Link
                  key={discipline.id}
                  href={`/disciplinas/${discipline.id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className={`h-24 bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center`}>
                    <span className="text-5xl">{icons[index % icons.length]}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors">
                      {discipline.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {discipline.description || 'Disciplina disponível para estudo'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {discipline._count.exams} exames
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {discipline._count.questions} questões
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function DisciplinesPage() {
  return (
    <ProtectedRoute>
      <DisciplinesContent />
    </ProtectedRoute>
  );
}
