'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Menu, 
  X, 
  UserPlus, 
  Shield, 
  Mail, 
  AlertCircle,
  CheckCircle2,
  Eye,
  Edit2,
  Trash2,
  Lock,
  User as UserIcon,
  Plus
} from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Controle do Formulário de Criação Lateral
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');

  // Estados para os Pop-ups Estilizados
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string; userName: string } | null>(null);

  const router = useRouter();

  const devUsersMock = [
    { id: '1', name: 'Carlos Silva', email: 'carlos@meuexame.com', role: 'admin' },
    { id: '2', name: 'Mariana Costa', email: 'mariana@estudante.com', role: 'user' },
    { id: '3', name: 'Roberto Almeida', email: 'roberto@professor.com', role: 'instructor' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUsers(devUsersMock);
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUsers(Array.isArray(data) ? data : devUsersMock);
        setLoading(false);
      })
      .catch(() => {
        showToast('Conectado ao banco de dados offline.', 'info');
        setUsers(devUsersMock);
        setLoading(false);
      });
  }, [router]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName || !newEmail || !newPassword) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const newUser = {
      id: String(Date.now()),
      name: newName,
      email: newEmail,
      role: newRole
    };

    setUsers([newUser, ...users]);
    showToast(`Usuário ${newName} cadastrado com sucesso!`, 'success');
    
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('user');
    setIsCreateOpen(false);
  };

  const handleView = (id: string) => router.push(`/users/${id}`);
  const handleEdit = (id: string) => router.push(`/users/${id}/edit`);

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, userId: id, userName: name });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    setUsers(users.filter((u: any) => u.id !== deleteModal.userId));
    showToast(`Usuário ${deleteModal.userName} excluído com sucesso!`, 'success');
    setDeleteModal(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredUsers = users.filter((user: any) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-black">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-100 border-t-[#10A63D]"></div>
        <p className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* TOAST FLUTUANTE */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 max-w-sm px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-xl animate-slideIn">
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-[#10A63D]" />}
          {toast.type === 'info' && <AlertCircle size={18} className="text-blue-500" />}
          {toast.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
          <span className="text-xs font-semibold text-black tracking-tight">{toast.message}</span>
        </div>
      )}

      {/* PAINEL LATERAL SLIDE-OVER (FORMULÁRIO DE CRIAÇÃO TOTALMENTE RESPONSIVO) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col border-l border-gray-100 animate-slideLeft">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[#10A63D]" />
                <h2 className="text-lg font-bold text-black tracking-tight">Criar Novo Usuário</h2>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
              {/* Campo Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Nome Completo</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva"
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all"
                  />
                </div>
              </div>

              {/* Campo E-mail */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">E-mail de Acesso</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="exemplo@meuexame.com"
                    value={newEmail} 
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Senha Provisória</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all"
                  />
                </div>
              </div>

              {/* Campo Nível de Acesso */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Nível de Permissão</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-200 text-black transition-all appearance-none cursor-pointer"
                  >
                    <option value="user">User (Estudante)</option>
                    <option value="instructor">Instructor (Professor)</option>
                    <option value="admin">Admin (Administrador)</option>
                  </select>
                </div>
              </div>

              <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100 bg-white sticky bottom-0">
                <button 
                  type="button" 
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#10A63D] hover:bg-[#0e9135] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL DE REMOÇÃO */}
      {deleteModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-gray-100 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scaleUp">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-base font-bold text-black tracking-tight">Excluir Usuário?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Você está prestes a remover permanentemente **{deleteModal.userName}** do sistema MeuExame.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 bg-[#F8F9FA] text-gray-700 font-semibold text-xs uppercase tracking-wider rounded-xl border border-gray-200">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER MOBILE (COM BOTÃO ADICIONAR INTEGRADO NO CANTO) */}
      <header className="md:hidden h-16 w-full border-b border-gray-100 px-4 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-black text-sm tracking-tight">Usuários</span>
          </div>
        </div>
        
        {/* Botão Adicionar Exclusivo para Mobile */}
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="p-2 bg-[#10A63D] text-white rounded-xl shadow-sm hover:bg-[#0e9135] transition-colors"
          title="Novo Usuário"
        >
          <Plus size={18} />
        </button>
      </header>

      <Sidebar 
        user={{ name: 'Administrador', email: 'admin@meuexame.com' }} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        handleLogout={handleLogout} 
      />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 bg-white w-full">
        
        {/* Header Superior Desktops */}
        <header className="hidden h-20 border-b border-gray-100 md:flex items-center justify-between px-8 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F8F9FA] border border-gray-100 rounded-xl text-[#10A63D]">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">Usuários</h1>
              <p className="text-xs text-gray-500 mt-0.5">Gerenciamento dinâmico de permissões.</p>
            </div>
          </div>

          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#10A63D] hover:bg-[#0e9135] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            <UserPlus size={14} /> Novo Usuário
          </button>
        </header>

        <main className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">

          {/* BARRA DE FILTRAGEM */}
          <div className="mb-6 relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou função..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl text-sm font-medium text-black placeholder-gray-400 outline-none focus:bg-white transition-all shadow-sm"
            />
          </div>

          {/* TABELA COM AÇÕES DE DADOS */}
          <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-100 text-left">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Identificação</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nível</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-black font-bold text-xs flex items-center justify-center uppercase">
                              {user.name?.substring(0, 2)}
                            </div>
                            <span className="text-sm font-semibold text-black group-hover:text-[#10A63D] transition-colors">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail size={14} className="text-gray-400" />
                            {user.email}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                            ${user.role === 'admin' ? 'bg-red-50 text-red-700' : ''}
                            ${user.role === 'instructor' ? 'bg-blue-50 text-blue-700' : ''}
                            ${user.role === 'user' ? 'bg-gray-100 text-gray-600' : ''}
                          `}>
                            <Shield size={10} />
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            <button 
                              onClick={() => handleView(user.id)}
                              title="Visualizar"
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye size={15} />
                            </button>

                            <button 
                              onClick={() => handleEdit(user.id)}
                              title="Editar"
                              className="p-1.5 text-gray-400 hover:text-[#10A63D] hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button 
                              onClick={() => openDeleteModal(user.id, user.name)}
                              title="Excluir"
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}