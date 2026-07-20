'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Bell,
  LogOut,
  User,
  BookOpen,
  Download,
  Play,
  Target,
  Trophy,
  RefreshCw,
  Book,
  ChevronRight,
  TrendingUp,
  Award,
  Star,
} from 'lucide-react';

// Tipos
interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  discipline: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
}

interface QuickExam {
  id: string;
  title: string;
  discipline: string;
  questions: number;
  duration: number;
  price: number;
  isFree: boolean;
  completed?: boolean;
  bestScore?: number;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [quickExams, setQuickExams] = useState<QuickExam[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuth();
    fetchUserData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }
    setLoading(false);
  };

  const fetchUserData = async () => {
    // Simular dados do usuário
    setExamResults([
      { id: '1', examId: '1', examTitle: 'Matemática para Admissão', discipline: 'Matemática', date: '2026-07-19', totalQuestions: 20, correctAnswers: 16, wrongAnswers: 4, percentage: 80, passed: true, timeSpent: 35 },
      { id: '2', examId: '2', examTitle: 'Física Geral', discipline: 'Física', date: '2026-07-18', totalQuestions: 15, correctAnswers: 9, wrongAnswers: 6, percentage: 60, passed: false, timeSpent: 28 },
      { id: '3', examId: '3', examTitle: 'Português - Gramática', discipline: 'Português', date: '2026-07-17', totalQuestions: 25, correctAnswers: 22, wrongAnswers: 3, percentage: 88, passed: true, timeSpent: 42 },
      { id: '4', examId: '4', examTitle: 'Química Orgânica', discipline: 'Química', date: '2026-07-15', totalQuestions: 18, correctAnswers: 12, wrongAnswers: 6, percentage: 67, passed: false, timeSpent: 30 },
    ]);

    setQuickExams([
      { id: '1', title: 'Matemática para Admissão UCM', discipline: 'Matemática', questions: 40, duration: 60, price: 0, isFree: true, completed: true, bestScore: 80 },
      { id: '2', title: 'Física Geral', discipline: 'Física', questions: 30, duration: 45, price: 0, isFree: true, completed: true, bestScore: 60 },
      { id: '3', title: 'Português e Literatura', discipline: 'Português', questions: 50, duration: 90, price: 299, isFree: false, completed: false },
      { id: '4', title: 'Química Orgânica', discipline: 'Química', questions: 35, duration: 60, price: 199, isFree: false, completed: false },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const totalExams = examResults.length;
  const passedExams = examResults.filter(r => r.passed).length;
  const averageScore = totalExams > 0 
    ? Math.round(examResults.reduce((acc, r) => acc + r.percentage, 0) / totalExams) 
    : 0;
  const totalCorrect = examResults.reduce((acc, r) => acc + r.correctAnswers, 0);
  const totalWrong = examResults.reduce((acc, r) => acc + r.wrongAnswers, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Bem-vindo, {user?.name?.split(' ')[0] || 'Utilizador'}! 👋
              </h1>
              <p className="text-green-100 text-sm">
                Acompanhe o seu progresso e continue a estudar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/perfil" className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={handleLogout} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas Pessoais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{passedExams}/{totalExams}</p>
                <p className="text-xs text-gray-500">Exames Passados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                <p className="text-xs text-gray-500">Média Geral</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{totalCorrect}</p>
                <p className="text-xs text-gray-500">Questões Corretas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{totalWrong}</p>
                <p className="text-xs text-gray-500">Questões Erradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progresso Geral */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Progresso Geral
            </h2>
            <span className="text-sm text-gray-500">Meta: 80% para passar</span>
          </div>
          <div className="relative">
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  averageScore >= 80 ? 'bg-green-500' : averageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(averageScore, 100)}%` }}
              />
            </div>
            {/* Marcador 80% */}
            <div className="absolute top-0 left-1/5 h-6 w-0.5 bg-gray-800" title="Meta: 80%" />
            <span className="absolute top-1 left-1/5 transform -translate-x-1/2 text-xs text-gray-600">80%</span>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={`font-medium ${averageScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
              {averageScore >= 80 ? '✅ Aprovado!' : averageScore >= 50 ? '⚠️ Em progresso' : '❌ Precisa melhorar'}
            </span>
            <span className="text-gray-500">{totalExams} exames realizados</span>
          </div>
        </div>

        {/* Resultados dos Exames Recentes */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Meus Resultados
            </h2>
            <Link href="/meus-exames" className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y">
            {examResults.map((result) => (
              <div key={result.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{result.examTitle}</h3>
                      {result.passed ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          ✓ Passou
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          ✗ Reprovou
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{result.discipline} • {result.date}</p>
                    
                    {/* Barra de resultado */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${result.percentage}%` }}
                        />
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${100 - result.percentage}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${
                        result.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.percentage}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{result.correctAnswers}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{result.wrongAnswers}</span>
                      </div>
                    </div>
                    
                    {!result.passed && (
                      <Link
                        href={`/exames/${result.examId}`}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-1"
                      >
                        <RefreshCw className="w-4 h-4" /> Refazer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exames Rápidos */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Play className="w-5 h-5 text-green-600" />
              Exames Rápidos
            </h2>
            <Link href="/meus-exames" className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickExams.slice(0, 4).map((exam) => (
              <div key={exam.id} className="border rounded-xl p-4 hover:border-green-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500">{exam.discipline}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    exam.isFree ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {exam.isFree ? 'Grátis' : `${exam.price} MZN`}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" /> {exam.questions} questões
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {exam.duration} min
                  </span>
                  {exam.bestScore !== undefined && (
                    <span className={`flex items-center gap-1 ${
                      exam.bestScore >= 80 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      <Star className="w-4 h-4" /> {exam.bestScore}%
                    </span>
                  )}
                </div>
                
                <Link
                  href={`/exames/${exam.id}`}
                  className={`w-full py-2 rounded-lg font-medium text-center flex items-center justify-center gap-2 ${
                    exam.completed
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {exam.completed ? (
                    <>
                      <RefreshCw className="w-4 h-4" /> Refazer Exame
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Iniciar Exame
                    </>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/disciplinas" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Disciplinas</h3>
            <p className="text-xs text-gray-500 mt-1">Ver todas</p>
          </Link>

          <Link href="/manuais" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Manuais</h3>
            <p className="text-xs text-gray-500 mt-1">Baixar PDF</p>
          </Link>

          <Link href="/instituicoes" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Exames</h3>
            <p className="text-xs text-gray-500 mt-1">Praticar</p>
          </Link>

          <Link href="/perfil" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Perfil</h3>
            <p className="text-xs text-gray-500 mt-1">Editar</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
