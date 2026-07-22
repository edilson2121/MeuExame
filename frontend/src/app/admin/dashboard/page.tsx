'use client';

import { useState } from 'react';
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
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Eye,
  Filter,
  MoreVertical,
  Search,
  Plus,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  UserCheck,
  UserPlus,
  Coins,
  Banknote,
  ReceiptText,
  Wallet2,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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

// ============================================
// DADOS CONTÁBEIS COMPLETOS
// ============================================

const revenueData = [
  { month: 'Jul', mpesa: 85800, emola: 46200, total: 132000 },
  { month: 'Ago', mpesa: 96200, emola: 51800, total: 148000 },
  { month: 'Set', mpesa: 107250, emola: 57750, total: 165000 },
  { month: 'Out', mpesa: 118300, emola: 63700, total: 182000 },
  { month: 'Nov', mpesa: 128700, emola: 69300, total: 198000 },
  { month: 'Dez', mpesa: 139750, emola: 75250, total: 215000 },
];

const dailyData = [
  { day: '10/01', transactions: 45, amount: 13450 },
  { day: '11/01', transactions: 52, amount: 15600 },
  { day: '12/01', transactions: 38, amount: 11400 },
  { day: '13/01', transactions: 61, amount: 18300 },
  { day: '14/01', transactions: 73, amount: 21900 },
  { day: '15/01', transactions: 89, amount: 26700 },
  { day: '16/01', transactions: 34, amount: 10200 },
];

const examAccessData = [
  { name: 'Acesso Pago', value: 1245, color: '#10A63D' },
  { name: 'Acesso Grátis', value: 567, color: '#F59E0B' },
];

const transactions = [
  { id: 'TXN001', user: 'Maria João Mucavel', method: 'M-Pesa', amount: 299, fee: 4.49, net: 294.51, status: 'completed', date: '16/01/2024 14:32', exam: 'Matemática UEM 2024' },
  { id: 'TXN002', user: 'Carlos Alberto Silva', method: 'e-Mola', amount: 149, fee: 2.24, net: 146.76, status: 'completed', date: '16/01/2024 13:45', exam: 'Física Básico' },
  { id: 'TXN003', user: 'Ana Paula Fernando', method: 'M-Pesa', amount: 499, fee: 7.49, net: 491.51, status: 'completed', date: '16/01/2024 12:18', exam: 'Pacote Completo UCM' },
  { id: 'TXN004', user: 'Paulo Miguel José', method: 'M-Pesa', amount: 299, fee: 4.49, net: 294.51, status: 'failed', date: '16/01/2024 11:55', exam: 'Matemática UEM 2024' },
  { id: 'TXN005', user: 'Luísa Cumbeia', method: 'e-Mola', amount: 199, fee: 2.99, net: 196.01, status: 'completed', date: '16/01/2024 10:30', exam: 'Química Geral' },
  { id: 'TXN006', user: 'João Mandlate', method: 'M-Pesa', amount: 99, fee: 1.49, net: 97.51, status: 'pending', date: '16/01/2024 09:15', exam: 'Exame Rápido' },
  { id: 'TXN007', user: 'Fernanda Jone', method: 'M-Pesa', amount: 299, fee: 4.49, net: 294.51, status: 'completed', date: '15/01/2024 18:42', exam: 'Matemática UEM 2024' },
  { id: 'TXN008', user: 'Ricardo Tembe', method: 'e-Mola', amount: 499, fee: 7.49, net: 491.51, status: 'failed', date: '15/01/2024 17:30', exam: 'Pacote Completo UCM' },
];

const recentExams = [
  { id: 1, title: 'Matemática UEM 2024', institution: 'UEM', students: 234, price: 299, status: 'published' },
  { id: 2, title: 'Física Geral', institution: 'UCM', students: 189, price: 199, status: 'published' },
  { id: 3, title: 'Química Orgânica', institution: 'UniLúrio', students: 156, price: 249, status: 'draft' },
];

const topInstitutions = [
  { name: 'UEM', students: 1245, exams: 45, revenue: 245600 },
  { name: 'UCM', students: 987, exams: 38, revenue: 189400 },
  { name: 'UniLúrio', students: 756, exams: 32, revenue: 156200 },
  { name: 'ISUTC', students: 645, exams: 28, revenue: 134500 },
  { name: 'ISPG', students: 534, exams: 24, revenue: 112800 },
];

// ============================================
// COMPONENTES
// ============================================

