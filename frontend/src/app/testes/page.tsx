'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileCheck, Plus, Search, Building2, Clock, Layers, 
  MoreVertical, Edit3, Copy, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

// ... (Interface Testes mantida)

export default function TestesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('all');

  // Adicionando um estado simples de "Menu aberto" por linha se necessário, 
  // mas aqui usaremos botões diretos para simplicidade e performance.
  const [tests, setTests] = useState([
    { id: 't-1', title: 'Simulado Geral de Matemática', institutionName: 'UEM', duration: 90, totalQuestions: 20, isActive: true },
    { id: 't-2', title: 'Teste de Aptidão Física', institutionName: 'ISPT', duration: 60, totalQuestions: 15, isActive: true },
  ]);

  const toggleStatus = (id: string) => setTests(tests.map(t => t.id === id ? {...t, isActive: !t.isActive} : t));
  const deleteTest = (id: string) => setTests(tests.filter(t => t.id !== id));

  const filteredTests = tests.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedInstitution === 'all' || t.institutionName === selectedInstitution)
  );

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col md:flex-row text-sm">
      <Sidebar user={{ name: 'Admin', email: 'admin@meuexame.com', role: 'admin' }} isSidebarOpen={true} setIsSidebarOpen={() => {}} handleLogout={() => {}} />

      <div className="flex-1 w-full">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8">
          <h1 className="font-bold text-gray-800">Gestão de Simulados</h1>
          <button onClick={() => router.push('/testes/new')} className="flex items-center gap-2 px-4 py-2 bg-[#10A63D] text-white rounded-lg font-bold text-xs hover:bg-[#0e9135]">
            <Plus size={14} /> Novo Simulado
          </button>
        </header>

        <main className="p-6 space-y-4">
          {/* BARRA DE FERRAMENTAS MELHORADA */}
          <div className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Pesquisar..." onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg outline-none text-xs" />
            </div>
            <select onChange={(e) => setSelectedInstitution(e.target.value)} className="px-4 py-2 bg-gray-50 rounded-lg text-xs outline-none">
              <option value="all">Todas Instituições</option>
              <option value="UEM">UEM</option>
              <option value="ISPT">ISPT</option>
            </select>
          </div>

          {/* TABELA COM AÇÕES */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Simulado</th>
                  <th className="p-4">Instituição</th>
                  <th className="p-4">Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{test.title}</td>
                    <td className="p-4 text-gray-500">{test.institutionName}</td>
                    <td className="p-4 text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock size={12}/>{test.duration}m</span>
                        <span className="flex items-center gap-1"><Layers size={12}/>{test.totalQuestions}q</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleStatus(test.id)} className={`flex items-center gap-1 font-bold ${test.isActive ? 'text-[#10A63D]' : 'text-gray-400'}`}>
                        {test.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2 text-gray-400">
                        <button className="hover:text-blue-500 p-1"><Edit3 size={16} /></button>
                        <button className="hover:text-green-500 p-1"><Copy size={16} /></button>
                        <button onClick={() => deleteTest(test.id)} className="hover:text-red-500 p-1"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}