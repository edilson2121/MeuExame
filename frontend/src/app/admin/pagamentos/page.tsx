'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, X } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

// Definição da interface de Transação
interface Transaction {
  id: string;
  user: string;
  plan: string;
  amount: string;
  date: string;
  gateway: string;
  ref: string;
  status: string;
}

export default function PagamentosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Dados de exemplo (Substitua pela chamada da sua API posteriormente)
  const [transactions] = useState<Transaction[]>([
    { id: '1', user: 'João Silva', plan: 'Meu Exame Mensal', amount: '299 MZN', date: '11/07/2026', gateway: 'M-Pesa', ref: 'MP-88273645', status: 'Concluído' },
    { id: '2', user: 'Maria Santos', plan: 'Meu Exame 24Horas', amount: '49 MZN', date: '10/07/2026', gateway: 'e-Mola', ref: 'EM-19283746', status: 'Pendente' },
  ]);

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col md:flex-row text-sm">
      <Sidebar />

      <div className="flex-1 w-full">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8">
          <h1 className="font-bold text-gray-800">Gestão de Pagamentos</h1>
          <button onClick={() => router.push('/admin/pagamentos/novo')} className="flex items-center gap-2 px-4 py-2 bg-[#10A63D] text-white rounded-lg font-bold text-xs hover:bg-[#0e9135]">
            <Plus size={14} /> Novo Pagamento
          </button>
        </header>

        <main className="p-6 space-y-4">
          {/* BARRA DE BUSCA */}
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar pagamentos por usuário..." 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg outline-none text-xs" 
              />
            </div>
          </div>

          {/* TABELA PRINCIPAL (4 CAMPOS) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-bold">
                <tr>
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 text-center">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.filter(t => t.user.toLowerCase().includes(searchTerm.toLowerCase())).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{t.user}</td>
                    <td className="p-4 text-gray-600">{t.plan}</td>
                    <td className="p-4 font-bold text-[#10A63D]">{t.amount}</td>
                    <td className="p-4 text-gray-500">{t.date}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => setSelectedTransaction(t)} className="text-gray-400 hover:text-green-600">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* POP-UP DE DETALHES (TÉCNICOS) */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="font-bold">Detalhes da Transação</h2>
              <button onClick={() => setSelectedTransaction(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Ref:</span> <span className="font-bold">{selectedTransaction.ref}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Gateway:</span> <span className="font-bold">{selectedTransaction.gateway}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status:</span> <span className="font-bold text-blue-600">{selectedTransaction.status}</span></div>
            </div>
            
            <button onClick={() => setSelectedTransaction(null)} className="w-full py-2 bg-gray-100 rounded-lg font-bold text-xs hover:bg-gray-200">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}