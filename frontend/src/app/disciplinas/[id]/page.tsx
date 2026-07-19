'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  BookOpen,
  FileQuestion,
  Loader2,
  Lock,
  Unlock,
  Clock,
  DollarSign,
  Play,
  Link as LinkIcon,
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  totalQuestions: number;
  accessType: 'FREE' | 'PAID';
  price: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  discipline: { id: string; name: string };
  institution: { id: string; name: string };
}

interface Discipline {
  id: string;
  name: string;
  description: string | null;
  institution: { id: string; name: string };
}

interface Content {
  id: string;
  title: string;
  type: string;
  url: string | null;
  views: number;
}

function DisciplineExamsContent() {
  const params = useParams();
  const disciplineId = params.id as string;
  
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch discipline
      const discRes = await fetch(`${apiUrl}/disciplines/${disciplineId}`, { headers });
      if (discRes.ok) {
        const discData = await discRes.json();
        setDiscipline(discData);
      }

      // Fetch exams for this discipline
      const examsRes = await fetch(`${apiUrl}/exams?disciplineId=${disciplineId}&status=PUBLISHED`, { headers });
      if (examsRes.ok) {
        const examsData = await examsRes.json();
        setExams(Array.isArray(examsData) ? examsData : []);
      }

      // Fetch related content/links
      const contentRes = await fetch(`${apiUrl}/contents?disciplineId=${disciplineId}`, { headers });
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContents(Array.isArray(contentData) ? contentData.filter((c: any) => c.isActive) : []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback
      setDiscipline({ 
        id: disciplineId, 
        name: 'Matemática', 
        description: 'Disciplina de matemática para exames de admissão',
        institution: { id: '1', name: 'Universidade Eduardo Mondlane' }
      });
      setExams([
        { 
          id: '1', 
          title: 'Matemática - Exame 2023', 
          description: 'Exame de admissão Matemática 2023',
          duration: 120,
          totalQuestions: 40,
          accessType: 'FREE',
          price: null,
          status: 'PUBLISHED',
          discipline: { id: disciplineId, name: 'Matemática' },
          institution: { id: '1', name: 'UEM' }
        },
        { 
          id: '2', 
          title: 'Matemática - Exame 2024', 
          description: 'Exame de admissão Matemática 2024',
          duration: 120,
          totalQuestions: 50,
          accessType: 'PAID',
          price: 150,
          status: 'PUBLISHED',
          discipline: { id: disciplineId, name: 'Matemática' },
          institution: { id: '1', name: 'UEM' }
        },
      ]);
      setContents([
        { id: '1', title: 'Manual de Matemática', type: 'LINK', url: 'https://exemplo.com/manual.pdf', views: 125 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [disciplineId]);

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
      <Header showBackButton backHref={`/instituicoes/${discipline?.institution?.id}`} />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Discipline Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{discipline?.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{discipline?.institution?.name}</p>
              {discipline?.description && (
                <p className="text-gray-600 text-sm mt-2">{discipline.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content/Links Section */}
        {contents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LinkIcon size={20} className="text-blue-500" />
              Materiais de Estudo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contents.map((content) => (
                <a
                  key={content.id}
                  href={content.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <LinkIcon size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{content.title}</h3>
                      <p className="text-xs text-gray-400">{content.views} visualizações</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Exams Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Exames Disponíveis</h2>
          <p className="text-gray-500 text-sm mt-1">
            {exams.length} exame(s) disponível(is)
          </p>
        </div>

        {exams.length > 0 ? (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          exam.accessType === 'FREE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {exam.accessType === 'FREE' ? (
                          <span className="flex items-center gap-1">
                            <Unlock size={12} /> Grátis
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock size={12} /> Pago
                          </span>
                        )}
                      </span>
                    </div>
                    
                    {exam.description && (
                      <p className="text-sm text-gray-500 mb-3">{exam.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileQuestion size={16} />
                        {exam.totalQuestions} questões
                      </span>
                      {exam.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {exam.duration} min
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {exam.accessType === 'PAID' && exam.price && (
                      <span className="text-xl font-bold text-green-600">{exam.price} MZN</span>
                    )}
                    
                    <Link
                      href={exam.accessType === 'FREE' ? `/exames/${exam.id}` : `/pagamentos/${exam.id}`}
                      className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                        exam.accessType === 'FREE'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {exam.accessType === 'FREE' ? (
                        <>
                          <Play size={18} />
                          Iniciar
                        </>
                      ) : (
                        <>
                          <DollarSign size={18} />
                          Comprar
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <FileQuestion size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Nenhum exame disponível</h3>
            <p className="text-gray-500 mt-2">Esta disciplina ainda não tem exames publicados</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function DisciplineExamsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DisciplineExamsContent />
    </ProtectedRoute>
  );
}
