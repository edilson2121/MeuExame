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

const monthlyRevenue = [
  { month: 'Jul', mpesa: 85800, emola: 46200, total: 132000 },
  { month: 'Ago', mpesa: 96200, emola: 51800, total: 148000 },
  { month: 'Set', mpesa: 107250, emola: 57750, total: 165000 },
  { month: 'Out', mpesa: 118300, emola: 63700, total: 182000 },
  { month: 'Nov', mpesa: 128700, emola: 69300, total: 198000 },
  { month: 'Dez', mpesa: 139750, emola: 75250, total: 215000 },
];

const dailyTransactions = [
  { day: '10/01', transactions: 45, amount: 13450, success: 42 },
  { day: '11/01', transactions: 52, amount: 15600, success: 50 },
  { day: '12/01', transactions: 38, amount: 11400, success: 36 },
  { day: '13/01', transactions: 61, amount: 18300, success: 58 },
  { day: '14/01', transactions: 73, amount: 21900, success: 70 },
  { day: '15/01', transactions: 89, amount: 26700, success: 85 },
  { day: '16/01', transactions: 34, amount: 10200, success: 32 },
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

// ============================================
// COMPONENTES DE CONTABILIDADE
// ============================================

function KPICard({ title, value, subtitle, trend, icon, color, iconBg }: {
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
  const config = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <Check size={12} /> },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} /> },
    failed: { bg: 'bg-red-100', text: 'text-red-700', icon: <X size={12} /> },
  };
  const c = config[status as keyof typeof config] || config.pending;
  const labels = { completed: 'Concluído', pending: 'Pendente', failed: 'Falhou' };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon}
      {labels[status as keyof typeof labels]}
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
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10A63D" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10A63D" stopOpacity={0} />
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
        <Area type="monotone" dataKey="mpesa" name="M-Pesa" stackId="1" stroke="#10A63D" fill="#10A63D" />
        <Area type="monotone" dataKey="emola" name="e-Mola" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function DailyBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={dailyTransactions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          formatter={(value) => Number(value).toLocaleString()}
        />
        <Bar dataKey="amount" name="Valor (MZN)" fill="#10A63D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TransactionPieChart() {
  const data = [
    { name: 'M-Pesa', value: 65, color: '#10A63D' },
    { name: 'e-Mola', value: 35, color: '#F59E0B' },
  ];
  
  return (
    <div className="flex items-center justify-center gap-6">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, '']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-medium text-gray-700">{item.name}</span>
            <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6meses');

  // Calcular totais
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.total, 0);
  const totalMpesa = monthlyRevenue.reduce((sum, m) => sum + m.mpesa, 0);
  const totalEmola = monthlyRevenue.reduce((sum, m) => sum + m.emola, 0);
  const mpesaPercent = Math.round((totalMpesa / totalRevenue) * 100);
  const emolaPercent = 100 - mpesaPercent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidade</h1>
          <p className="text-gray-500 text-sm mt-1">Dashboard financeiro e contábil</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
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

      {/* KPI Cards - Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Receita Total"
          value="1.040.000"
          subtitle="MZN"
          trend={{ value: 24.5, isPositive: true }}
          icon={<Wallet size={24} />}
          color={COLORS.primary}
          iconBg="bg-green-100"
        />
        <KPICard
          title="M-Pesa"
          value={totalMpesa.toLocaleString()}
          subtitle={`${mpesaPercent}% do total`}
          trend={{ value: 18.2, isPositive: true }}
          icon={<CreditCard size={24} />}
          color={COLORS.primary}
          iconBg="bg-green-100"
        />
        <KPICard
          title="e-Mola"
          value={totalEmola.toLocaleString()}
          subtitle={`${emolaPercent}% do total`}
          trend={{ value: 22.1, isPositive: true }}
          icon={<Receipt size={24} />}
          color={COLORS.accent}
          iconBg="bg-yellow-100"
        />
        <KPICard
          title="Transações"
          value="392"
          subtitle="este mês"
          trend={{ value: 15.3, isPositive: true }}
          icon={<TrendingUp size={24} />}
          color={COLORS.info}
          iconBg="bg-blue-100"
        />
      </div>

      {/* Área Principal - 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Receita por Mês - 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Receita por Mês</h3>
              <p className="text-sm text-gray-500">M-Pesa vs e-Mola (últimos 6 meses)</p>
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
          
          {/* Resumo financeiro */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Geral</p>
              <p className="text-xl font-bold text-gray-900">{totalRevenue.toLocaleString()} MZN</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Taxa Média</p>
              <p className="text-xl font-bold text-gray-900">1.5%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Líquido</p>
              <p className="text-xl font-bold text-green-600">{(totalRevenue * 0.985).toLocaleString()} MZN</p>
            </div>
          </div>
        </div>

        {/* Métodos de Pagamento - 1/3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Métodos</h3>
              <p className="text-sm text-gray-500">Distribuição</p>
            </div>
          </div>
          <TransactionPieChart />
          
          {/* Breakdown */}
          <div className="mt-6 space-y-3">
            <ProgressBar label="M-Pesa" value={totalMpesa} max={totalRevenue} color={COLORS.primary} />
            <ProgressBar label="e-Mola" value={totalEmola} max={totalRevenue} color={COLORS.accent} />
          </div>
        </div>
      </div>

      {/* Transações Recentes - Tabela Completa */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Transações Recentes</h3>
            <p className="text-sm text-gray-500">Últimas transações de pagamento</p>
          </div>
          <Link href="/admin/pagamentos" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Ver todas →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Exame</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Taxa</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Líquido</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 text-xs font-mono text-gray-600">{tx.id}</td>
                  <td className="py-3 px-3 text-sm font-medium text-gray-900">{tx.user}</td>
                  <td className="py-3 px-3"><MethodBadge method={tx.method} /></td>
                  <td className="py-3 px-3 text-sm text-gray-600 truncate max-w-[150px]">{tx.exam}</td>
                  <td className="py-3 px-3 text-sm font-bold text-gray-900 text-right">{tx.amount} MZN</td>
                  <td className="py-3 px-3 text-xs text-red-500 text-right">-{tx.fee} MZN</td>
                  <td className="py-3 px-3 text-sm font-semibold text-green-600 text-right">{tx.net} MZN</td>
                  <td className="py-3 px-3 text-center"><StatusBadge status={tx.status} /></td>
                  <td className="py-3 px-3 text-xs text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico Diário + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transações Diárias */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Transações Diárias</h3>
              <p className="text-sm text-gray-500">Últimos 7 dias</p>
            </div>
          </div>
          <DailyBarChart />
        </div>

        {/* Status das Transações */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Status das Transações</h3>
              <p className="text-sm text-gray-500">Resumo do período</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Concluídas</p>
                  <p className="text-xs text-gray-500">Pagamentos bem-sucedidos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">373</p>
                <p className="text-xs text-green-600">95.2%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Clock size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pendentes</p>
                  <p className="text-xs text-gray-500">Aguardando confirmação</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-xs text-yellow-600">3.1%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Falhas</p>
                  <p className="text-xs text-gray-500">Transações recusadas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">7</p>
                <p className="text-xs text-red-600">1.7%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-green-100 text-sm">Valor Médio</p>
              <p className="text-2xl font-bold">265 MZN</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <RefreshCw size={20} />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Taxa Sucesso</p>
              <p className="text-2xl font-bold">95.2%</p>
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
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-orange-100 text-sm">Reembolsos</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
