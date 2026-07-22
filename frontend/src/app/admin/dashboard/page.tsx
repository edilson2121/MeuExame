'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  BookOpen,
  FileQuestion,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Cores profissionais
const COLORS = {
  primary: '#10A63D',
  secondary: '#006800',
  accent: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  purple: '#8B5CF6',
  pink: '#EC4899',
  gray: '#6B7280',
};

// Dados de exemplo realistas
const monthlyData = [
  { month: 'Jan', exams: 245, revenue: 45000, users: 120 },
  { month: 'Fev', exams: 312, revenue: 58000, users: 145 },
  { month: 'Mar', exams: 398, revenue: 72000, users: 178 },
  { month: 'Abr', exams: 456, revenue: 85000, users: 201 },
  { month: 'Mai', exams: 524, revenue: 98000, users: 234 },
  { month: 'Jun', exams: 612, revenue: 115000, users: 267 },
  { month: 'Jul', exams: 698, revenue: 132000, users: 289 },
  { month: 'Ago', exams: 745, revenue: 148000, users: 312 },
  { month: 'Set', exams: 812, revenue: 165000, users: 345 },
  { month: 'Out', exams: 889, revenue: 182000, users: 378 },
  { month: 'Nov', exams: 956, revenue: 198000, users: 401 },
  { month: 'Dez', exams: 1024, revenue: 215000, users: 434 },
];

const paymentMethodsData = [
  { name: 'M-Pesa', value: 65, amount: 139750, color: '#10A63D' },
  { name: 'e-Mola', value: 35, amount: 75250, color: '#F59E0B' },
];

const examResultsData = [
  { range: '0-20%', count: 45, color: '#EF4444' },
  { range: '21-40%', count: 128, color: '#F97316' },
  { range: '41-60%', count: 342, color: '#F59E0B' },
  { range: '61-80%', count: 567, color: '#10A63D' },
  { range: '81-100%', count: 423, color: '#006800' },
];

const institutionData = [
  { name: 'UEM', exams: 1234, users: 456, color: '#10A63D' },
  { name: 'UCM', exams: 987, users: 389, color: '#006800' },
  { name: 'UniLúrio', exams: 756, users: 312, color: '#F59E0B' },
  { name: 'ISUTC', exams: 645, users: 278, color: '#3B82F6' },
  { name: 'ISPG', exams: 534, users: 234, color: '#8B5CF6' },
];

const weeklyExamsData = [
  { day: 'Seg', exams: 145, passRate: 72 },
  { day: 'Ter', exams: 189, passRate: 68 },
  { day: 'Qua', exams: 234, passRate: 75 },
  { day: 'Qui', exams: 198, passRate: 71 },
  { day: 'Sex', exams: 267, passRate: 78 },
  { day: 'Sáb', exams: 312, passRate: 82 },
  { day: 'Dom', exams: 89, passRate: 65 },
];

const recentTransactions = [
  { id: 'ME001', user: 'Maria João', method: 'M-Pesa', amount: 299, status: 'completed', date: '2024-01-15 14:32' },
  { id: 'ME002', user: 'Carlos Silva', method: 'e-Mola', amount: 149, status: 'pending', date: '2024-01-15 13:45' },
  { id: 'ME003', user: 'Ana Muteia', method: 'M-Pesa', amount: 499, status: 'completed', date: '2024-01-15 12:18' },
  { id: 'ME004', user: 'Paulo José', method: 'M-Pesa', amount: 299, status: 'failed', date: '2024-01-15 11:55' },
  { id: 'ME005', user: 'Luísa Fernando', method: 'e-Mola', amount: 199, status: 'completed', date: '2024-01-15 10:30' },
];

