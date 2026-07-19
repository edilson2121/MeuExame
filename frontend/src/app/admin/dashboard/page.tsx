'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  FileQuestion,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';

// Simple SVG Chart Components
function LineChartComponent({ data, color = '#006800' }: { data: { month: string; count: number }[]; color?: string }) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const height = 200;
  const width = 100;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1 || 1)) * width,
    y: height - (d.count / maxValue) * height * 0.9,
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#gradient-${color.replace('#', '')})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((d, i) => (
          <span key={i}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

function BarChartComponent({ data, color = '#006800' }: { data: { name: string; count: number }[]; color?: string }) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-24 text-xs text-gray-600 truncate">{d.name}</div>
          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(d.count / maxValue) * 100}%`, backgroundColor: color }}
            />
          </div>
          <div className="w-8 text-xs font-medium text-gray-700">{d.count}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChartComponent({ data }: { data: { type: string; count: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  let currentAngle = -90;

  const getArc = (count: number, color: string) => {
    const angle = (count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const start = polarToCartesian(50, 50, 40, startAngle);
    const end = polarToCartesian(50, 50, 40, endAngle);
    const largeArcFlag = angle > 180 ? 1 : 0;

    return `M ${start.x} ${start.y} A 40 40 0 ${largeArcFlag} 1 ${end.x} ${end.y} L 50 50 Z`;
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {data.map((d, i) => (
          <path key={i} d={getArc(d.count, d.color)} fill={d.color} />
        ))}
        <circle cx="50" cy="50" r="25" fill="white" />
        <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-xs font-bold fill-gray-700">
          {total}
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-600">{d.type}</span>
            <span className="text-xs font-medium text-gray-800">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  color: string;
  href?: string;
}

function StatCard({ title, value, subtitle, trend, icon, color, href }: StatCardProps) {
  const content = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`flex items-center text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

