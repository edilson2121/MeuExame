'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Check,
  X,
  ChevronRight,
  CreditCard,
  History,
  Bell,
  Shield,
  LogOut,
  Edit3,
  Save,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

function ProfileContent() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'history'>('info');

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Results history
  const [results, setResults] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

        // Fetch profile
        const profileRes = await fetch(`${apiUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setName(profileData.name || '');
          setUsername(profileData.username || '');
          setEmail(profileData.email || '');
          setPhone(profileData.phone || '');
          setAvatar(profileData.avatar || null);
        } else if (profileRes.status === 401) {
          // Token expirado ou inválido
          logout();
          router.push('/login');
          return;
        }

        // Fetch results
        try {
          const resultsRes = await fetch(`${apiUrl}/results/my`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resultsRes.ok) {
            const resultsData = await resultsRes.json();
            setResults(Array.isArray(resultsData) ? resultsData.slice(0, 5) : []);
          }
        } catch (e) {
          console.warn('Resultados não disponíveis');
        }

        // Fetch subscriptions
        try {
          const subRes = await fetch(`${apiUrl}/subscriptions/my`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (subRes.ok) {
            const subData = await subRes.json();
            setSubscriptions(Array.isArray(subData) ? subData : []);
          }
        } catch (e) {
          console.warn('Assinaturas não disponíveis');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Não redireciona - mostra dados vazios em vez de quebrar a página
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, logout]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, username, phone }),
      });

      if (res.ok) {
        updateUser({ name, phone });
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

      const res = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        alert('Senha alterada com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        alert(data.message || 'Erro ao alterar senha.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao alterar senha.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 size={48} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* WhatsApp-style Header */}
      <header className="bg-[#006400] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="text-white">
              <ChevronRight className="rotate-180" size={24} />
            </Link>
            <h1 className="flex-1 text-center font-semibold text-lg">Meu Perfil</h1>
            <div className="w-6" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Profile Header - WhatsApp Style */}
        <div className="bg-white">
          <div className="px-4 py-6 flex flex-col items-center border-b border-gray-100">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-700">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-500">@{username}</p>
          </div>

          {/* WhatsApp-style Tab Bar */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Segurança
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Histórico
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white mt-2">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-4">
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-gray-900 bg-transparent border-none focus:outline-none focus:bg-gray-50 rounded px-2 py-1"
                />
              </div>

              <div className="px-4 py-4">
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Nome de Utilizador
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                    className="flex-1 text-gray-900 bg-transparent border-none focus:outline-none focus:bg-gray-50 rounded px-2 py-1"
                  />
                  <Edit3 size={16} className="text-gray-400" />
                </div>
              </div>

              <div className="px-4 py-4">
                <label className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-900">{email}</p>
                  </div>
                </label>
              </div>

              <div className="px-4 py-4">
                <label className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Telefone</p>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="84XXXXXXX"
                      className="w-full text-gray-900 bg-transparent border-none focus:outline-none focus:bg-gray-50 rounded px-2 py-1"
                    />
                  </div>
                  <Edit3 size={16} className="text-gray-400" />
                </label>
              </div>

              <div className="p-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      Guardar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-4">
                <label className="flex items-center gap-3 mb-4">
                  <Lock size={20} className="text-gray-400" />
                  <span className="text-gray-900 font-medium">Alterar Senha</span>
                </label>

                <div className="space-y-4 pl-9">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Senha Atual</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nova Senha</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Repita a nova senha"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Lock size={20} />
                        Alterar Senha
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="px-4 py-4">
                <label className="flex items-center gap-3">
                  <Shield size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Autenticação em Dois Fatores</p>
                    <p className="text-xs text-gray-500">Adicione uma camada extra de segurança</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Em breve</span>
                </label>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              {/* Subscriptions */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CreditCard size={16} />
                  Minhas Assinaturas
                </h3>
              </div>

              {subscriptions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {subscriptions.map((sub: any) => (
                    <div key={sub.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">{sub.plan?.name}</p>
                        <p className="text-xs text-gray-500">
                          Até {new Date(sub.endDate).toLocaleDateString('pt-MZ')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          sub.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {sub.status === 'ACTIVE' ? 'Ativa' : 'Expirada'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma assinatura ativa</p>
                </div>
              )}

              {/* Results */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 mt-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <History size={16} />
                  Meus Resultados
                </h3>
              </div>

              {results.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {results.map((result: any) => (
                    <Link
                      key={result.id}
                      href={`/exames/${result.examId}/resultado`}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-gray-900">{result.exam?.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(result.createdAt).toLocaleDateString('pt-MZ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            result.score >= 70 ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {result.score}%
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <History size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum resultado ainda</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-2 bg-white p-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Terminar Sessão
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
