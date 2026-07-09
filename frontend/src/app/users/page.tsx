'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, User, Mail, BadgeCheck } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
      setFiltered(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setUsers([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      users.filter((u) =>
        u.name.toLowerCase().includes(value) ||
        u.email.toLowerCase().includes(value)
      )
    );
  };

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { variant: 'primary' | 'success' | 'warning' | 'default'; label: string }> = {
      SUPER_ADMIN: { variant: 'primary', label: 'Super Admin' },
      ADMIN: { variant: 'success', label: 'Admin' },
      USER: { variant: 'default', label: 'Usuário' },
    };
    return roles[role] || { variant: 'default', label: role };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader loader-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground mt-1">Lista de todos os usuários do sistema</p>
          </div>
          <Badge variant="primary" className="text-lg px-4 py-2">
            <Users className="w-4 h-4 mr-2" /> {users.length} usuários
          </Badge>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar usuários..." value={search} onChange={handleSearch} className="pl-10" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Nenhum usuário encontrado</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((user) => {
              const role = getRoleBadge(user.role);
              return (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-custom flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">{user.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {user.email}
                      </div>
                      <div className="mt-2">
                        <Badge variant={role.variant as any}>{role.label}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}