interface Activity {
  id: string;
  action: string;
  entity: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutions: 0,
    totalDisciplines: 0,
    totalExams: 0,
    totalResults: 0,
    publishedExams: 0,
    draftExams: 0,
    freeExams: 0,
    paidExams: 0,
  });
  const [charts, setCharts] = useState({
    examsByMonth: [] as { month: string; count: number }[],
    usersByInstitution: [] as { name: string; count: number }[],
    revenueByMethod: [] as { method: string; amount: number }[],
    accessTypeDistribution: [] as { type: string; count: number; color: string }[],
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, examsByMonthRes, usersByInstitutionRes, revenueRes, accessTypeRes, activityRes] =
        await Promise.all([
          fetch(`${apiUrl}/admin/dashboard/stats`, { headers }),
          fetch(`${apiUrl}/admin/dashboard/charts/exams-monthly`, { headers }),
          fetch(`${apiUrl}/admin/dashboard/charts/users-by-institution`, { headers }),
          fetch(`${apiUrl}/admin/dashboard/charts/revenue-by-method`, { headers }),
          fetch(`${apiUrl}/admin/dashboard/charts/access-type-distribution`, { headers }),
          fetch(`${apiUrl}/admin/dashboard/recent-activity`, { headers }),
        ]);

      const statsData = await statsRes.json().catch(() => null);
      const examsByMonth = await examsByMonthRes.json().catch(() => []);
      const usersByInstitution = await usersByInstitutionRes.json().catch(() => []);
      const revenueByMethod = await revenueRes.json().catch(() => []);
      const accessTypeDistribution = await accessTypeRes.json().catch(() => []);
      const activitiesData = await activityRes.json().catch(() => []);

      if (statsData) setStats(statsData);
      setCharts({
        examsByMonth,
        usersByInstitution,
        revenueByMethod,
        accessTypeDistribution,
      });
      setActivities(activitiesData.slice(0, 8));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Fallback para dados simulados
      setStats({
        totalUsers: 156,
        totalInstitutions: 12,
        totalDisciplines: 48,
        totalExams: 89,
        totalResults: 1245,
        publishedExams: 67,
        draftExams: 22,
        freeExams: 54,
        paidExams: 35,
      });
      setCharts({
        examsByMonth: [
          { month: 'Jan', count: 45 },
          { month: 'Fev', count: 52 },
          { month: 'Mar', count: 38 },
          { month: 'Abr', count: 67 },
          { month: 'Mai', count: 73 },
          { month: 'Jun', count: 89 },
        ],
        usersByInstitution: [
          { name: 'UCM', count: 45 },
          { name: 'UEM', count: 38 },
          { name: 'ISUTC', count: 29 },
          { name: 'ISPG', count: 24 },
        ],
        revenueByMethod: [
          { method: 'M-Pesa', amount: 15420 },
          { method: 'eMola', amount: 8340 },
        ],
        accessTypeDistribution: [
          { type: 'Grátis', count: 54, color: '#006800' },
          { type: 'Pago', count: 35, color: '#D21034' },
        ],
      });
      setActivities([
        { id: '1', action: 'Publicou exame', entity: 'Matemática 2024', createdAt: new Date().toISOString() },
        { id: '2', action: 'Criou usuário', entity: 'João Mucavel', createdAt: new Date().toISOString() },
        { id: '3', action: 'Aprovou pagamento', entity: 'Maria Jone', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral do sistema MeuExame</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option>Últimos 6 meses</option>
            <option>Último ano</option>
            <option>Todo o período</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Atualizar"
          >
            <Activity size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Utilizadores"
          value={stats.totalUsers}
          subtitle="Usuários registados"
          trend={{ value: 12, isPositive: true }}
          icon={<Users size={24} />}
          color="#006800"
          href="/admin/usuarios"
        />
        <StatCard
          title="Instituições"
          value={stats.totalInstitutions}
          subtitle="Ativas no sistema"
          trend={{ value: 8, isPositive: true }}
          icon={<Building2 size={24} />}
          color="#1E40AF"
          href="/admin/instituicoes"
        />
        <StatCard
          title="Exames Publicados"
          value={stats.publishedExams}
          subtitle={`${stats.draftExams} em rascunho`}
          trend={{ value: 5, isPositive: true }}
          icon={<FileQuestion size={24} />}
          color="#D97706"
          href="/admin/exames"
        />
        <StatCard
          title="Total Resultados"
          value={stats.totalResults}
          subtitle="Exames realizados"
          trend={{ value: 18, isPositive: true }}
          icon={<CheckCircle size={24} />}
          color="#7C3AED"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Exams by Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Exames Realizados</h3>
              <p className="text-xs text-gray-500">Últimos 6 meses</p>
            </div>
            <LineChart size={20} className="text-gray-400" />
          </div>
          <LineChartComponent data={charts.examsByMonth} color="#006800" />
        </div>

        {/* Bar Chart - Users by Institution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Utilizadores por Instituição</h3>
              <p className="text-xs text-gray-500">Distribuição atual</p>
            </div>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <BarChartComponent data={charts.usersByInstitution} color="#1E40AF" />
        </div>

        {/* Donut Chart - Access Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tipo de Acesso</h3>
              <p className="text-xs text-gray-500">Grátis vs Pago</p>
            </div>
            <PieChart size={20} className="text-gray-400" />
          </div>
          <DonutChartComponent data={charts.accessTypeDistribution} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/instituicoes/novo"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200">
                <Building2 size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Nova Instituição</p>
                <p className="text-xs text-gray-500">Adicionar ao sistema</p>
              </div>
            </Link>
            <Link
              href="/admin/disciplinas/novo"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Nova Disciplina</p>
                <p className="text-xs text-gray-500">Criar matéria</p>
              </div>
            </Link>
            <Link
              href="/admin/exames/novo"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200">
                <FileQuestion size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Novo Exame</p>
                <p className="text-xs text-gray-500">Criar avaliação</p>
              </div>
            </Link>
            <Link
              href="/admin/usuarios/novo"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200">
                <Users size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Novo Utilizador</p>
                <p className="text-xs text-gray-500">Cadastrar pessoa</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
            <Link href="/admin/atividades" className="text-sm text-green-600 hover:text-green-700">
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Activity size={16} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-gray-500">{activity.entity}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(activity.createdAt).toLocaleString('pt-MZ')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity size={32} className="mx-auto mb-2 opacity-50" />
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/20">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-green-100 text-sm">Exames Grátis</p>
              <p className="text-2xl font-bold">{stats.freeExams}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/20">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-red-100 text-sm">Exames Pagos</p>
              <p className="text-2xl font-bold">{stats.paidExams}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/20">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-yellow-100 text-sm">Em Rascunho</p>
              <p className="text-2xl font-bold">{stats.draftExams}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}