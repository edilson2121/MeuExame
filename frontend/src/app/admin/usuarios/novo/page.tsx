'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Check,
  Shield,
  UserPlus,
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: 'USER' | 'TEACHER';
  institutionId: string;
  hasFullAccess: boolean;
}

export default function NovoUtilizadorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    institutionId: '',
    hasFullAccess: false,
  });

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiUrl}/institutions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setInstitutions(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
      }
    };

    fetchInstitutions();
  }, []);

  const validateForm = () => {
    if (!formData.name || formData.name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    if (!formData.username || formData.username.length < 3) {
      setError('O nome de utilizador deve ter pelo menos 3 caracteres');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As palavras-passe não coincidem');
      return false;
    }
    if (!formData.phone || formData.phone.length < 9) {
      setError('Número de telefone inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');

      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: `258${formData.phone}`,
          username: formData.username,
          password: formData.password,
          role: formData.role,
          institutionId: formData.institutionId || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Se tem acesso total, fazer uma segunda chamada
        if (formData.hasFullAccess && data.user?.id) {
          await fetch(`${apiUrl}/users/${data.user.id}/full-access`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ hasFullAccess: true }),
          });
        }

        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/usuarios');
        }, 2000);
      } else {
        setError(data.message || 'Erro ao criar utilizador');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/usuarios"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          Voltar para Utilizadores
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <UserPlus size={24} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Criar Novo Utilizador</h1>
            <p className="text-sm text-gray-500">Cadastre um novo utilizador no sistema</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-600 font-medium">Erro</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Check size={20} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-600 font-medium">Sucesso!</p>
              <p className="text-sm text-green-500">Utilizador criado com sucesso. A redirecionar...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo do utilizador"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome de Utilizador *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                placeholder="nomeutilizador"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600">
                +258
              </span>
              <div className="relative flex-1">
                <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="84XXXXXXX"
                  maxLength={9}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instituição
            </label>
            <div className="relative">
              <Building2 size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.institutionId}
                onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">Nenhuma</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Conta
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'USER' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === 'USER'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <User size={24} className={formData.role === 'USER' ? 'text-green-600' : 'text-gray-400'} />
                  <span className={`font-medium ${formData.role === 'USER' ? 'text-green-600' : 'text-gray-600'}`}>
                    Utilizador
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'TEACHER' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === 'TEACHER'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Shield size={24} className={formData.role === 'TEACHER' ? 'text-green-600' : 'text-gray-400'} />
                  <span className={`font-medium ${formData.role === 'TEACHER' ? 'text-green-600' : 'text-gray-600'}`}>
                    Professor
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Full Access */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasFullAccess}
                onChange={(e) => setFormData({ ...formData, hasFullAccess: e.target.checked })}
                className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">Acesso Total</p>
                <p className="text-sm text-gray-500">
                  Permite ao utilizador aceder a todos os exames pagos sem necessidade de pagamento.
                </p>
              </div>
            </label>
          </div>

          {/* Password */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Definir Palavra-passe</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavra-passe *
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Palavra-passe *
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repita a palavra-passe"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/usuarios')}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  A criar...
                </>
              ) : success ? (
                <>
                  <Check size={20} />
                  Criado com Sucesso!
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Criar Utilizador
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
