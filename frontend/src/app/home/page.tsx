'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  GraduationCap,
  BookOpen,
  FileQuestion,
  Trophy,
  Users,
  ChevronRight,
  Search,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Play,
  Lock,
  User,
  LogOut,
  Settings,
  Award,
  BarChart3,
} from 'lucide-react';

interface Stats {
  completedExams: number;
  averageScore: number;
  totalPoints: number;
  rank: number;
}

interface Institution {
  id: string;
  name: string;
  description?: string;
  _count?: { disciplines: number; users: number };
}

interface RecentExam {
  id: string;
  title: string;
  score: number;
  completedAt: string;
}

function HomeContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    completedExams: 0,
    averageScore: 0,
    totalPoints: 0,
    rank: 0,
  });
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch institutions
      try {
        const instRes = await fetch(`${apiUrl}/institutions`, { headers });
        if (instRes.ok) {
          const data = await instRes.json();
          setInstitutions(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (e) {
        console.warn('Instituições não carregadas');
      }

      // Demo data for stats
      setStats({
        completedExams: 12,
        averageScore: 78,
        totalPoints: 1560,
        rank: 5,
      });

      setRecentExams([
        { id: '1', title: 'Matemática - Exame 2023', score: 85, completedAt: new Date().toISOString() },
        { id: '2', title: 'Física - Exame 2022', score: 72, completedAt: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Bem-vindo, {user?.name?.split(' ')[0] || 'Utilizador'}! 👋
                </h1>
                <p className="text-green-100 mt-1">Continue a sua jornada de aprendizagem</p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-bold">{stats.completedExams}</p>
                  <p className="text-xs text-green-100">Exames</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                  <p className="text-xs text-green-100">Média</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-bold">#{stats.rank}</p>
                  <p className="text-xs text-green-100">Ranking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="container mx-auto px-4 -mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/instituicoes"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <GraduationCap className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">Instituições</h3>
              <p className="text-sm text-gray-500">Explorar cursos</p>
            </Link>

            <Link
              href="/exames"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <FileQuestion className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">Exames</h3>
              <p className="text-sm text-gray-500">Realizar testes</p>
            </Link>

            <Link
              href="/resultados"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
                <Trophy className="text-yellow-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">Resultados</h3>
              <p className="text-sm text-gray-500">Ver pontuação</p>
            </Link>

            <Link
              href="/perfil"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <User className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">Perfil</h3>
              <p className="text-sm text-gray-500">Editar dados</p>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Institutions */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Instituições Disponíveis</h2>
                  <Link href="/instituicoes" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                    Ver todas <ChevronRight size={16} />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {institutions.length > 0 ? institutions.map((inst) => (
                    <Link
                      key={inst.id}
                      href={`/instituicoes/${inst.id}`}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="text-green-600" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{inst.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{inst.description || 'Instituição de ensino'}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} />
                              {inst._count?.disciplines || 0} disciplinas
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {inst._count?.users || 0} alunos
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <>
                      <Link
                        href="/instituicoes/1"
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="text-green-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">USTM</h3>
                            <p className="text-sm text-gray-500">Universidade São Tomás</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span>12 disciplinas</span>
                              <span>245 alunos</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link
                        href="/instituicoes/2"
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="text-blue-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Unilúrio</h3>
                            <p className="text-sm text-gray-500">Universidade Lúrio</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span>8 disciplinas</span>
                              <span>189 alunos</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </section>

              {/* Recent Exams */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Exames Recentes</h2>
                  <Link href="/exames" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                    Ver todos <ChevronRight size={16} />
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {recentExams.length > 0 ? recentExams.map((exam) => (
                    <Link
                      key={exam.id}
                      href={`/exames/${exam.id}`}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileQuestion className="text-orange-600" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{exam.title}</h3>
                        <p className="text-sm text-gray-500">Concluído em {new Date(exam.completedAt).toLocaleDateString('pt-MZ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{exam.score}%</div>
                        <div className="text-xs text-gray-400">pontuação</div>
                      </div>
                    </Link>
                  )) : (
                    <Link
                      href="/exames"
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Play className="text-orange-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Matemática - Exame 2023</h3>
                        <p className="text-sm text-gray-500">Explore exames disponíveis</p>
                      </div>
                      <div className="text-green-600 font-medium flex items-center gap-1">
                        Iniciar <ChevronRight size={16} />
                      </div>
                    </Link>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ranking */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="text-yellow-500" size={20} />
                  <h3 className="font-bold text-gray-900">Ranking</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-sm">1</span>
                    <span className="flex-1 font-medium text-gray-900">Ana Cubango</span>
                    <span className="text-green-600 font-semibold">2,450 pts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">2</span>
                    <span className="flex-1 font-medium text-gray-900">João Pemba</span>
                    <span className="text-green-600 font-semibold">2,120 pts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">3</span>
                    <span className="flex-1 font-medium text-gray-900">Maria Maputo</span>
                    <span className="text-green-600 font-semibold">1,890 pts</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 rounded-lg p-2 -mx-2">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">5</span>
                    <span className="flex-1 font-medium text-gray-900">{user?.name?.split(' ')[0] || 'Você'}</span>
                    <span className="text-green-600 font-semibold">{stats.totalPoints} pts</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Links Rápidos</h3>
                <div className="space-y-2">
                  <Link href="/manuais" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BookOpen className="text-blue-500" size={20} />
                    <span className="text-gray-700">Manuais de Estudo</span>
                  </Link>
                  <Link href="/resultados" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="text-green-500" size={20} />
                    <span className="text-gray-700">Histórico de Resultados</span>
                  </Link>
                  <Link href="/configuracoes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="text-gray-500" size={20} />
                    <span className="text-gray-700">Configurações</span>
                  </Link>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold">{user?.name || 'Utilizador'}</h3>
                    <p className="text-green-100 text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{stats.completedExams}</p>
                    <p className="text-xs text-green-100">Exames</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{stats.averageScore}%</p>
                    <p className="text-xs text-green-100">Média</p>
                  </div>
                </div>
                <Link
                  href="/perfil"
                  className="mt-4 w-full block text-center py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors font-medium"
                >
                  Ver Perfil Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <HomeContent />
    </ProtectedRoute>
  );
}
