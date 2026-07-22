'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  GraduationCap,
  FileQuestion,
  ChevronRight,
  Play,
  User,
  LogOut,
  Settings,
  Bell,
  Menu,
  X,
  Search,
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  description?: string;
  disciplinesCount?: number;
  examsCount?: number;
}

interface Exam {
  id: string;
  title: string;
  discipline: string;
  institution: string;
  duration: number;
  questionsCount: number;
}

function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2">
            <div className="bg-[#10A63D] text-white px-2 py-0.5 rounded-lg font-bold text-sm">ME</div>
            <span className="font-bold text-gray-900">MeuExame</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/notificacoes" className="p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-500 hover:text-gray-700 lg:hidden">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#10A63D] rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || 'Utilizador'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              <Link href="/home" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                <GraduationCap size={18} /> Início
              </Link>
              <Link href="/instituicoes" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                <GraduationCap size={18} /> Instituições
              </Link>
              <Link href="/exames" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileQuestion size={18} /> Meus Exames
              </Link>
              <Link href="/perfil" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                <User size={18} /> Perfil
              </Link>
              <Link href="/configuracoes" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Settings size={18} /> Configurações
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut size={18} /> Sair
              </button>
            </nav>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

function HomeContent() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
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

      try {
        const [instRes, examsRes] = await Promise.all([
          fetch(`${apiUrl}/institutions`, { headers }),
          fetch(`${apiUrl}/exams?status=PUBLISHED`, { headers })
        ]);
        
        if (instRes.ok) {
          const data = await instRes.json();
          setInstitutions(Array.isArray(data) ? data.slice(0, 6) : []);
        }
        if (examsRes.ok) {
          const data = await examsRes.json();
          setExams(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (e) {
        setInstitutions([
          { id: '1', name: 'UEM', description: 'Universidade Eduardo Mondlane', disciplinesCount: 5, examsCount: 12 },
          { id: '2', name: 'ISPT', description: 'Instituto Superior Polytechnic', disciplinesCount: 3, examsCount: 8 },
        ]);
        setExams([
          { id: '1', title: 'Simulado Geral Matemática', discipline: 'Matemática', institution: 'UEM', duration: 90, questionsCount: 20 },
          { id: '2', title: 'Teste de Física', discipline: 'Física', institution: 'UEM', duration: 60, questionsCount: 15 },
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#10A63D] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar exames..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D]/20 focus:border-[#10A63D]"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/instituicoes"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#10A63D]/30 transition-all"
          >
            <div className="w-10 h-10 bg-[#10A63D]/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-[#10A63D]" size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Instituições</p>
              <p className="text-xs text-gray-500">Ver cursos</p>
            </div>
          </Link>
          <Link
            href="/exames"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#10A63D]/30 transition-all"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileQuestion className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Exames</p>
              <p className="text-xs text-gray-500">Fazer testes</p>
            </div>
          </Link>
        </div>

        {/* Exames Disponíveis */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Exames Disponíveis</h2>
            <Link href="/exames" className="text-[#10A63D] text-sm font-medium">Ver todos</Link>
          </div>
          
          <div className="space-y-3">
            {exams.length > 0 ? exams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exames/${exam.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-[#10A63D]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10A63D] to-[#0e9135] rounded-xl flex items-center justify-center text-white shrink-0">
                    <FileQuestion size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500">{exam.discipline} • {exam.institution}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{exam.duration} min</span>
                      <span>•</span>
                      <span>{exam.questionsCount} questões</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#10A63D]">
                    <Play size={16} />
                    <span className="text-sm font-medium">Iniciar</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <FileQuestion size={40} className="mx-auto mb-2 text-gray-300" />
                <p>Nenhum exame disponível</p>
              </div>
            )}
          </div>
        </section>

        {/* Instituições */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Instituições</h2>
            <Link href="/instituicoes" className="text-[#10A63D] text-sm font-medium">Ver todas</Link>
          </div>
          
          <div className="space-y-2">
            {institutions.map((inst) => (
              <Link
                key={inst.id}
                href={`/instituicoes/${inst.id}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#10A63D]/30 transition-all"
              >
                <div className="w-10 h-10 bg-[#10A63D] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {inst.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{inst.name}</h3>
                  <p className="text-xs text-gray-500">{inst.disciplinesCount || 0} disciplinas • {inst.examsCount || 0} exames</p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </UserLayout>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <HomeContent />
    </ProtectedRoute>
  );
}
