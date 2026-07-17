'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/admin');
      } else {
        alert(data.message || 'Erro no login');
      }
    } catch (error) {
      alert('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col justify-between items-center bg-gray-900 px-6 py-6 overflow-hidden">
      
      {/* Cabeçalho (Logo, Título e Boas-vindas) */}
      <div className="flex flex-col items-center w-full max-w-sm text-center pt-2">
        {/* Container do Logo */}
        <div className="flex items-center justify-center w-20 h-20 bg-gray-800 rounded-2xl shadow-sm border border-gray-700">
          <img
            src="/logo.png"
            alt="MeuExame Logo"
            className="w-14 h-14 object-contain"
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold mt-4 text-white tracking-tight">
          Painel Administrativo
        </h1>

        {/* Subtítulo */}
        <p className="mt-1 text-sm text-gray-400 px-4">
          Acesse o painel de administração
        </p>
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 my-auto justify-center">
        
        {/* Campo Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 text-sm"
            required
          />
        </div>

        {/* Campo Palavra-passe */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-300">
            Palavra-passe
          </label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 text-sm"
            required
          />
        </div>

        {/* Botão Entrar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 text-white py-3.5 px-5 rounded-xl font-medium text-base hover:bg-yellow-700 transition-colors disabled:opacity-50 mt-2 shadow-sm"
        >
          {loading ? 'Entrando...' : 'Entrar como Admin'}
        </button>
      </form>

       {/* Seção de Links */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 pb-4">
        
        {/* Link para Login Normal */}
        <p className="text-sm font-medium text-gray-400 mt-1">
          Não é administrador?{' '}
          <Link href="/login" className="text-yellow-500 hover:underline font-semibold">
            Entrar como usuário
          </Link>
        </p>

        {/* Dica de credenciais */}
        <span className="text-[10px] text-gray-600 pointer-events-none select-none">
          admin@meuexame.com | admin123
        </span>
      </div>

    </main>
  );
}
