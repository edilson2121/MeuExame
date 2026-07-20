'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  FileText,
  Search,
  Clock,
  BookOpen,
  Loader2,
  Play,
  CheckCircle,
  Lock,
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  discipline: string;
  institution: string;
  questions: number;
  duration: number;
  price: number;
  isFree: boolean;
  status: 'AVAILABLE' | 'LOCKED' | 'COMPLETED';
  score?: number;
}

function MeusExamesContent() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

  const fetchExams = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      let data: any[] = [];
      try {
        const res = await fetch(`${apiUrl}/exams?status=PUBLISHED`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (fetchError) {
        console.warn('Backend indisponível');
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setExams(data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description || 'Exame disponível',
          discipline: e.discipline?.name || 'Geral',
          institution: e.institution?.name || 'MeuExame',
          questions: e.questions?.length || 0,
          duration: e.duration || 30,
          price: e.price || 0,
          isFree: e.price === 0 || e.isFree,
          status: e.isFree ? 'AVAILABLE' : 'LOCKED',
        })));
      } else {
        setExams([
          { id: '1', title: 'Matemática para Admissão UCM', description: 'Exame completo de matemática', discipline: 'Matemática', institution: 'UCM', questions: 40, duration: 60, price: 0, isFree: true, status: 'AVAILABLE' },
          { id: '2', title: 'Física Geral', description: 'Questões de física para técnicos', discipline: 'Física', institution: 'ISUTC', questions: 30, duration: 45, price: 299, isFree: false, status: 'LOCKED' },
          { id: '3', title: 'Português e Literatura', description: 'Exame completo de português', discipline: 'Português', institution: 'UEM', questions: 50, duration: 90, price: 299, isFree: false, status: 'LOCKED' },
          { id: '4', title: 'Química Orgânica', description: 'Introdução à química orgânica', discipline: 'Química', institution: 'ISCTEM', questions: 35, duration: 60, price: 0, isFree: true, status: 'AVAILABLE' },
          { id: '5', title: 'História de Moçambique', description: 'Exame de história moçambicana', discipline: 'História', institution: 'UEM', questions: 25, duration: 40, price: 199, isFree: false, status: 'LOCKED' },
          { id: '6', title: 'Biologia Celular', description: 'Estudo da célula', discipline: 'Biologia', institution: 'UCM', questions: 30, duration: 45, price: 0, isFree: true, status: 'AVAILABLE' },
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase()) ||
                         exam.discipline.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'available' && exam.status === 'AVAILABLE') ||
                          (filter === 'completed' && exam.status === 'COMPLETED');
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">A carregar exames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Meus Exames</h1>
          <p className="text-green-100">Pratique e acompanhe o seu progresso</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar exames..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>Todos</button>
            <button onClick={() => setFilter('available')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${filter === 'available' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}><Play className="w-4 h-4" /> Disponíveis</button>
            <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}><CheckCircle className="w-4 h-4" /> Concluídos</button>
          </div>
        </div>

        {filteredExams.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum exame encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative">
                  <BookOpen className="w-12 h-12 text-white/80" />
                  {exam.status === 'COMPLETED' && exam.score !== undefined && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">{exam.score}%</div>
                  )}
                  {exam.status === 'LOCKED' && (
                    <div className="absolute top-3 right-3 bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><Lock className="w-3 h-3" /> Pago</div>
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mb-2">{exam.discipline}</span>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{exam.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{exam.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {exam.questions} questões</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {exam.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">{exam.isFree ? 'Grátis' : `${exam.price} MZN`}</span>
                    {exam.status === 'AVAILABLE' && (
                      <Link href={`/exames/${exam.id}`} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"><Play className="w-4 h-4" /> Fazer</Link>
                    )}
                    {exam.status === 'LOCKED' && (
                      <Link href={`/pagamentos/${exam.id}`} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"><Lock className="w-4 h-4" /> Comprar</Link>
                    )}
                    {exam.status === 'COMPLETED' && (
                      <Link href={`/exames/${exam.id}/resultado`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Ver</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function MeusExamesPage() {
  return <ProtectedRoute><MeusExamesContent /></ProtectedRoute>;
}