// Componentes de gráficos profissionais
function StatCard({ title, value, subtitle, trend, icon, color }: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

function AreaChartComponent({ data }: { data: typeof monthlyData }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10A63D" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10A63D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          formatter={(value) => [`${Number(value).toLocaleString()} MZN`, 'Receita']}
        />
        <Area type="monotone" dataKey="revenue" stroke="#10A63D" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function LineChartComponent({ data }: { data: typeof monthlyData }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Legend />
        <Line type="monotone" dataKey="exams" name="Exames" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="users" name="Utilizadores" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function BarChartComponent({ data }: { data: typeof institutionData }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Legend />
        <Bar dataKey="exams" name="Exames Feitos" fill="#10A63D" radius={[4, 4, 0, 0]} />
        <Bar dataKey="users" name="Utilizadores" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieChartComponent({ data }: { data: typeof paymentMethodsData }) {
  return (
    <div className="flex items-center justify-center gap-8">
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value) => [`${value}%`, 'Percentagem']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
            <div>
              <p className="text-sm font-medium text-gray-700">{item.name}</p>
              <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</p>
              <p className="text-xs text-gray-400">{item.amount.toLocaleString()} MZN</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarChart({ data }: { data: typeof examResultsData }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis dataKey="range" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} width={60} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Bar dataKey="count" name="Estudantes" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function RadialBarChart({ data }: { data: typeof weeklyExamsData }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Bar dataKey="exams" name="Exames" fill="#10A63D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Badge de status para transações
function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
  };
  const labels = {
    completed: 'Concluído',
    pending: 'Pendente',
    failed: 'Falhou',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

export default function AdminDashboard() {
  const [loading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral da plataforma MeuExame</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Últimos 12 meses</option>
            <option>Últimos 6 meses</option>
            <option>Último mês</option>
            <option>Última semana</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Ganhos"
          value="215.000"
          subtitle="MZN este ano"
          trend={{ value: 24.5, isPositive: true }}
          icon={<DollarSign size={24} />}
          color={COLORS.primary}
        />
        <StatCard
          title="Exames Realizados"
          value="8.012"
          subtitle="Este ano"
          trend={{ value: 12.3, isPositive: true }}
          icon={<FileQuestion size={24} />}
          color={COLORS.info}
        />
        <StatCard
          title="Total Utilizadores"
          value="4.234"
          subtitle="Estudantes ativos"
          trend={{ value: 8.1, isPositive: true }}
          icon={<Users size={24} />}
          color={COLORS.purple}
        />
        <StatCard
          title="Taxa de Aprovação"
          value="74%"
          subtitle="Média geral"
          trend={{ value: 3.2, isPositive: true }}
          icon={<CheckCircle size={24} />}
          color={COLORS.secondary}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receita Mensal - Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Receita Mensal</h3>
              <p className="text-sm text-gray-500">Evolução da receita em 2024</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp size={14} />
                +24.5%
              </span>
            </div>
          </div>
          <AreaChartComponent data={monthlyData} />
        </div>

        {/* Métodos de Pagamento - Donut Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Métodos de Pagamento</h3>
              <p className="text-sm text-gray-500">Distribuição por método</p>
            </div>
          </div>
          <PieChartComponent data={paymentMethodsData} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exames e Utilizadores - Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Exames & Utilizadores</h3>
              <p className="text-sm text-gray-500">Crescimento ao longo do ano</p>
            </div>
          </div>
          <LineChartComponent data={monthlyData} />
        </div>

        {/* Distribuição de Notas - Horizontal Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Resultados por Nota</h3>
              <p className="text-sm text-gray-500">Distribuição dos estudantes</p>
            </div>
          </div>
          <HorizontalBarChart data={examResultsData} />
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exames por Instituição - Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Exames por Instituição</h3>
              <p className="text-sm text-gray-500">Top instituições mais procuradas</p>
            </div>
          </div>
          <BarChartComponent data={institutionData} />
        </div>

        {/* Exames por Dia da Semana - Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Actividade Semanal</h3>
              <p className="text-sm text-gray-500">Exames feitos por dia</p>
            </div>
          </div>
          <RadialBarChart data={weeklyExamsData} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Transações Recentes</h3>
            <p className="text-sm text-gray-500">Últimas 5 transações de pagamento</p>
          </div>
          <Link href="/admin/pagamentos" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilizador</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-mono text-gray-600">{tx.id}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{tx.user}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      tx.method === 'M-Pesa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {tx.method === 'M-Pesa' ? '📱' : '💳'} {tx.method}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-gray-900">{tx.amount} MZN</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{tx.date}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-green-100 text-sm">Instituições</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Disciplinas</p>
              <p className="text-2xl font-bold">48</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <FileQuestion size={20} />
            </div>
            <div>
              <p className="text-purple-100 text-sm">Exames Publicados</p>
              <p className="text-2xl font-bold">67</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-orange-100 text-sm">Exames Rascunho</p>
              <p className="text-2xl font-bold">22</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
