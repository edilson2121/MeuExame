'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // ✅ Usar o AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginUrl = email === 'admin@meuexame.com' 
        ? 'http://localhost:3001/api/auth/admin/login' 
        : 'http://localhost:3001/api/auth/login';
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // ✅ Usar o AuthContext para login
        login(data.token, data.user);
        
        // ✅ Redirecionar baseado na role
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        alert(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      alert('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col justify-between items-center bg-white px-6 py-6 overflow-hidden">
      
      <div className="flex flex-col items-center w-full max-w-sm text-center pt-2">
        <div className="flex items-center justify-center w-20 h-20 bg-[#F8F9FA] rounded-2xl shadow-sm">
          <img src="/logo.png" alt="MeuExame Logo" className="w-14 h-14 object-contain" />
        </div>
        <h1 className="text-2xl font-bold mt-4 text-black tracking-tight">Bem-vindo de Volta</h1>
        <p className="mt-1 text-sm text-gray-600 px-4">Acesse sua conta para continuar estudando</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 my-auto justify-center">
        
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D] text-black placeholder-gray-400 text-sm"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-gray-700">Palavra-passe</label>
            <Link href="/recuperar-senha" className="text-xs font-medium text-[#10A63D] hover:underline">
              Esqueci-me da senha?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D] text-black placeholder-gray-400 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#10A63D] text-white py-3.5 px-5 rounded-xl font-medium text-base hover:bg-[#0e9135] transition-colors disabled:opacity-50 mt-2 shadow-sm"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="w-full max-w-sm flex flex-col items-center gap-4 pb-4">
        
        <div className="w-full flex items-center justify-center gap-3">
          <div className="h-[1px] bg-gray-100 flex-1" />
          <span className="text-[10px] font-bold text-gray-400 tracking-wider">OU</span>
          <div className="h-[1px] bg-gray-100 flex-1" />
        </div>

        <button 
          type="button"
          onClick={() => window.location.href = 'http://localhost:3001/api/auth/google'}
          className="w-full bg-white text-black border border-gray-200 py-3.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors tracking-wider"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuar com Google
        </button>

        <p className="text-sm font-medium text-gray-600 mt-1">
          Ainda não tem uma conta?{' '}
          <Link href="/register" className="text-[#10A63D] hover:underline font-semibold">
            Criar conta
          </Link>
        </p>

        <span className="text-[10px] text-gray-300 pointer-events-none select-none">
          admin@meuexame.com | admin123
        </span>
      </div>

    </main>
  );
}