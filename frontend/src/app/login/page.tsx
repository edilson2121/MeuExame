'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/home');
        }
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">MeuExame</span>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Bem-vindo!</h1>
          <p className="text-gray-600 text-center mb-8">Entre para continuar estudando</p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palavra-passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary btn-lg"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-gray-600">
          Não tem conta?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Criar conta
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl text-sm">
          <p className="font-semibold text-blue-800 mb-2">🔑 Credenciais de Demo:</p>
          <p className="text-blue-700">Admin: admin@meuexame.com / admin123</p>
          <p className="text-blue-700">User: estudante@meuexame.com / admin123</p>
        </div>
      </div>
    </main>
  );
}