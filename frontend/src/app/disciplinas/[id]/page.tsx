'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Book, 
  FileText, 
  Download, 
  Loader2, 
  ArrowLeft,
  BookOpen,
  Users
} from 'lucide-react';

interface Manual {
  id: string;
  title: string;
  description: string;
  discipline: string;
  fileUrl: string;
  fileName: string;
  downloads: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: number;
  price: number;
}

interface Discipline {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const DISCIPLINES: Record<string, Discipline> = {
  '1': { id: '1', name: 'Matemática', description: 'Álgebra, Geometria, Trigonometria e Cálculo', icon: '📐' },
  '2': { id: '2', name: 'Física', description: 'Mecânica, Termodinâmica, Eletricidade e Óptica', icon: '⚡' },
  '3': { id: '3', name: 'Química', description: 'Química Geral, Orgânica e Inorgânica', icon: '🧪' },
  '4': { id: '4', name: 'Português', description: 'Gramática, Literatura e Interpretação de Texto', icon: '📖' },
  '5': { id: '5', name: 'Biologia', description: 'Biologia Celular, Genética, Ecologia e Fisiologia', icon: '🧬' },
  '6': { id: '6', name: 'História', description: 'História de Moçambique, África e Mundo', icon: '🏛️' },
  '7': { id: '7', name: 'Geografia', description: 'Geografia Física, Humana e de Moçambique', icon: '🌍' },
};

export default function DisciplinaPage() {
  const params = useParams();
  const disciplineId = params.id as string;
  const discipline = DISCIPLINES[disciplineId] || { id: disciplineId, name: 'Disciplina', description: '', icon: '📚' };

  const [manuals, setManuals] = useState<Manual[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'exams' | 'manuals'>('exams');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchData();
  }, [disciplineId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const examsRes = await fetch(`${apiUrl}/exams?disciplineId=${disciplineId}&status=PUBLISHED`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const manualsRes = await fetch(`${apiUrl}/manuals?disciplineId=${disciplineId}&active=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (examsRes.ok) {
        const examsData = await examsRes.json();
        setExams(Array.isArray(examsData) ? examsData : []);
      } else {
        setExams([
          { id: '1', title: `Exame de ${discipline.name} - Nível 1`, description: `Questões básicas de ${discipline.name}`, questions: 30, duration: 45, price: 299 },
          { id: '2', title: `Exame de ${discipline.name} - Nível 2`, description: `Questões intermédias de ${discipline.name}`, questions: 40, duration: 60, price: 299 },
        ]);
      }

      if (manualsRes.ok) {
        const manualsData = await manualsRes.json();
        setManuals(Array.isArray(manualsData) ? manualsData : []);
      } else {
        setManuals([
          { id: '1', title: `Guia de ${discipline.name}`, description: `Manual completo de ${discipline.name}`, discipline: discipline.name, fileUrl: '#', fileName: `${discipline.name.toLowerCase()}.pdf`, downloads: 89 },
          { id: '2', title: `Exercícios de ${discipline.name}`, description: `Pratique com estes exercícios`, discipline: discipline.name, fileUrl: '#', fileName: `exercicios_${discipline.name.toLowerCase()}.pdf`, downloads: 45 },
        ]);
      }
    } catch (err) {
      setExams([{ id: '1', title: `Exame de ${discipline.name}`, description: `Questões de ${discipline.name}`, questions: 30, duration: 45, price: 299 }]);
      setManuals([{ id: '1', title: `Manual de ${discipline.name}`, description: `Complete guide`, discipline: discipline.name, fileUrl: '#', fileName: 'manual.pdf', downloads: 45 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/home" className="hover:text-green-600">Início</Link>
          <span>/</span>
          <Link href="/disciplinas" className="hover:text-green-600">Disciplinas</Link>
          <span>/</span>
          <span className="text-gray-900">{discipline.name}</span>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {discipline.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{discipline.name}</h1>
              <p className="text-green-100">{discipline.description}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('exams')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'exams' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Exames ({exams.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manuals')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'manuals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Manuais ({manuals.length})
            </div>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-500">A carregar...</p>
          </div>
        ) : (
          <>
            {activeTab === 'exams' && (
              <div className="space-y-4">
                {exams.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum exame disponível</p>
                  </div>
                ) : (
                  exams.map((exam) => (
                    <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{exam.title}</h3>
                          <p className="text-gray-500 mb-4">{exam.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><FileText className="w-4 h-4" />{exam.questions} questões</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{exam.duration} minutos</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 mb-2">{exam.price} MZN</p>
                          <Link href={`/pagamentos/${exam.id}`} className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                            Comprar
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'manuals' && (
              <div className="space-y-4">
                {manuals.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum manual disponível</p>
                  </div>
                ) : (
                  manuals.map((manual) => (
                    <div key={manual.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{manual.title}</h3>
                            <p className="text-gray-500 mb-2">{manual.description}</p>
                            <span className="text-sm text-gray-400">{manual.fileName}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-400">{manual.downloads} downloads</span>
                          </div>
                        </div>
                        <a href={manual.fileUrl} download className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                          Baixar
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-8">
          <Link href="/home" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            Voltar às disciplinas
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
