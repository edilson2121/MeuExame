'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  GraduationCap,
  FileQuestion,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Activity,
  Loader2,
  Shield,
  AlertCircle,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminAuthGuard({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'ADMIN') {
        // User is logged in but not admin
        router.push('/');
        return;
      }
      setIsAdmin(true);
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/admin/login');
      return;
    }
    setChecking(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">A verificar permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-slate-400 mb-6">Apenas administradores podem aceder a esta área.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition-colors">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthGuard>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthGuard>
  );
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutions: 0,
    publishedExams: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const token = localStorage.getItem('token');

        const [usersRes, institutionsRes, examsRes, paymentsRes] = await Promise.all([
          fetch(`${apiUrl}/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/institutions`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/exams?status=PUBLISHED`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/payments?status=PENDING`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const users = await usersRes.json();
        const institutions = await institutionsRes.json();
        const exams = await examsRes.json();
        const payments = await paymentsRes.json();

        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalInstitutions: Array.isArray(institutions) ? institutions.length : 0,
          publishedExams: Array.isArray(exams) ? exams.length : 0,
          pendingPayments: Array.isArray(payments) ? payments.length : 0,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-600' },
    { href: '/admin/instituicoes', icon: Building2, label: 'Instituições', color: 'text-green-600' },
    { href: '/admin/disciplinas', icon: BookOpen, label: 'Disciplinas', color: 'text-purple-600' },
    { href: '/admin/exames', icon: FileQuestion, label: 'Exames', color: 'text-orange-600' },
    { href: '/admin/usuarios', icon: Users, label: 'Utilizadores', color: 'text-pink-600' },
    { href: '/admin/pagamentos', icon: CreditCard, label: 'Pagamentos', color: 'text-yellow-600' },
    { href: '/admin/configuracoes', icon: Settings, label: 'Configurações', color: 'text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/admin/dashboard" className="flex items-center">
                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
                  ME
                </div>
                <span className="ml-2 text-xl font-bold text-gray-800 hidden sm:block">MeuExame</span>
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full hidden sm:block">
                  Admin
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 border-r border-gray-200 pr-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Utilizadores</p>
                  <p className="text-sm font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Instituições</p>
                  <p className="text-sm font-bold text-gray-800">{stats.totalInstitutions}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Exames</p>
                  <p className="text-sm font-bold text-gray-800">{stats.publishedExams}</p>
                </div>
                {stats.pendingPayments > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-yellow-500">Pendentes</p>
                    <p className="text-sm font-bold text-yellow-600">{stats.pendingPayments}</p>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name || 'Admin'}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Terminar Sessão
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } pt-16`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon size={20} className={`mr-3 ${isActive ? item.color : ''}`} />
                      <span className="font-medium">{item.label}</span>
                      {item.href === '/admin/pagamentos' && stats.pendingPayments > 0 && (
                        <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {stats.pendingPayments}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-4 text-white">
                <p className="font-semibold text-sm">Painel Admin</p>
                <p className="text-xs text-green-100 mt-1">Gestão completa do sistema</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
