'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Shield, Lock, Mail, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'ADMIN') {
        router.push('/admin');
      }
    }
    setIsVisible(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (data.user && data.user.role !== 'ADMIN') {
          setError('⚠️ Acesso negado. Apenas administradores.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', data.token || data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user || data.userData));
        localStorage.setItem('is_admin', 'true');
        
        router.push('/admin');
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className={`relative w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
            <p className="text-cyan-100 text-sm mt-1">MeuExame - Gestão de Sistema</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Email do Administrador
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="admin@meuexame.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> A entrar...</>
                ) : (
                  <><Shield className="w-5 h-5" /> Entrar como Admin</>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-slate-300 text-sm font-medium">Acesso Restrito</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Apenas administradores autorizados podem aceder a esta área.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-slate-900/50 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                ← Login de Usuário
              </Link>
              <span className="text-slate-500">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
