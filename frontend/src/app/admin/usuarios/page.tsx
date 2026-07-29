'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Calendar,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'TEACHER';
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ADMIN' | 'TEACHER'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('admin_token');

      // Simular dados da API
      setUsers([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          role: 'USER',
          isActive: true,
          createdAt: '2024-01-15',
          lastLogin: '2024-01-22',
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          role: 'USER',
          isActive: true,
          createdAt: '2024-01-18',
          lastLogin: '2024-01-21',
        },
        {
          id: '3',
          name: 'Admin Sistema',
          email: 'admin@meuexame.com',
          role: 'ADMIN',
          isActive: true,
          createdAt: '2024-01-01',
          lastLogin: '2024-01-22',
        },
        {
          id: '4',
          name: 'Professor Costa',
          email: 'professor@email.com',
          role: 'TEACHER',
          isActive: true,
          createdAt: '2024-01-10',
          lastLogin: '2024-01-20',
        },
      ]);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: string) => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
            <Shield size={14} />
            Admin
          </div>
        );
      case 'TEACHER':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
            <User size={14} />
            Professor
          </div>
        );
      case 'USER':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
            <User size={14} />
            Aluno
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando usuários...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Usuários</h1>
            <p className="text-slate-400">Gerencie todos os usuários do sistema</p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <User size={20} />
            Novo Usuário
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-slate-400 text-sm">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'USER').length}</p>
                <p className="text-slate-400 text-sm">Alunos</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'TEACHER').length}</p>
                <p className="text-slate-400 text-sm">Professores</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'ADMIN').length}</p>
                <p className="text-slate-400 text-sm">Admins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar usuários..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white"
          >
            <option value="all">Todos os papéis</option>
            <option value="USER">Alunos</option>
            <option value="TEACHER">Professores</option>
            <option value="ADMIN">Admins</option>
          </select>
          <button className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:border-slate-600 transition-all flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Papel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-slate-400 text-sm flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString('pt-PT')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar size={14} />
                        {new Date(user.lastLogin).toLocaleDateString('pt-PT')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-slate-700/50 text-slate-300 hover:bg-slate-700 rounded-lg transition-all">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`p-2 rounded-lg transition-all ${
                            user.isActive 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {user.isActive ? <Trash2 size={16} /> : <User size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-slate-500">Tente ajustar os filtros de pesquisa</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
