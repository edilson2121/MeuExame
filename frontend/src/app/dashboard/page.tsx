'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        // Buscar perfil do usuário
        const profileRes = await fetch('http://localhost:3001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileRes.ok) {
          throw new Error('Erro ao buscar perfil');
        }
        
        const userData = await profileRes.json();
        setUser(userData);

        // Buscar estatísticas
        const [usersRes, institutionsRes, coursesRes, subjectsRes] = await Promise.all([
          fetch('http://localhost:3001/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3001/api/institutions', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3001/api/courses', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3001/api/subjects', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ME</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600">MeuExame</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
              Olá, <span className="text-blue-600">{user?.name || 'Usuário'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold">Bem-vindo ao MeuExame!</h2>
          <p className="mt-2 text-blue-100">
            Gerencie suas instituições, cursos e disciplinas em um só lugar.
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link 
            href="/users" 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Usuários</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.users}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-3 font-medium hover:underline">Ver todos →</p>
          </Link>

          <Link 
            href="/institutions" 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Instituições</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.institutions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-3 font-medium hover:underline">Ver todas →</p>
          </Link>

          <Link 
            href="/courses" 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cursos</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.courses}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-purple-600 mt-3 font-medium hover:underline">Ver todos →</p>
          </Link>

          <Link 
            href="/subjects" 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Disciplinas</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.subjects}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-orange-600 mt-3 font-medium hover:underline">Ver todas →</p>
          </Link>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/institutions/new"
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md font-medium"
            >
              <span className="text-xl mr-2">+</span> Nova Instituição
            </Link>
            <Link
              href="/courses/new"
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md font-medium"
            >
              <span className="text-xl mr-2">+</span> Novo Curso
            </Link>
            <Link
              href="/subjects/new"
              className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm hover:shadow-md font-medium"
            >
              <span className="text-xl mr-2">+</span> Nova Disciplina
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-400 border-t border-gray-200 pt-8">
          <p>© 2024 MeuExame. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  );
}