'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MenuPage {
  id: string;
  title: string;
  slug: string;
}

export default function Navbar() {
  const router = useRouter();

  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    fetch('http://localhost:3001/api/pages/menu')
      .then((res) => res.json())
      .then((data: MenuPage[]) => setMenuPages(data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
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

            <Link href="/">Home</Link>

            {menuPages.map((page) => (
              <Link
                key={page.id}
                href={`/pages/${page.slug}`}
              >
                {page.title}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link href="/dashboard">
                  Dashboard
                </Link>

                <Link href="/admin">
                  Admin
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Sair
                </button>
              </>
            )}

            {!isLoggedIn && (
              <Link href="/login">
                Login
              </Link>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}