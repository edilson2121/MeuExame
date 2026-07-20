'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/auth/recover-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setMessage(data.message || 'Erro ao enviar email de recuperação');
      }
    } catch (error) {
      setMessage('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-between items-center bg-white px-6 py-6 overflow-y-auto">
      
      {/* Cabeçalho */}
      <div className="flex flex-col items-center w-full max-w-sm text-center pt-2 mb-6">
        <div className="flex items-center justify-center w-20 h-20 bg-[#F8F9FA] rounded-2xl shadow-sm">
          <img
            src="/logo.png"
            alt="MeuExame Logo"
            className="w-14 h-14 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mt-4 text-black tracking-tight">
          Recuperar Senha
        </h1>

        <p className="mt-1 text-sm text-gray-600 px-4 leading-snug">
          Digite seu email para receber instruções de recuperação
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10A63D] text-black placeholder-gray-400 text-sm"
            required
          />
        </div>

        {message && (
          <div className={`text-sm text-center ${message.includes('enviado') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#10A63D] text-white py-3.5 px-5 rounded-xl font-medium text-base hover:bg-[#0e9135] transition-colors disabled:opacity-50 mt-2 shadow-sm"
        >
          {loading ? 'Enviando...' : 'Enviar Email'}
        </button>
      </form>

      {/* Link para voltar */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 pb-4">
        <p className="text-sm font-medium text-gray-600">
          Lembrou sua senha?{' '}
          <Link href="/login" className="text-[#10A63D] hover:underline font-semibold">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}
