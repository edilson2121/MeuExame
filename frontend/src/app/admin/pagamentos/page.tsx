'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Building2,
  MoreVertical,
  Download,
} from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  institutionId: string;
  institutionName: string;
  amount: number;
  method: 'M-Pesa' | 'Transferência' | 'Dinheiro' | 'Airtel Money';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('admin_token');

      // Simular dados da API
      setPayments([
        {
          id: '1',
          userId: '1',
          userName: 'João Silva',
          userEmail: 'joao@email.com',
          institutionId: '1',
          institutionName: 'Universidade Eduardo Mondlane',
          amount: 500,
          method: 'M-Pesa',
          status: 'approved',
          createdAt: '2024-01-20',
        },
        {
          id: '2',
          userId: '2',
          userName: 'Maria Santos',
          userEmail: 'maria@email.com',
          institutionId: '1',
          institutionName: 'Universidade Eduardo Mondlane',
          amount: 200,
          method: 'Transferência',
          status: 'pending',
          createdAt: '2024-01-21',
        },
        {
          id: '3',
          userId: '3',
          userName: 'Pedro Costa',
          userEmail: 'pedro@email.com',
          institutionId: '2',
          institutionName: 'Universidade Católica de Moçambique',
          amount: 500,
          method: 'Dinheiro',
          status: 'rejected',
          createdAt: '2024-01-19',
        },
        {
          id: '4',
          userId: '4',
          userName: 'Ana Ferreira',
          userEmail: 'ana@email.com',
          institutionId: '3',
          institutionName: 'ISUTC',
          amount: 500,
          method: 'Airtel Money',
          status: 'pending',
          createdAt: '2024-01-22',
        },
      ]);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    try {
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'approved' as const }
          : payment
      ));
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error);
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'rejected' as const }
          : payment
      ));
    } catch (error) {
      console.error('Erro ao rejeitar pagamento:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.institutionName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    approved: payments.filter(p => p.status === 'approved').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
    totalRevenue: payments.filter(p => p.status === 'approved').reduce((acc, p) => acc + p.amount, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
            <CheckCircle size={14} />
            Aprovado
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium">
            <XCircle size={14} />
            Rejeitado
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-medium">
            <Clock size={14} />
            Pendente
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando pagamentos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Pagamentos</h1>
          <p className="text-slate-400">Gerencie todas as transações do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-slate-400 text-sm">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-slate-400 text-sm">Pendentes</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.approved}</p>
                <p className="text-slate-400 text-sm">Aprovados</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalRevenue.toLocaleString()} MZN</p>
                <p className="text-slate-400 text-sm">Receita Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar pagamentos..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovados</option>
            <option value="rejected">Rejeitados</option>
          </select>
          <button className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:border-slate-600 transition-all flex items-center gap-2">
            <Download size={20} />
            Exportar
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Instituição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {payment.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{payment.userName}</p>
                          <p className="text-slate-400 text-sm">{payment.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-slate-400" />
                        <span className="text-white">{payment.institutionName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">{payment.amount.toLocaleString()} MZN</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar size={14} />
                        {new Date(payment.createdAt).toLocaleDateString('pt-PT')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(payment.id)}
                            className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all"
                            title="Aprovar"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(payment.id)}
                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                            title="Rejeitar"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum pagamento encontrado</h3>
              <p className="text-slate-500">Tente ajustar os filtros de pesquisa</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
