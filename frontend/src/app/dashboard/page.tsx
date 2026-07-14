'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  users: number;
  institutions: number;
  courses: number;
  subjects: number;
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats>({
    users: 0,
    institutions: 0,
    courses: 0,
    subjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar estatísticas
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Bem-vindo, {user?.name || 'Usuário'}!
      </h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Usuários</h3>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Instituições</h3>
          <p className="text-3xl font-bold">{stats.institutions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Cursos</h3>
          <p className="text-3xl font-bold">{stats.courses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Disciplinas</h3>
          <p className="text-3xl font-bold">{stats.subjects}</p>
        </div>
      </div>

      {/* Ações baseadas no role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Seus Estudos</h2>
          <p className="text-gray-600 mb-4">
            Acesse as disciplinas e comece a estudar!
          </p>
          <Link
            href="/subjects"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ver Disciplinas
          </Link>
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded-lg shadow border-2 border-yellow-400">
            <h2 className="text-xl font-bold mb-4 text-yellow-600">
              ⚡ Área Administrativa
            </h2>
            <p className="text-gray-600 mb-4">
              Gerencie usuários, cursos, instituições e muito mais.
            </p>
            <div className="space-y-2">
              <Link
                href="/admin"
                className="block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
              >
                Painel Administrativo
              </Link>
              <Link
                href="/courses/new"
                className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
              >
                + Novo Curso
              </Link>
              <Link
                href="/institutions/new"
                className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
              >
                + Nova Instituição
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Atividades Recentes */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Atividades Recentes</h2>
        <div className="space-y-2 text-gray-600">
          <div className="flex justify-between border-b pb-2">
            <span>Usuário criou nova instituição</span>
            <span className="text-sm text-gray-400">Admin • 2 min atrás</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Curso atualizado: Matemática</span>
            <span className="text-sm text-gray-400">Admin • 15 min atrás</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>Nova disciplina adicionada</span>
            <span className="text-sm text-gray-400">Admin • 1 hora atrás</span>
          </div>
        </div>
      </div>
    </div>
  );
}
