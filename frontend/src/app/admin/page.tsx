'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAdmin) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">
        🛠️ Painel Administrativo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gerenciar Instituições */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">🏛️ Instituições</h2>
          <p className="text-gray-600 mb-4">Gerenciar instituições</p>
          <Link
            href="/admin/instituicoes"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Gerenciar →
          </Link>
        </div>

        {/* Gerenciar Disciplinas */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">� Disciplinas</h2>
          <p className="text-gray-600 mb-4">Gerenciar disciplinas</p>
          <Link
            href="/admin/disciplinas"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Gerenciar →
          </Link>
        </div>

        {/* Gerenciar Exames */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">📝 Exames</h2>
          <p className="text-gray-600 mb-4">Criar e gerenciar exames</p>
          <Link
            href="/admin/exames"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Gerenciar →
          </Link>
        </div>

        {/* Gerenciar Pagamentos */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">� Pagamentos</h2>
          <p className="text-gray-600 mb-4">Gerenciar pagamentos e assinaturas</p>
          <Link
            href="/admin/pagamentos"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Gerenciar →
          </Link>
        </div>

        {/* Gerenciar Planos */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">� Planos</h2>
          <p className="text-gray-600 mb-4">Gerenciar planos de assinatura</p>
          <Link
            href="/admin/planos"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Gerenciar →
          </Link>
        </div>

        {/* Gerenciar Páginas Dinâmicas */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">📄 Páginas</h2>
          <p className="text-gray-600 mb-4">Criar páginas para usuários</p>
          <Link
            href="/admin/pages"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Gerenciar →
          </Link>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">📊 Resumo do Sistema</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Versão</p>
            <p className="font-semibold">2.0.0</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ambiente</p>
            <p className="font-semibold text-green-600">Produção</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="font-semibold text-green-600">Online</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Banco de Dados</p>
            <p className="font-semibold text-green-600">Conectado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
