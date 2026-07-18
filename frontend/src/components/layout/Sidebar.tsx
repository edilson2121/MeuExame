'use client';

import Link from 'next/link';
import { 
  Users, 
  FileText, 
  ClipboardCheck, 
  LayoutDashboard, 
  LogOut, 
  CreditCard,
  User,
  HelpCircle,
  Award,
  Settings,
  LifeBuoy,
  Building2 // Importado para representar Instituições
} from 'lucide-react';

interface SidebarProps {
  user: { name: string; email: string } | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

export default function Sidebar({ user, isSidebarOpen, setIsSidebarOpen, handleLogout }: SidebarProps) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-100 bg-white flex flex-col justify-between transition-transform duration-300 transform
      md:translate-x-0 md:sticky md:h-screen
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      
      {/* 1. TOPO ESTÁTICO (FIXO) - LOGO */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 pl-2">
          <div className="flex items-center justify-center w-10 h-10 bg-[#F8F9FA] rounded-xl border border-gray-100 shadow-sm">
            <img src="/logo.png" alt="MeuExame Logo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <span className="font-bold text-black tracking-tight block text-base">MeuExame</span>
            <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Painel Admin</span>
          </div>
        </div>
      </div>

      {/* 2. ÁREA DE SCROLL COMPACTA (MENUS RESTRITOS) */}
      <div className="flex-1 overflow-y-auto px-6 py-2 max-h-[calc(100vh-210px)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full">
        <nav className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 px-4 uppercase tracking-wider mb-1 block">Núcleo</span>
          
          <Link href="/admin/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#F8F9FA] text-[#10A63D] font-semibold text-xs transition-colors">
            <LayoutDashboard size={16} />
            Visão Geral
          </Link>
          <Link href="/users" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-xs transition-colors">
            <Users size={16} />
            Usuários
          </Link>
          {/* LINK DE INSTITUIÇÕES ADICIONADO AQUI */}
          <Link href="/institutions" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-xs transition-colors">
            <Building2 size={16} />
            Instituições
          </Link>

          <span className="text-[10px] font-bold text-gray-400 px-4 uppercase tracking-wider mt-3 mb-1 block">Avaliações</span>

          <Link href="exames" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-xs transition-colors">
            <FileText size={16} />
            Exames
          </Link>
          <Link href="/testes" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-xs transition-colors">
            <ClipboardCheck size={16} />
            Testes
          </Link>
          

          <span className="text-[10px] font-bold text-gray-400 px-4 uppercase tracking-wider mt-3 mb-1 block">Gestão</span>

          <Link href="/admin/pagamentos" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-xs transition-colors">
            <CreditCard size={16} />
            Pagamentos
          </Link>
          <Link href="/admin/certificados" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-xs transition-colors">
            <Award size={16} />
            Certificados
          </Link>

          

          <span className="text-[10px] font-bold text-gray-400 px-4 uppercase tracking-wider mt-3 mb-1 block">Preferências-Dados</span>

         
          <Link href="configuracoes" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-xs transition-colors">
            <Settings size={16} />
            Configurações
          </Link>
        </nav>
      </div>

      {/* 3. RODAPÉ 100% ESTÁTICO E FIXO (PERFIL E LOGOUT) */}
      <div className="bg-white border-t border-gray-100 p-6 flex flex-col gap-3 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-black uppercase shrink-0">
            {user?.name?.substring(0, 2) || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-black truncate">{user?.name || 'Administrador'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@meuexame.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors"
        >
          <LogOut size={14} />
          Sair do Painel
        </button>
      </div>

    </aside>
  );
}