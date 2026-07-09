'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [menuPages, setMenuPages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetch('http://localhost:3001/api/pages/menu')
      .then(r => r.json())
      .then(setMenuPages)
      .catch(() => {});
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
          <Link href="/" className="text-xl font-bold flex items-center gap-2">📚 MeuExame</Link>
          <div className="flex items-center gap-1 md:gap-4">
            <Link href="/" className="px-3 py-2 rounded-lg hover:bg-blue-500">Home</Link>
            {menuPages.map((page) => (
              <Link key={page.id} href={/pages/} className="px-3 py-2 rounded-lg hover:bg-blue-500">
                {page.title}
              </Link>
            ))}
            {isLoggedIn && <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-blue-500">Dashboard</Link>}
            {isLoggedIn && <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-blue-500">Admin</Link>}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600">Sair</button>
            ) : (
              <Link href="/login" className="px-3 py-2 rounded-lg hover:bg-blue-500">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
