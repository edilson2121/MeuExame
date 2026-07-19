'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Loader2,
  ChevronLeft,
  Filter,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string | null;
  role: 'USER' | 'ADMIN' | 'TEACHER';
  hasFullAccess: boolean;
  avatar: string | null;
  institution: { name: string } | null;
  createdAt: string;
  _count?: { results: number; payments: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Fallback data
      setUsers([
        {
          id: '1',
          name: 'João Mucavel',
          email: 'joao@exemplo.com',
          username: 'joaomucavel',
          phone: '841234567',
          role: 'USER',
          hasFullAccess: false,
          avatar: null,
          institution: { name: 'UEM' },
          createdAt: new Date().toISOString(),
          _count: { results: 5, payments: 2 },
        },
        {
          id: '2',
          name: 'Maria Jone',
          email: 'maria@exemplo.com',
          username: 'mariajone',
          phone: '851234567',
          role: 'ADMIN',
          hasFullAccess: true,
          avatar: null,
          institution: null,
          createdAt: new Date().toISOString(),
          _count: { results: 0, payments: 0 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleFullAccess = async (userId: string, hasFullAccess: boolean) => {
    setActionLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/users/${userId}/full-access`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hasFullAccess: !hasFullAccess }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, hasFullAccess: !hasFullAccess } : u)));
      }
    } catch (error) {
      console.error('Erro ao atualizar acesso:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'USER' | 'ADMIN' | 'TEACHER') => {
    setActionLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar função:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
            <Shield size={12} />
            Admin
          </span>
        );
      case 'TEACHER':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
            <ShieldCheck size={12} />
            Professor
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
            <Users size={12} />
            Utilizador
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilizadores</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredUsers.length} utilizador(es) encontrado(s)
          </p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
        >
          <Plus size={20} />
          Novo Utilizador
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, email ou utilizador..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Todas as funções</option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Professor</option>
              <option value="USER">Utilizador</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Utilizador
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acesso Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone size={14} className="text-gray-400" />
                          +258 {user.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    {user.hasFullAccess ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Sim
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        Não
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(user.createdAt).toLocaleDateString('pt-MZ')}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleFullAccess(user.id, user.hasFullAccess)}
                        disabled={actionLoading}
                        className={`p-2 rounded-lg ${
                          user.hasFullAccess
                            ? 'text-orange-500 hover:bg-orange-50'
                            : 'text-green-500 hover:bg-green-50'
                        }`}
                        title={user.hasFullAccess ? 'Remover acesso total' : 'Conceder acesso total'}
                      >
                        {user.hasFullAccess ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum utilizador encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros ou pesquisa</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Editar Utilizador</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedUser.name}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleChangeRole(selectedUser.id, 'USER')}
                    disabled={actionLoading}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedUser.role === 'USER'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users size={20} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">Utilizador</span>
                  </button>
                  <button
                    onClick={() => handleChangeRole(selectedUser.id, 'TEACHER')}
                    disabled={actionLoading}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedUser.role === 'TEACHER'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ShieldCheck size={20} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">Professor</span>
                  </button>
                  <button
                    onClick={() => handleChangeRole(selectedUser.id, 'ADMIN')}
                    disabled={actionLoading}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedUser.role === 'ADMIN'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Shield size={20} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">Admin</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acesso Total</label>
                <button
                  onClick={() => handleToggleFullAccess(selectedUser.id, selectedUser.hasFullAccess)}
                  disabled={actionLoading}
                  className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                    selectedUser.hasFullAccess
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {selectedUser.hasFullAccess ? (
                    <UserCheck size={24} className="text-green-600" />
                  ) : (
                    <UserX size={24} className="text-gray-400" />
                  )}
                  <div className="text-left">
                    <p className="font-medium">
                      {selectedUser.hasFullAccess ? 'Acesso Total Concedido' : 'Sem Acesso Total'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedUser.hasFullAccess
                        ? 'Este utilizador pode aceder a todos os conteúdos pagos'
                        : 'Este utilizador está limitado a conteúdos grátis'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
