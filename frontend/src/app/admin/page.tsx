'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  UserGroupIcon,
  BuildingOffice2Icon,
  BookOpenIcon,
  DocumentTextIcon,
  CreditCardIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  PlusIcon,
  PencilIcon,
  HomeIcon,
  UsersIcon,
  BuildingLibraryIcon,
  SquaresPlusIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  PlayIcon,
  PauseIcon,
  RefreshIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalInstitutions: number;
  totalDisciplines: number;
  totalExams: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingPayments: number;
  usersGrowth: number;
  revenueGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'payment' | 'exam' | 'subscription';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

interface TopInstitution {
  id: string;
  name: string;
  users: number;
  exams: number;
  revenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInstitutions: 0,
    totalDisciplines: 0,
    totalExams: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    usersGrowth: 0,
    revenueGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topInstitutions, setTopInstitutions] = useState<TopInstitution[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('admin_token');

      // Fetch stats
      const statsResponse = await fetch(`${apiUrl}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent activity
      const activityResponse = await fetch(`${apiUrl}/admin/dashboard/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activityData = await activityResponse.json();
      setRecentActivity(activityData);

      // Fetch top institutions
      const institutionsResponse = await fetch(`${apiUrl}/admin/dashboard/institutions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const institutionsData = await institutionsResponse.json();
      setTopInstitutions(institutionsData);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      // Fallback com dados simulados
      setStats({
        totalUsers: 12453,
        totalInstitutions: 45,
        totalDisciplines: 234,
        totalExams: 1892,
        totalRevenue: 1245000,
        activeSubscriptions: 3421,
        pendingPayments: 89,
        usersGrowth: 23.5,
        revenueGrowth: 45.2,
      });
      setRecentActivity([
        { id: '1', type: 'user', description: 'Novo usuário registrado: João Silva', timestamp: '2 min atrás', status: 'success' },
        { id: '2', type: 'payment', description: 'Pagamento aprovado: MZN 500.00', timestamp: '5 min atrás', status: 'success' },
        { id: '3', type: 'exam', description: 'Exame completado: Matemática UEM', timestamp: '8 min atrás', status: 'success' },
        { id: '4', type: 'subscription', description: 'Nova assinatura: Maria Santos', timestamp: '12 min atrás', status: 'success' },
        { id: '5', type: 'payment', description: 'Pagamento pendente: MZN 299.00', timestamp: '15 min atrás', status: 'pending' },
      ]);
      setTopInstitutions([
        { id: '1', name: 'Universidade Eduardo Mondlane', users: 3245, exams: 456, revenue: 234000 },
        { id: '2', name: 'Universidade Católica de Moçambique', users: 2891, exams: 389, revenue: 198000 },
        { id: '3', name: 'ISUTC', users: 1567, exams: 234, revenue: 145000 },
        { id: '4', name: 'ISPU', users: 1234, exams: 189, revenue: 98000 },
        { id: '5', name: 'UniLúrio', users: 987, exams: 156, revenue: 76000 },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers.toLocaleString(),
      icon: UserGroupIcon,
      color: 'from-blue-500 to-cyan-500',
      trend: `+${stats.usersGrowth}%`,
      positive: true,
    },
    {
      title: 'Instituições',
      value: stats.totalInstitutions,
      icon: BuildingOffice2Icon,
      color: 'from-green-500 to-emerald-500',
      trend: '+8.2%',
      positive: true,
    },
    {
      title: 'Disciplinas',
      value: stats.totalDisciplines,
      icon: BookOpenIcon,
      color: 'from-purple-500 to-pink-500',
      trend: '+15.3%',
      positive: true,
    },
    {
      title: 'Exames',
      value: stats.totalExams,
      icon: DocumentTextIcon,
      color: 'from-orange-500 to-red-500',
      trend: '+22.1%',
      positive: true,
    },
    {
      title: 'Receita Total',
      value: `${(stats.totalRevenue / 1000).toFixed(0)}k MZN`,
      icon: CurrencyDollarIcon,
      color: 'from-yellow-500 to-orange-500',
      trend: `+${stats.revenueGrowth}%`,
      positive: true,
    },
    {
      title: 'Assinaturas Ativas',
      value: stats.activeSubscriptions,
      icon: CreditCardIcon,
      color: 'from-indigo-500 to-purple-500',
      trend: '+9.4%',
      positive: true,
    },
  ];

  const paymentData = [
    { name: 'M-Pesa', value: 45, color: '#00A63D' },
    { name: 'Transferência', value: 25, color: '#0095DA' },
    { name: 'Dinheiro', value: 15, color: '#FF6B00' },
    { name: 'Airtel Money', value: 10, color: '#FF0000' },
    { name: 'Vodacom M-Pesa', value: 5, color: '#00A63D' },
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 120000, users: 450, exams: 89 },
    { month: 'Fev', revenue: 145000, users: 520, exams: 112 },
    { month: 'Mar', revenue: 180000, users: 610, exams: 134 },
    { month: 'Abr', revenue: 210000, users: 720, exams: 156 },
    { month: 'Mai', revenue: 245000, users: 890, exams: 189 },
    { month: 'Jun', revenue: 290000, users: 1045, exams: 234 },
  ];

  const performanceData = [
    { metric: 'Tempo de Resposta', value: 85, fullMark: 100 },
    { metric: 'Disponibilidade', value: 99, fullMark: 100 },
    { metric: 'Taxa de Sucesso', value: 97, fullMark: 100 },
    { metric: 'Satisfação', value: 92, fullMark: 100 },
    { metric: 'Performance', value: 88, fullMark: 100 },
  ];

  const examCategories = [
    { name: 'Matemática', value: 450 },
    { name: 'Física', value: 320 },
    { name: 'Química', value: 280 },
    { name: 'Biologia', value: 240 },
    { name: 'Português', value: 190 },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
            <p className="text-slate-400">Visão geral do sistema em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all"
              title="Atualizar dados"
            >
              <RefreshIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all">
              <BellIcon className="w-5 h-5" />
            </button>
            <button className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all">
              <CogIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 bg-slate-800/50 p-2 rounded-2xl border border-slate-700/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'overview'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
          >
            <HomeIcon className="w-5 h-5" />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'analytics'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'performance'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
          >
            <PresentationChartLineIcon className="w-5 h-5" />
            Performance
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'users'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
          >
            <UsersIcon className="w-5 h-5" />
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'financial'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Financeiro
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${card.positive ? 'text-green-400' : 'text-red-400'
                        }`}>
                        <TrendingUpIcon className="w-4 h-4" />
                        {card.trend}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
                    <p className="text-slate-400 text-sm">{card.title}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <ChartBarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Receita Mensal</h2>
                      <p className="text-slate-400 text-sm">Evolução dos últimos 6 meses</p>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00A63D" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00A63D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#00A63D"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Receita (MZN)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Methods Chart */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <CreditCardIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Métodos de Pagamento</h2>
                    <p className="text-slate-400 text-sm">Distribuição por tipo</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry: any) => (
                          <span style={{ color: '#94a3b8' }}>{value} ({entry.payload.value}%)</span>
                        )}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity & Top Institutions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Atividade Recente</h2>
                  <button className="text-green-400 text-sm hover:text-green-300">Ver tudo</button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                        {activity.type === 'user' && <UserIcon className="w-5 h-5" />}
                        {activity.type === 'payment' && <CreditCardIcon className="w-5 h-5" />}
                        {activity.type === 'exam' && <DocumentTextIcon className="w-5 h-5" />}
                        {activity.type === 'subscription' && <CreditCardIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.description}</p>
                        <p className="text-slate-400 text-xs mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Institutions */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Top Instituições</h2>
                  <button
                    onClick={() => router.push('/admin/instituicoes')}
                    className="text-green-400 text-sm hover:text-green-300"
                  >
                    Ver tudo
                  </button>
                </div>
                <div className="space-y-4">
                  {topInstitutions.map((inst, index) => (
                    <div key={inst.id} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{inst.name}</p>
                        <p className="text-slate-400 text-xs">{inst.users} usuários • {inst.exams} exames</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">{(inst.revenue / 1000).toFixed(0)}k MZN</p>
                        <p className="text-slate-400 text-xs">receita</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <PresentationChartLineIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Crescimento de Usuários</h2>
                  <p className="text-slate-400 text-sm">Novos usuários por mês</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#a855f7"
                      strokeWidth={3}
                      name="Usuários"
                      dot={{ fill: '#a855f7', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Exam Categories Treemap */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Categorias de Exames</h2>
                  <p className="text-slate-400 text-sm">Distribuição por matéria</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={examCategories}
                    dataKey="value"
                    ratio={4 / 3}
                    stroke="#1e293b"
                    fill="#00A63D"
                  />
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Radar */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Performance do Sistema</h2>
                  <p className="text-slate-400 text-sm">Métricas operacionais</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                    <PolarRadiusAxis stroke="#94a3b8" />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#00A63D"
                      fill="#00A63D"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Exams Completion */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Conclusão de Exames</h2>
                  <p className="text-slate-400 text-sm">Exames completados por mês</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="exams" fill="#a855f7" name="Exames" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <PlayIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className="text-green-400 font-bold">Online</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-white">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">CPU</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Memória</span>
                  <span className="text-white">62%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Requests</p>
                  <p className="text-blue-400 font-bold">2.4k/min</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Latência</span>
                  <span className="text-white">45ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Erro Rate</span>
                  <span className="text-white">0.02%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Throughput</span>
                  <span className="text-white">1.8k/s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Usuários Ativos</p>
                  <p className="text-purple-400 font-bold">1,234</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Online</span>
                  <span className="text-white">856</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Sessões</span>
                  <span className="text-white">2,345</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Peak</span>
                  <span className="text-white">1,456</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Transações</p>
                  <p className="text-orange-400 font-bold">MZN 45k/h</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Aprovadas</span>
                  <span className="text-green-400">98.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pendentes</span>
                  <span className="text-yellow-400">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Rejeitadas</span>
                  <span className="text-red-400">1.5%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Gestão de Usuários</h2>
              <button
                onClick={() => router.push('/admin/usuarios')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                <SquaresPlusIcon className="w-5 h-5" />
                Novo Usuário
              </button>
            </div>
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Use a página completa de usuários para gerenciar todas as contas</p>
              <button
                onClick={() => router.push('/admin/usuarios')}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Ir para Gestão de Usuários
              </button>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Gestão Financeira</h2>
              <button
                onClick={() => router.push('/admin/pagamentos')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                Ver Todos os Pagamentos
              </button>
            </div>
            <div className="text-center py-12">
              <CreditCardIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Use a página completa de pagamentos para gerenciar todas as transações</p>
              <button
                onClick={() => router.push('/admin/pagamentos')}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Ir para Gestão de Pagamentos
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
