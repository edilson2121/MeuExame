'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalInstitutions: number;
  totalExams: number;
  totalRevenue: number;
  userGrowth: number;
  examGrowth: number;
  revenueGrowth: number;
  recentPayments: any[];
  recentUsers: any[];
  examStats: { published: number; draft: number; archived: number };
  monthlyData: { month: string; users: number; exams: number; revenue: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Demo data with realistic values
      const demoStats: DashboardStats = {
        totalUsers: 1247,
        totalInstitutions: 23,
        totalExams: 89,
        totalRevenue: 456780,
        userGrowth: 12.5,
        examGrowth: 8.3,
        revenueGrowth: 15.7,
        recentPayments: [
          { id: '1', user: 'João Machava', amount: 299, method: 'M-PESA', status: 'COMPLETED', createdAt: new Date().toISOString() },
          { id: '2', user: 'Maria Santos', amount: 599, method: 'eMola', status: 'COMPLETED', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: '3', user: 'Carlos Dique', amount: 299, method: 'M-PESA', status: 'PENDING', createdAt: new Date(Date.now() - 7200000).toISOString() },
        ],
        recentUsers: [
          { id: '1', name: 'Ana Pinto', email: 'ana.pinto@email.com', createdAt: new Date().toISOString() },
          { id: '2', name: 'Pedro Nhabanga', email: 'pedro.nhabanga@email.com', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { id: '3', name: 'Luísa Muteto', email: 'luisa.muteto@email.com', createdAt: new Date(Date.now() - 172800000).toISOString() },
        ],
        examStats: { published: 45, draft: 32, archived: 12 },
        monthlyData: [
          { month: 'Jan', users: 180, exams: 12, revenue: 45000 },
          { month: 'Fev', users: 220, exams: 15, revenue: 52000 },
          { month: 'Mar', users: 280, exams: 18, revenue: 61000 },
          { month: 'Abr', users: 320, exams: 22, revenue: 72000 },
          { month: 'Mai', users: 380, exams: 25, revenue: 85000 },
          { month: 'Jun', users: 420, exams: 28, revenue: 98000 },
        ],
      };

      // Try to get real data from API
      try {
        const res = await fetch(`${apiUrl}/stats/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats({ ...demoStats, ...data });
        } else {
          setStats(demoStats);
        }
      } catch {
        setStats(demoStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Visão geral do sistema</p>
            </div>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Users */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats?.userGrowth && stats.userGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats?.userGrowth && stats.userGrowth > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stats?.userGrowth?.toFixed(1)}%
              </div>
            </div>
            <p className="text-slate-400 text-sm">Total Utilizadores</p>
            <p className="text-3xl font-bold text-white mt-1">{stats?.totalUsers?.toLocaleString()}</p>
          </div>

          {/* Institutions */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
              <Activity className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-slate-400 text-sm">Instituições</p>
            <p className="text-3xl font-bold text-white mt-1">{stats?.totalInstitutions}</p>
          </div>

          {/* Exams */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats?.examGrowth && stats.examGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats?.examGrowth && stats.examGrowth > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stats?.examGrowth?.toFixed(1)}%
              </div>
            </div>
            <p className="text-slate-400 text-sm">Total Exames</p>
            <p className="text-3xl font-bold text-white mt-1">{stats?.totalExams}</p>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-amber-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex items-center gap-1 text-sm text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                {stats?.revenueGrowth?.toFixed(1)}%
              </div>
            </div>
            <p className="text-slate-400 text-sm">Receita Total</p>
            <p className="text-3xl font-bold text-white mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Receita Mensal</h3>
                <p className="text-slate-400 text-sm">Últimos 6 meses</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats?.monthlyData?.map((item) => (
                  <div key={item.month} className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm w-12">{item.month}</span>
                    <div className="flex-1 h-8 bg-slate-700/50 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg transition-all duration-500"
                        style={{ width: `${(item.revenue / 100000) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium text-sm w-20 text-right">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Estado dos Exames</h3>
                <p className="text-slate-400 text-sm">Visão geral</p>
              </div>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-white font-medium">Publicados</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{stats?.examStats?.published}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-white font-medium">Rascunhos</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{stats?.examStats?.draft}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-500/10 rounded-xl border border-slate-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-500/20 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-white font-medium">Arquivados</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-400">{stats?.examStats?.archived}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Pagamentos Recentes</h3>
                <p className="text-slate-400 text-sm">Últimas transações</p>
              </div>
              <Link href="/admin/pagamentos" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                Ver todos →
              </Link>
            </div>
            <div className="divide-y divide-slate-700/50">
              {stats?.recentPayments?.map((payment) => (
                <div key={payment.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'COMPLETED' ? 'bg-green-500/20' : 
                      payment.status === 'PENDING' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                    }`}>
                      {payment.status === 'COMPLETED' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : payment.status === 'PENDING' ? (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{payment.user}</p>
                      <p className="text-slate-400 text-sm">{payment.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatCurrency(payment.amount)}</p>
                    <p className="text-slate-400 text-xs">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Novos Utilizadores</h3>
                <p className="text-slate-400 text-sm">Registos recentes</p>
              </div>
              <Link href="/admin/usuarios" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                Ver todos →
              </Link>
            </div>
            <div className="divide-y divide-slate-700/50">
              {stats?.recentUsers?.map((user) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-slate-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">{formatDate(user.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
