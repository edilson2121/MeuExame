'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building2,
  BookOpen,
  FileQuestion,
  CreditCard,
  TrendingUp,
  LogOut,
  ChevronRight,
  Plus,
  CheckCircle,
  Clock,
} from 'lucide-react';

// Dados de exemplo
const stats = {
  users: 3425,
  institutions: 12,
  exams: 48,
  revenue: 245600,
};

const menuItems = [
  { title: 'Dashboard', icon: <TrendingUp size={20} />, href: '/admin/dashboard', active: true },
  { title: 'Instituições', icon: <Building2 size={20} />, href: '/admin/instituicoes' },
  { title: 'Disciplinas', icon: <BookOpen size={20} />, href: '/admin/disciplinas' },
  { title: 'Exames', icon: <FileQuestion size={20} />, href: '/admin/exames' },
  { title: 'Utilizadores', icon: <Users size={20} />, href: '/admin/usuarios' },
  { title: 'Pagamentos', icon: <CreditCard size={20} />, href: '/admin/pagamentos' },
];

const recentExams = [
  { id: 1, title: 'Matemática UEM 2024', institution: 'UEM', students: 234, price: 299, status: 'published' },
  { id: 2, title: 'Física Geral', institution: 'UCM', students: 189, price: 199, status: 'published' },
  { id: 3, title: 'Química Orgânica', institution: 'UniLúrio', students: 156, price: 249, status: 'draft' },
];

const recentPayments = [
  { id: 1, user: 'Maria João', method: 'M-Pesa', amount: 299, status: 'completed' },
  { id: 2, user: 'Carlos Silva', method: 'M-Pesa', amount: 199, status: 'completed' },
  { id: 3, user: 'Ana Paula', method: 'e-Mola', amount: 149, status: 'pending' },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'published' || status === 'completed') {
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12} />{status === 'published' ? 'Publicado' : 'Concluído'}</span>;
  }
  if (status === 'pending') {
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock size={12} />Pendente</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Rascunho</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/admin/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold">ME</div>
            <div>
              <h1 className="text-base font-bold text-gray-900">MeuExame</h1>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <LogOut size={18} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:block">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Estudantes</p>
                  <p className="text-xl font-bold">{stats.users.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600"><Building2 size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Instituições</p>
                  <p className="text-xl font-bold">{stats.institutions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><FileQuestion size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Exames</p>
                  <p className="text-xl font-bold">{stats.exams}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><TrendingUp size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Receitas</p>
                  <p className="text-xl font-bold">{stats.revenue.toLocaleString()} MZN</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Link href="/admin/instituicoes" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-blue-600 font-medium">
              <Plus size={18} />Nova Instituição
            </Link>
            <Link href="/admin/exames" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-green-600 font-medium">
              <Plus size={18} />Novo Exame
            </Link>
            <Link href="/admin/usuarios" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-purple-600 font-medium">
              <Plus size={18} />Novo Utilizador
            </Link>
            <Link href="/admin/pagamentos" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-yellow-600 font-medium">
              <Plus size={18} />Ver Pagamentos
            </Link>
          </div>

          {/* Tables */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Exams */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Exames Recentes</h2>
                <Link href="/admin/exames" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Ver todos <ChevronRight size={16} />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{exam.title}</p>
                      <p className="text-sm text-gray-500">{exam.institution} • {exam.students} alunos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{exam.price} MZN</p>
                      <StatusBadge status={exam.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Pagamentos Recentes</h2>
                <Link href="/admin/pagamentos" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Ver todos <ChevronRight size={16} />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.user}</p>
                      <p className="text-sm text-gray-500">{payment.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{payment.amount} MZN</p>
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
