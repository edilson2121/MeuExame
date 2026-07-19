'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Edit3, Copy, Trash2, ToggleLeft, ToggleRight, 
  Clock, Layers, FileCheck, Plus, Menu, X 
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

// Interfaces
interface Test {
  id: string;
  title: string;
  inst: string;
  duration: number;
  qtt: number;
  active: boolean;
}

export default function TestesPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInst, setFilterInst] = useState('all');

  // Dados de Exemplo
  const [tests, setTests] = useState<Test[]>([
    { id: '1', title: 'Simulado Geral de Matemática', inst: 'UEM', duration: 90, qtt: 20, active: true },
    { id: '2', title: 'Teste de Aptidão Física', inst: 'ISPT', duration: 60, qtt: 15, active: true },
    { id: '3', title: 'Exame de Introdução ao Direito', inst: 'UEM', duration: 120, qtt: 40, active: false },
  ]);

  const toggleStatus = (id: string) => {
    setTests(tests.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  // Lógica de Filtro em Tempo Real (Busca + Instituição)
  const filteredData = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInst = filterInst === 'all' || t.inst === filterInst;
    return matchesSearch && matchesInst;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* HEADER MOBILE */}
      <header className="md:hidden h-16 w-full border-b border-gray-100 px-4 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-bold text-black text-sm tracking-tight">Testes</span>
        </div>
      </header>

      {/* SIDEBAR COMPONENTE */}
      <Sidebar />

      {/* Overlay para fechar sidebar no mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ÁREA PRINCIPAL DE CONTEÚDO */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* CABEÇALHO DA PÁGINA (DESKTOP) */}
        <header className="hidden md:flex h-20 bg-white border-b border-gray-200 px-8 items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Gestão de Simulados</h1>
            
            </div>
          </div>

          <button 
            onClick={() => router.push('/testes/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#10A63D] hover:bg-[#0e9135] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-green-100"
          >
            <Plus size={16} /> Novo Simulado
          </button>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <main className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* BARRA DE FILTRO E BUSCA (ESTILO IMAGEM) */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Pesquisar por nome do simulado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] rounded-xl border border-transparent focus:border-green-200 focus:bg-white outline-none text-sm font-medium transition-all"
              />
            </div>
            <select 
              value={filterInst}
              onChange={(e) => setFilterInst(e.target.value)}
              className="px-6 py-3 bg-[#F8F9FA] rounded-xl border border-transparent focus:border-green-200 focus:bg-white outline-none text-sm font-bold text-gray-600 appearance-none cursor-pointer transition-all min-w-[200px]"
            >
              <option value="all">Todas Instituições</option>
              <option value="UEM">UEM</option>
              <option value="ISPT">ISPT</option>
              <option value="EMN">EMN</option>
            </select>
          </div>

{/* TABELA DE RESULTADOS (Fontes Reduzidas para 13px/11px) */}
<div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
          <th className="p-3 pl-4">Simulado</th>
          <th className="p-3">Instituição</th>
          <th className="p-3">Info</th>
          <th className="p-3 text-center">Status</th>
          <th className="p-3 text-right pr-4">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {filteredData.map((test) => (
          <tr key={test.id} className="hover:bg-gray-50/30 transition-colors">
            
            {/* Título: 13px */}
            <td className="p-3 pl-4 text-[13px] font-bold text-gray-900">
              {test.title}
            </td>
            
            {/* Instituição: 11px */}
            <td className="p-3 text-[11px] font-semibold text-gray-600 uppercase tracking-tight">
              {test.inst}
            </td>
            
            {/* Info: 11px */}
            <td className="p-3 text-[11px] font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5"><Clock size={12} className="text-gray-400"/>{test.duration}m</span>
                <span className="flex items-center gap-0.5"><Layers size={12} className="text-gray-400"/>{test.qtt}q</span>
              </div>
            </td>
            
            {/* Status: Ícone 20px */}
            <td className="p-3 text-center">
              <button onClick={() => toggleStatus(test.id)}>
                {test.active ? (
                  <ToggleRight className="text-[#10A63D]" size={20} />
                ) : (
                  <ToggleLeft className="text-gray-300" size={20} />
                )}
              </button>
            </td>
            
            {/* Ações: Ícones 14px */}
            <td className="p-3 pr-4">
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button className="hover:text-blue-500 transition-colors"><Edit3 size={14} /></button>
                <button className="hover:text-green-600 transition-colors"><Copy size={14} /></button>
                <button className="hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}