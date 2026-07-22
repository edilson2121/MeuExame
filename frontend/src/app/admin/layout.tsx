'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  FileQuestion,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Bell,
  FileText,
  Globe,
  Shield,
  UserCog,
  BarChart3,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ProtectedRoute>
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const mainMenuItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-green-500 to-emerald-500' },
    { href: '/admin/instituicoes', icon: Building2, label: 'Instituições', gradient: 'from-green-500 to-emerald-500' },
    { href: '/admin/disciplinas', icon: BookOpen, label: 'Disciplinas', gradient: 'from-green-500 to-emerald-500' },
    { href: '/admin/exames', icon: FileQuestion, label: 'Exames', gradient: 'from-green-500 to-emerald-500' },
  ];

  const managementMenuItems = [
    { href: '/admin/usuarios', icon: Users, label: 'Utilizadores', gradient: 'from-blue-500 to-blue-600' },
    { href: '/admin/pagamentos', icon: CreditCard, label: 'Pagamentos', gradient: 'from-yellow-500 to-yellow-600', badge: stats.pendingPayments },
    { href: '/admin/planos', icon: FileText, label: 'Planos', gradient: 'from-purple-500 to-purple-600' },
    { href: '/admin/paginas', icon: Globe, label: 'Páginas', gradient: 'from-cyan-500 to-cyan-600' },
  ];

  const systemMenuItems = [
    { href: '/admin/settings', icon: Settings, label: 'Configurações', gradient: 'from-gray-500 to-gray-600' },
    { href: '/admin/social-media', icon: Bell, label: 'Redes Sociais', gradient: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - Visily Style */}
      <nav className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-30 h-16">
        <div className="h-full px-4 lg:px-6">
          <div className="flex items-center justify-between h-full">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#10A63D] to-[#0e9135] text-white px-3 py-1.5 rounded-xl font-bold text-lg shadow-sm">
                  ME
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-gray-900">MeuExame</span>
                  <span className="ml-2 text-xs bg-[#10A63D]/10 text-[#10A63D] px-2 py-0.5 rounded-full font-medium">
                    Admin
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center gap-3">
              {/* Quick Stats - Desktop */}
              <div className="hidden xl:flex items-center gap-3 mr-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{stats.totalUsers}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{stats.totalInstitutions}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <FileQuestion size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{stats.publishedExams}</span>
                </div>
                {stats.pendingPayments > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
                    <CreditCard size={16} className="text-yellow-600" />
                    <span className="text-sm font-semibold text-yellow-700">{stats.pendingPayments} pendentes</span>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10A63D] to-[#10A63D]/80 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/home"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Home size={16} className="text-gray-400" />
                          Ver Site
                        </Link>
                        <Link
                          href="/perfil"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserCog size={16} className="text-gray-400" />
                          Meu Perfil
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Terminar Sessão
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Visily Style */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-100 transform transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-16`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {/* Main Menu */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider px-3 mb-2">Principal</p>
              <nav className="space-y-1">
                {mainMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive(item.href)
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-md`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Management Menu */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider px-3 mb-2">Gestão</p>
              <nav className="space-y-1">
                {managementMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive(item.href)
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-md`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* System Menu */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider px-3 mb-2">Sistema</p>
              <nav className="space-y-1">
                {systemMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive(item.href)
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-md`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-[#10A63D] to-[#0e9135] rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} />
                <p className="font-semibold text-sm">Painel Admin</p>
              </div>
              <p className="text-xs text-white/80">Gestão completa do sistema</p>
            </div>
            <Link
              href="/home"
              className="flex items-center gap-2 mt-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Home size={18} />
              Voltar ao Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
