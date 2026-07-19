'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  User, 
  Shield, 
  Lock, 
  Globe, 
  Database, 
  Save, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estado dinâmico do usuário logado
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // Aba Ativa nas Configurações
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'sistema'>('perfil');

  // Estados dos Formulários
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('pt');
  const [notifications, setNotifications] = useState(true);
  
  // Estados de Segurança
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Estados do Sistema (Exclusivo do Admin)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);

  useEffect(() => {
    // 1. Tenta buscar os dados reais do seu login
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); 

    try {
      if (token && storedUser) {
        // Se o seu formulário de login real já salvou os dados, usa eles!
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setName(user.name || '');
        setEmail(user.email || '');
      } else {
        // Se o localStorage estiver vazio, usa os seus dados oficiais como padrão
        console.warn("Sessão ativa não encontrada no localStorage. Carregando dados padrão do Administrador.");
        
        const defaultAdmin = {
          name: 'Administrador',
          email: 'admin@meuexame.com',
          role: 'admin' // Mantém como admin para liberar a aba "Painel do Sistema"
        };
        
        setCurrentUser(defaultAdmin);
        setName(defaultAdmin.name);
        setEmail(defaultAdmin.email);
      }
    } catch (error) {
      console.error("Erro ao ler dados do usuário", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Atualiza também o localStorage para manter sincronizado na interface sem deslogar
      if (currentUser) {
        const updatedUser = { ...currentUser, name, email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      showToast('Configurações guardadas com sucesso!', 'success');
      
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      showToast('Erro ao atualizar configurações.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-black">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-100 border-t-[#10A63D]"></div>
        <p className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wider">A carregar dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* TOAST FLUTUANTE */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 max-w-sm px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-xl">
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-[#10A63D]" /> : <AlertCircle size={18} className="text-red-500" />}
          <span className="text-xs font-semibold text-black tracking-tight">{toast.message}</span>
        </div>
      )}

      {/* HEADER MOBILE */}
      <header className="md:hidden h-16 w-full border-b border-gray-100 px-4 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-bold text-black text-sm tracking-tight">Configurações</span>
        </div>
      </header>

      {/* COMPONENTE DA SIDEBAR */}
      <Sidebar />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 bg-white w-full">
        
        <header className="hidden h-20 border-b border-gray-100 md:flex items-center justify-between px-8 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-[#10A63D]">
              <Settings size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">Configurações Gerais</h1>
              <p className="text-xs text-gray-500 mt-0.5">Gerencie os detalhes da conta e preferências da plataforma.</p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
          
          {/* NAVEGAÇÃO DE ABAS */}
          <div className="flex border-b border-gray-100 gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('perfil')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all
                ${activeTab === 'perfil' ? 'border-[#10A63D] text-[#10A63D]' : 'border-transparent text-gray-400 hover:text-black'}
              `}
            >
              <User size={14} /> Meu Perfil
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seguranca')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all
                ${activeTab === 'seguranca' ? 'border-[#10A63D] text-[#10A63D]' : 'border-transparent text-gray-400 hover:text-black'}
              `}
            >
              <Lock size={14} /> Segurança
            </button>

            {/* ABRE RECURSO EXCLUSIVO SE FOR ADMIN */}
            {currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={() => setActiveTab('sistema')}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all
                  ${activeTab === 'sistema' ? 'border-[#10A63D] text-[#10A63D]' : 'border-transparent text-gray-400 hover:text-black'}
                `}
              >
                <Database size={14} /> Painel do Sistema
              </button>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* 1. SEÇÃO: MEU PERFIL */}
            {activeTab === 'perfil' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Nome Completo</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">E-mail de Acesso</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Idioma</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all appearance-none cursor-pointer"
                      >
                        <option value="pt">Português (PT)</option>
                        <option value="en">English (US)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Nível de Permissão</label>
                    <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 font-semibold capitalize flex items-center gap-2">
                      <Shield size={14} className="text-gray-400" />
                      {currentUser.role}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-black">Notificações no Sistema</span>
                    <span className="text-[11px] text-gray-400">Receber alertas de novos testes e exames.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications}
                    onChange={e => setNotifications(e.target.checked)}
                    className="w-4 h-4 accent-[#10A63D] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 2. SEÇÃO: SEGURANÇA */}
            {activeTab === 'seguranca' && (
              <div className="space-y-4 max-w-md">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Senha Atual</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Nova Senha</label>
                  <input 
                    type="password" 
                    placeholder="Nova senha (mínimo 6 caracteres)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all"
                  />
                </div>
              </div>
            )}

            {/* 3. SEÇÃO EXCLUSIVA DO ADMIN */}
            {activeTab === 'sistema' && currentUser.role === 'admin' && (
              <div className="space-y-4">
                <div className="p-4 border border-red-100 rounded-xl bg-red-50/40 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Modo de Manutenção
                    </span>
                    <span className="text-[11px] text-red-700/80 max-w-md">
                      Suspende acessos à plataforma temporariamente para manutenção preventiva.
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={maintenanceMode}
                    onChange={e => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-black">Permitir Auto-Cadastro</span>
                    <span className="text-[11px] text-gray-400 max-w-md">
                      Habilita novos usuários a criarem contas sozinhos pela tela de login externa.
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={allowRegistrations}
                    onChange={e => setAllowRegistrations(e.target.checked)}
                    className="w-4 h-4 accent-[#10A63D] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* BOTÃO SALVAR */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#10A63D] hover:bg-[#0e9135] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
              >
                <Save size={14} /> Guardar Alterações
              </button>
            </div>

          </form>
        </main>
      </div>

    </div>
  );
}