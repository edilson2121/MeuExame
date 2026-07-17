'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Users, 
  Building2, 
  BookOpen, 
  GraduationCap,
  Plus,
  Activity
} from 'lucide-react';

// Componente Card
function Card({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 hover:scale-105 transition-transform">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>
        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    institutions: 0,
    courses: 0,
    subjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const token = localStorage.getItem('token');
        
        const [usersRes, institutionsRes, coursesRes, subjectsRes] = await Promise.all([
          fetch(`${apiUrl}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/institutions`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/courses`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/subjects`, { headers: { 'Authorization': `Bearer ${token}` } })
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MeuExame</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Olá, {user?.name || 'Usuário'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold">Bem-vindo ao MeuExame!</h2>
          <p className="mt-2 text-blue-100">Gerencie suas instituições, cursos e disciplinas em um só lugar.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/users">
            <Card title="Usuários" value={stats.users} icon={<Users size={24} />} />
          </Link>
          <Link href="/institutions">
            <Card title="Instituições" value={stats.institutions} icon={<Building2 size={24} />} />
          </Link>
          <Link href="/courses">
            <Card title="Cursos" value={stats.courses} icon={<BookOpen size={24} />} />
          </Link>
          <Link href="/subjects">
            <Card title="Disciplinas" value={stats.subjects} icon={<GraduationCap size={24} />} />
          </Link>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity size={20} className="mr-2 text-blue-600" />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/institutions/new" className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <Plus size={18} className="mr-2" /> Nova Instituição
            </Link>
            <Link href="/courses/new" className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              <Plus size={18} className="mr-2" /> Novo Curso
            </Link>
            <Link href="/subjects/new" className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              <Plus size={18} className="mr-2" /> Nova Disciplina
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}