function StatCard({ title, value, subtitle, trend, icon, color, iconBg }: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  color: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={`flex items-center text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value.toLocaleString()} MZN</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <Check size={12} />, label: 'Concluído' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} />, label: 'Pendente' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', icon: <X size={12} />, label: 'Falhou' },
    published: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={12} />, label: 'Publicado' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <FileQuestion size={12} />, label: 'Rascunho' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const isMpesa = method === 'M-Pesa';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isMpesa ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      <span>{isMpesa ? '📱' : '💳'}</span>
      {method}
    </span>
  );
}

function RevenueAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorMpesa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10A63D" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10A63D" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="colorEmola" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          formatter={(value) => [`${Number(value).toLocaleString()} MZN`, '']}
        />
        <Legend />
        <Area type="monotone" dataKey="mpesa" name="M-Pesa" stackId="1" stroke="#10A63D" fill="url(#colorMpesa)" />
        <Area type="monotone" dataKey="emola" name="e-Mola" stackId="1" stroke="#F59E0B" fill="url(#colorEmola)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function DailyBarChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          formatter={(value) => [Number(value).toLocaleString(), '']}
        />
        <Bar dataKey="amount" name="Valor (MZN)" fill="#10A63D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function InstitutionBarChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={topInstitutions} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6B7280' }} width={60} />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          formatter={(value) => [Number(value).toLocaleString(), '']}
        />
        <Bar dataKey="students" name="Estudantes" fill="#10A63D" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DonutChart({ data }: { data: typeof examAccessData }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, '']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600">{item.name}</span>
            <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function AdminDashboard() {
  const [selectedPeriod] = useState('6meses');

  // Calcular totais
  const totalRevenue = revenueData.reduce((sum, m) => sum + m.total, 0);
  const totalMpesa = revenueData.reduce((sum, m) => sum + m.mpesa, 0);
  const totalEmola = revenueData.reduce((sum, m) => sum + m.emola, 0);
  const mpesaPercent = Math.round((totalMpesa / totalRevenue) * 100);
  const totalTransactions = dailyData.reduce((sum, d) => sum + d.transactions, 0);
  const totalAmount = dailyData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#10A63D] to-[#0e9135] text-white px-3 py-1.5 rounded-xl font-bold text-lg">
                ME
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">MeuExame</h1>
                <span className="text-xs bg-[#10A63D]/10 text-[#10A63D] px-2 py-0.5 rounded-full font-medium">Admin</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">4,234</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <Building2 size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">12</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <FileQuestion size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">67</span>
                </div>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-xl relative">
                <Bell size={20} className="text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Settings size={20} className="text-gray-500" />
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10A63D] to-[#10A63D]/80 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">admin@meuexame.co.mz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Visão geral da plataforma</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedPeriod}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="1mes">Último mês</option>
              <option value="6meses">Últimos 6 meses</option>
              <option value="1ano">Último ano</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Receita Total"
            value="1.040.000 MZN"
            trend={{ value: 24.5, isPositive: true }}
            icon={<Wallet size={24} />}
            color={COLORS.primary}
            iconBg="bg-green-100"
          />
          <StatCard
            title="Transações"
            value={totalTransactions.toString()}
            subtitle="este mês"
            trend={{ value: 15.3, isPositive: true }}
            icon={<Receipt size={24} />}
            color={COLORS.info}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Taxa Sucesso"
            value="95.2%"
            trend={{ value: 2.1, isPositive: true }}
            icon={<CheckCircle size={24} />}
            color={COLORS.primary}
            iconBg="bg-green-100"
          />
          <StatCard
            title="Valor Médio"
            value="265 MZN"
            trend={{ value: 5.2, isPositive: true }}
            icon={<Banknote size={24} />}
            color={COLORS.purple}
            iconBg="bg-purple-100"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart - 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Receita por Mês</h3>
                <p className="text-sm text-gray-500">M-Pesa vs e-Mola</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-gray-600">M-Pesa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">e-Mola</span>
                </div>
              </div>
            </div>
            <RevenueAreaChart />
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-xl font-bold text-gray-900">{totalRevenue.toLocaleString()} MZN</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">M-Pesa ({mpesaPercent}%)</p>
                <p className="text-xl font-bold text-green-600">{totalMpesa.toLocaleString()} MZN</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">e-Mola ({100-mpesaPercent}%)</p>
                <p className="text-xl font-bold text-yellow-600">{totalEmola.toLocaleString()} MZN</p>
              </div>
            </div>
          </div>

          {/* Access Distribution - 1/3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tipo de Acesso</h3>
                <p className="text-sm text-gray-500">Distribuição</p>
              </div>
            </div>
            <DonutChart data={examAccessData} />
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <ProgressBar label="Acesso Pago" value={1245} max={1812} color={COLORS.primary} />
              <ProgressBar label="Acesso Grátis" value={567} max={1812} color={COLORS.accent} />
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Transactions Table - 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Transações Recentes</h3>
                <p className="text-sm text-gray-500">Últimas transações</p>
              </div>
              <Link href="/admin/pagamentos" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Ver todas →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Líquido</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 6).map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 text-xs font-mono text-gray-600">{tx.id}</td>
                      <td className="py-3 px-2 text-sm font-medium text-gray-900">{tx.user}</td>
                      <td className="py-3 px-2"><MethodBadge method={tx.method} /></td>
                      <td className="py-3 px-2 text-sm font-bold text-gray-900 text-right">{tx.amount} MZN</td>
                      <td className="py-3 px-2 text-sm font-semibold text-green-600 text-right">{tx.net} MZN</td>
                      <td className="py-3 px-2 text-center"><StatusBadge status={tx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Institutions - 1/3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Top Instituições</h3>
                <p className="text-sm text-gray-500">Por estudantes</p>
              </div>
            </div>
            <InstitutionBarChart />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Transactions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Transações Diárias</h3>
                <p className="text-sm text-gray-500">Últimos 7 dias</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{totalAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">MZN total</p>
              </div>
            </div>
            <DailyBarChart />
          </div>

          {/* Recent Exams */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Exames Recentes</h3>
                <p className="text-sm text-gray-500">Últimos adicionados</p>
              </div>
              <Link href="/admin/exames/novo" className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                <Plus size={14} />
                Novo
              </Link>
            </div>
            <div className="space-y-3">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileQuestion size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{exam.title}</p>
                      <p className="text-xs text-gray-500">{exam.institution} • {exam.students} estudantes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{exam.price} MZN</p>
                    <StatusBadge status={exam.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Coins size={20} />
              </div>
              <div>
                <p className="text-green-100 text-sm">Total Taxas</p>
                <p className="text-2xl font-bold">15.600 MZN</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <UserPlus size={20} />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Novos Utilizadores</p>
                <p className="text-2xl font-bold">+234</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-purple-100 text-sm">Crescimento</p>
                <p className="text-2xl font-bold">+24.5%</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-orange-100 text-sm">Reembolsos</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
