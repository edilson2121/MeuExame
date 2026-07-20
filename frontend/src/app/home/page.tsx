'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Book,
  FileText,
  Users,
  Award,
  ChevronRight,
  Search,
  Star,
  Clock,
  TrendingUp,
  Loader2,
  Bell,
  Settings,
  LogOut,
  User,
  BookOpen,
  Download,
  Play
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  discipline: string;
  questions: number;
  duration: number;
  price: number;
  imageUrl?: string;
}

interface Manual {
  id: string;
  title: string;
  description: string;
  discipline: string;
  disciplineId: string;
  fileUrl: string;
  downloads: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuth();
    fetchData();
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch exams
      const examsRes = await fetch(`${apiUrl}/exams?status=PUBLISHED`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (examsRes.ok) {
        const examsData = await examsRes.json();
        setExams(Array.isArray(examsData) ? examsData.slice(0, 6) : []);
      } else {
        setExams([
          { id: '1', title: 'Matemática para Admisão UCM', description: 'Exame completo de matemática', discipline: 'Matemática', questions: 40, duration: 60, price: 299 },
          { id: '2', title: 'Física Geral', description: 'Questões de física para técnicos', discipline: 'Física', questions: 30, duration: 45, price: 299 },
          { id: '3', title: 'Português e Literatura', description: 'Exame de português e literatura', discipline: 'Português', questions: 50, duration: 90, price: 299 },
          { id: '4', title: 'Química Orgânica', description: 'Exame de química para médicos', discipline: 'Química', questions: 35, duration: 60, price: 299 },
        ]);
      }

      // Fetch manuals
      const manualsRes = await fetch(`${apiUrl}/manuals?active=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (manualsRes.ok) {
        const manualsData = await manualsRes.json();
        setManuals(Array.isArray(manualsData) ? manualsData.slice(0, 6) : []);
      } else {
        setManuals([
          { id: '1', title: 'Guia de Preparação para Exames', description: 'Manual completo com dicas', discipline: 'Geral', disciplineId: '1', fileUrl: '#', downloads: 156 },
          { id: '2', title: 'Matemática para Iniciantes', description: 'Fundamentos de matemática', discipline: 'Matemática', disciplineId: '2', fileUrl: '#', downloads: 89 },
          { id: '3', title: 'Português - Gramática', description: 'Manual de gramática', discipline: 'Português', disciplineId: '3', fileUrl: '#', downloads: 67 },
        ]);
      }
    } catch (err) {
      setExams([
        { id: '1', title: 'Matemática para Admisão UCM', description: 'Exame completo de matemática', discipline: 'Matemática', questions: 40, duration: 60, price: 299 },
        { id: '2', title: 'Física Geral', description: 'Questões de física para técnicos', discipline: 'Física', questions: 30, duration: 45, price: 299 },
      ]);
      setManuals([
        { id: '1', title: 'Guia de Preparação para Exames', description: 'Manual completo com dicas', discipline: 'Geral', disciplineId: '1', fileUrl: '#', downloads: 156 },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.discipline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredManuals = manuals.filter(manual =>
    manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manual.discipline.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bem-vindo, {user?.name?.split(' ')[0] || 'Utilizador'}! 👋
              </h1>
              <p className="text-green-100">
                Prepare-se para exames de condução, escolas profissionais e muito mais.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/notificacoes"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span>Notificações</span>
              </Link>
              <Link
                href="/perfil"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar exames, manuais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
                <p className="text-sm text-gray-500">Exames</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{manuals.length}</p>
                <p className="text-sm text-gray-500">Manuais</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500">Certificados</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0%</p>
                <p className="text-sm text-gray-500">Progresso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              Exames Disponíveis
            </h2>
            <Link href="/exames" className="text-green-600 hover:text-green-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum exame encontrado</p>
              </div>
            ) : (
              filteredExams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mb-2">
                      {exam.discipline}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2">{exam.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{exam.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {exam.questions} questões
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.duration} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">{exam.price} MZN</span>
                      <Link
                        href={`/pagamentos/${exam.id}`}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Comprar
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Manuals Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Book className="w-6 h-6 text-blue-600" />
              Manuais de Estudo
            </h2>
            <Link href="/manuais" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManuals.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum manual encontrado</p>
              </div>
            ) : (
              filteredManuals.map((manual) => (
                <div key={manual.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Book className="w-10 h-10 text-white/80" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-2">
                      {manual.discipline}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2">{manual.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{manual.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {manual.downloads}
                      </span>
                    </div>
                    <a
                      href={manual.fileUrl}
                      download
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Baixar PDF
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Disciplines Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Disciplinas
            </h2>
            <Link href="/disciplinas" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Matemática', icon: '📐', color: 'from-blue-500 to-blue-600' },
              { name: 'Física', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
              { name: 'Química', icon: '🧪', color: 'from-green-500 to-emerald-600' },
              { name: 'Português', icon: '📖', color: 'from-purple-500 to-pink-500' },
              { name: 'Biologia', icon: '🧬', color: 'from-red-500 to-rose-600' },
              { name: 'História', icon: '🏛️', color: 'from-amber-500 to-orange-600' },
            ].map((discipline, i) => (
              <Link
                key={i}
                href={`/disciplinas/${i + 1}`}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${discipline.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                  {discipline.icon}
                </div>
                <p className="font-medium text-gray-900">{discipline.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
