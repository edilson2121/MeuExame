'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface MenuPage {
  id: string;
  title: string;
  slug: string;
}

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isTeacher, logout } = useAuth();
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/pages/menu')
      .then((res) => res.json())
      .then((data: MenuPage[]) => setMenuPages(data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            📚 MeuExame
          </Link>

          <div className="flex items-center gap-4">
            {/* Home para Users normais */}
            <Link href="/home" className="hover:underline">
              Instituições
            </Link>

            {menuPages.map((page) => (
              <Link key={page.id} href={`/pages/${page.slug}`}>
                {page.title}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link href="/admin" className="text-yellow-300 font-bold">
                      🛠️ Admin
                    </Link>
                  </>
                )}

                {isTeacher && (
                  <Link href="/teacher" className="text-blue-300">
                    📝 Professor
                  </Link>
                )}

                <div className="flex items-center gap-2 border-l border-white/30 pl-4">
                  <span className="text-sm">
                    Olá, <strong>{user?.name?.split(' ')[0] || 'Usuário'}</strong>
                    {isAdmin && <span className="ml-1 text-xs bg-yellow-500 px-2 py-0.5 rounded">Admin</span>}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  Entrar
                </Link>
                <Link href="/register" className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}