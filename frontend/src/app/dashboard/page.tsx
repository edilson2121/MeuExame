'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Building2, 
  BookOpen, 
  GraduationCap,
  Plus,
  Activity,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Componente de Estatística
function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
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
        const profileRes = await fetch('http://localhost:3001/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await profileRes.json();
        setUser(userData);

        const [usersRes, institutionsRes, coursesRes, subjectsRes] = await Promise.all([
          fetch('http://localhost:3001/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/institutions', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/courses', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/subjects', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const users = await usersRes.json();
        const institutions = await institutionsRes.json();
        const courses = await coursesRes.json();
        const subjects = await subjectsRes.json();

        setStats({
          users: Array.isArray(users) ? users.length : 0,
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
            {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
              <Badge variant="primary">Admin</Badge>
            ) : (
              <Badge variant="default">Usuário</Badge>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* Link para Admin (apenas para admins) */}
            {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
              <Link 
                href="/admin" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Users className="w-4 h-4" /> Admin
              </Link>
            ) : null}
            
            <span className="text-muted-foreground">Olá, {user?.name || 'Usuário'}</span>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="container-custom py-8">
        {/* Banner */}
        <div className="bg-gradient-custom rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Bem-vindo ao MeuExame!</h2>
              <p className="mt-2 text-white/80">
                {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' 
                  ? 'Gerencie suas instituições, cursos e disciplinas em um só lugar.'
                  : 'Acesse seus cursos e disciplinas para estudar.'
                }
              </p>
            </div>
            <BarChart3 className="w-12 h-12 opacity-50" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/users">
            <StatCard 
              title="Usuários" 
              value={stats.users} 
              icon={<Users className="w-6 h-6 text-primary-600" />}
              color="bg-primary-50 dark:bg-primary-900/20"
            />
          </Link>
          <Link href="/institutions">
            <StatCard 
              title="Instituições" 
              value={stats.institutions} 
              icon={<Building2 className="w-6 h-6 text-success" />}
              color="bg-green-50 dark:bg-green-900/20"
            />
          </Link>
          <Link href="/courses">
            <StatCard 
              title="Cursos" 
              value={stats.courses} 
              icon={<BookOpen className="w-6 h-6 text-secondary-600" />}
              color="bg-purple-50 dark:bg-purple-900/20"
            />
          </Link>
          <Link href="/subjects">
            <StatCard 
              title="Disciplinas" 
              value={stats.subjects} 
              icon={<GraduationCap className="w-6 h-6 text-warning" />}
              color="bg-orange-50 dark:bg-orange-900/20"
            />
          </Link>
        </div>

        {/* Ações Rápidas (apenas para admins) */}
        {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
          <Card title="Ações Rápidas" icon={<Activity className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/institutions/new">
                <Button variant="success" fullWidth>
                  <Plus className="w-4 h-4 mr-2" /> Nova Instituição
                </Button>
              </Link>
              <Link href="/courses/new">
                <Button variant="primary" fullWidth>
                  <Plus className="w-4 h-4 mr-2" /> Novo Curso
                </Button>
              </Link>
              <Link href="/subjects/new">
                <Button variant="warning" fullWidth>
                  <Plus className="w-4 h-4 mr-2" /> Nova Disciplina
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card title="Seus Estudos" icon={<BookOpen className="w-5 h-5" />}>
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Acesse as disciplinas e comece a estudar!
              </p>
              <Link href="/subjects">
                <Button variant="primary" className="mt-4">
                  Ver Disciplinas
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Atividades Recentes */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Atividades Recentes">
            <div className="space-y-4">
              {[
                { action: 'Usuário criou nova instituição', time: '2 min atrás', user: 'Admin' },
                { action: 'Curso atualizado: Matemática', time: '15 min atrás', user: 'Admin' },
                { action: 'Nova disciplina adicionada', time: '1 hora atrás', user: 'Admin' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <Badge variant="info">{activity.time}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Resumo do Sistema">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Versão</span>
                <Badge variant="primary">2.0.0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ambiente</span>
                <Badge variant="success">Produção</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Banco de Dados</span>
                <Badge variant="success">Conectado</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Seu Perfil</span>
                <Badge variant={user?.role === 'SUPER_ADMIN' ? 'primary' : user?.role === 'ADMIN' ? 'success' : 'default'}>
                  {user?.role || 'Usuário'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}