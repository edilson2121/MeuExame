'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  ClipboardCheck, 
  Plus, 
  Activity, 
  ChevronRight,
  CreditCard,
  Menu,
  X,
  LifeBuoy
} from 'lucide-react';

// Importação do componente Sidebar isolado
import Sidebar from '@/components/layout/Sidebar';

// Componente Card Responsivo
function Card({ title, value, icon, href }: { title: string; value: string | number; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="group bg-[#F8F9FA] border border-gray-100 rounded-2xl p-5 transition-all duration-200 hover:border-gray-200 hover:shadow-sm block w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h2 className="text-3xl font-bold mt-2 text-black tracking-tight">{value}</h2>
        </div>
        <div className="bg-white border border-gray-100 text-[#10A63D] p-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#10A63D] font-medium mt-4 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
        Gerenciar registros <ChevronRight size={12} />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>({ name: 'Administrador', email: 'admin@meuexame.com' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    users: 2,
    exames: 0,
    testes: 0,
    payments: 0,
    suporte: 1,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const userData = await profileRes.json();
          setUser(userData);
        }

        const [usersRes, examesRes, testesRes, paymentsRes, suporteRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/exames`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/testes`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, { headers: { 'Authorization': `Bearer ${token}` } }).catch(() => null)
        ]);

        const users = usersRes && usersRes.ok ? await usersRes.json() : [];
        const exames = examesRes && examesRes.ok ? await examesRes.json() : [];
        const testes = testesRes && testesRes.ok ? await testesRes.json() : [];
        const payments = paymentsRes && paymentsRes.ok ? await paymentsRes.json() : [];
        const suporte = suporteRes && suporteRes.ok ? await suporteRes.json() : [];

        setStats({
          users: Array.isArray(users) ? users.length : 2, 
          exames: Array.isArray(exames) ? exames.length : 0,
          testes: Array.isArray(testes) ? testes.length : 0,
          payments: Array.isArray(payments) ? payments.length : 0,
          suporte: Array.isArray(suporte) ? suporte.length : 1,
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-black">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-100 border-t-[#10A63D]"></div>
        <p className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Otimizando ambiente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      
      {/* HEADER MOBILE */}
      <header className="md:hidden h-16 w-full border-b border-gray-100 px-4 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MeuExame" className="w-6 h-6 object-contain" />
          <span className="font-bold text-black text-sm tracking-tight">MeuExame</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* APENAS A CHAMADA DO COMPONENTE SIDEBAR (Sem código repetido aqui) */}
      <Sidebar 
        user={user} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        handleLogout={handleLogout} 
      />

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 bg-white w-full">
        
        {/* Header Superior Desktops */}
        <header className="hidden h-20 border-b border-gray-100 md:flex items-center justify-between px-8 bg-white">
          <div>
            <h1 className="text-xl font-bold text-black tracking-tight">Visão Geral</h1>
            <p className="text-xs text-gray-500 mt-0.5">Gerenciamento dinâmico do ecossistema MeuExame.</p>
          </div>
        </header>

        {/* Corpo Interno Principal */}
        <main className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
          
          {/* Banner de Boas-vindas */}
          <div className="bg-[#10A63D] rounded-2xl p-5 sm:p-6 mb-6 text-white shadow-sm flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight">Bem-vindo, {user?.name}</h2>
            <p className="text-sm text-white/80 max-w-xl">Gerencie usuários, crie avaliações complexas, analise o faturamento e forneça assistência imediata aos estudantes.</p>
          </div>

          {/* Grade Expandida de Cards Operacionais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 w-full">
            <Card title="Usuários" value={stats.users} icon={<Users size={18} />} href="/users" />
            <Card title="Exames" value={stats.exames} icon={<FileText size={18} />} href="/exames" />
            <Card title="Testes" value={stats.testes} icon={<ClipboardCheck size={18} />} href="/testes" />
            <Card title="Pagamentos" value={stats.payments} icon={<CreditCard size={18} />} href="/admin/pagamentos" />
            <Card title="Suporte" value={stats.suporte} icon={<LifeBuoy size={18} />} href="/admin/suporte" />
          </div>

          {/* Container de Ações Rápidas de Cadastro */}
          <div className="border border-gray-100 rounded-2xl p-5 sm:p-6 bg-white w-full">
            <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Activity size={16} className="text-[#10A63D]" />
              Ações Rápidas de Cadastro
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <Link href="/users/new" className="flex items-center justify-center gap-2 px-4 py-3 bg-[#10A63D] text-white rounded-xl font-semibold text-sm hover:bg-[#0e9135] transition-colors shadow-sm">
                <Plus size={16} /> Novo Usuário
              </Link>
              <Link href="/exames/new" className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-900 transition-colors shadow-sm">
                <Plus size={16} /> Novo Exame
              </Link>
              <Link href="/admin/perguntas/new" className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-black border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                <Plus size={16} /> Nova Questão
              </Link>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}