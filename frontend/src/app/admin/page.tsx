'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Building2, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  Shield, 
  UserCog,
  BarChart3,
  Activity,
  Plus,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    institutions: 0,
    courses: 0,
    subjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Buscar perfil do usuário
        const profileRes = await fetch('http://localhost:3001/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await profileRes.json();
        setUser(userData);

        // Verificar se é admin
        if (userData.role !== 'SUPER_ADMIN' && userData.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }

        // Buscar dados
        const [usersRes, institutionsRes, coursesRes, subjectsRes] = await Promise.all([
          fetch('http://localhost:3001/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/institutions', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/courses', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/subjects', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const usersData = await usersRes.json();
        const institutions = await institutionsRes.json();
        const courses = await coursesRes.json();
        const subjects = await subjectsRes.json();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setStats({
          users: Array.isArray(usersData) ? usersData.length : 0,
          institutions: Array.isArray(institutions) ? institutions.length : 0,
          courses: Array.isArray(courses) ? courses.length : 0,
          subjects: Array.isArray(subjects) ? subjects.length : 0,
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader loader-lg" />
      </div>
    );
  }

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-12 max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Acesso Negado</h2>
          <p className="text-muted-foreground mt-2">Você não tem permissão para acessar esta página.</p>
          <Button className="mt-6" onClick={() => router.push('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Navbar */}
      <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container-custom py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-custom rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ME</span>
            </div>
            <h1 className="text-2xl font-bold text-gradient">MeuExame</h1>
            <Badge variant="primary">Admin</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span className="text-muted-foreground">Olá, {user?.name || 'Usuário'}</span>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie todos os aspectos do sistema</p>
          </div>
          <Badge variant="primary" className="ml-auto">
            {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/users">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuários</p>
                  <p className="text-2xl font-bold">{stats.users}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Eye className="w-4 h-4 mr-2" /> Ver Usuários
              </Button>
            </Card>
          </Link>

          <Link href="/institutions">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Instituições</p>
                  <p className="text-2xl font-bold">{stats.institutions}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Eye className="w-4 h-4 mr-2" /> Ver Instituições
              </Button>
            </Card>
          </Link>

          <Link href="/courses">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cursos</p>
                  <p className="text-2xl font-bold">{stats.courses}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Eye className="w-4 h-4 mr-2" /> Ver Cursos
              </Button>
            </Card>
          </Link>

          <Link href="/subjects">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disciplinas</p>
                  <p className="text-2xl font-bold">{stats.subjects}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Eye className="w-4 h-4 mr-2" /> Ver Disciplinas
              </Button>
            </Card>
          </Link>
        </div>

        {/* Ações Rápidas Admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Ações Rápidas" icon={<Activity className="w-5 h-5" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/institutions/new">
                <Button variant="success" fullWidth size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Nova Instituição
                </Button>
              </Link>
              <Link href="/courses/new">
                <Button variant="primary" fullWidth size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Novo Curso
                </Button>
              </Link>
              <Link href="/subjects/new">
                <Button variant="warning" fullWidth size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Nova Disciplina
                </Button>
              </Link>
              <Link href="/users">
                <Button variant="outline" fullWidth size="sm">
                  <Users className="w-4 h-4 mr-2" /> Gerenciar Usuários
                </Button>
              </Link>
            </div>
          </Card>

          <Card title="Configurações do Sistema" icon={<Settings className="w-5 h-5" />}>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-foreground">Versão</span>
                <Badge variant="primary">2.0.0</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-foreground">Ambiente</span>
                <Badge variant="success">Produção</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-foreground">Usuários Ativos</span>
                <Badge variant="info">{stats.users}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Seu Perfil</span>
                <Badge variant={user?.role === 'SUPER_ADMIN' ? 'primary' : 'success'}>
                  {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Usuários (Admin) */}
        <Card title="Últimos Usuários" icon={<Users className="w-5 h-5" />}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground py-2 px-3">Nome</th>
                  <th className="text-left text-sm font-medium text-muted-foreground py-2 px-3">Email</th>
                  <th className="text-left text-sm font-medium text-muted-foreground py-2 px-3">Role</th>
                  <th className="text-left text-sm font-medium text-muted-foreground py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 text-sm text-foreground">{u.name}</td>
                    <td className="py-2 px-3 text-sm text-muted-foreground">{u.email}</td>
                    <td className="py-2 px-3">
                      <Badge variant={u.role === 'SUPER_ADMIN' ? 'primary' : u.role === 'ADMIN' ? 'success' : 'default'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="danger">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted-foreground">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {users.length > 5 && (
            <div className="mt-4 text-center">
              <Link href="/users">
                <Button variant="outline" size="sm">
                  Ver todos os {stats.users} usuários
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}