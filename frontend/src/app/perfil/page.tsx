'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Phone,
  Lock,
  Camera,
  LogOut,
  Check,
  Loader2,
  ChevronRight,
  Save,
} from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'dados' | 'senha'>('dados');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || '',
      phone: parsedUser.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        const updatedUser = { ...user, name: formData.name, phone: formData.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('As palavras-passe não coincidem');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('A palavra-passe deve ter pelo menos 6 caracteres');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        alert('Palavra-passe alterada com sucesso!');
      } else {
        alert('Erro ao alterar palavra-passe');
      }
    } catch (error) {
      console.error('Erro ao alterar palavra-passe:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header estilo WhatsApp */}
      <div className="bg-[#008069] text-white">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold">Perfil</h1>
        </div>
        
        {/* Avatar grande */}
        <div className="flex flex-col items-center pb-6 pt-2">
          <div className="relative">
            <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-3 text-white/90 font-medium">{user?.name}</p>
          <p className="text-white/70 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Tabs simplificadas */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveSection('dados')}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeSection === 'dados'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveSection('senha')}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeSection === 'senha'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <Check className="w-5 h-5" />
          Alterações guardadas com sucesso!
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {activeSection === 'dados' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {/* Nome */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Nome</p>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-gray-900 font-medium bg-transparent border-none outline-none"
                    required
                  />
                </div>
              </label>
            </div>

            {/* Email (apenas leitura) */}
            <div className="bg-gray-100 rounded-xl p-4">
              <label className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-400 font-medium">{user?.email}</p>
                </div>
              </label>
            </div>

            {/* Telefone */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Telefone</p>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-gray-900 font-medium bg-transparent border-none outline-none"
                    placeholder="+258 XX XXX XXXX"
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Alterações
                </>
              )}
            </button>
          </form>
        )}

        {activeSection === 'senha' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-600" />
                Alterar Palavra-passe
              </h3>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Palavra-passe atual</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Nova palavra-passe</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Confirmar nova palavra-passe</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  A alterar...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Alterar Palavra-passe
                </>
              )}
            </button>
          </form>
        )}

        {/* Terminar sessão */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 mt-6 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Terminar Sessão
        </button>
      </div>

      {/* Versão no rodapé */}
      <div className="text-center py-4 text-xs text-gray-400">
        MeuExame v1.0.0 • Moçambique
      </div>
    </div>
  );
}
