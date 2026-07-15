'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, User, CreditCard, 
  Hash, Calendar, Banknote, CheckCircle2 
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

export default function NovoPagamentoPage() {
  const router = useRouter();
  
  // Estado do Formulário
  const [formData, setFormData] = useState({
    usuario: '',
    plano: '',
    metodo: '',
    referencia: '',
    valor: '',
    data: new Date().toISOString().split('T')[0] // Data de hoje por padrão
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui viria a lógica de envio para o banco de dados
    console.log('Dados salvos:', formData);
    alert('✅ Pagamento registado com sucesso no sistema!');
    router.push('/pagamentos');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col md:flex-row text-sm">
      <Sidebar 
        user={{ name: 'Admin', email: 'admin@meuexame.com' }}  // role removido
        isSidebarOpen={true}
        setIsSidebarOpen={() => { }}
        handleLogout={() => { }}
      />

      <div className="flex-1 w-full">
        {/* HEADER COM BOTÃO VOLTAR */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/pagamentos')}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-gray-800">Registar Novo Pagamento</h1>
          </div>
          
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-[#10A63D] text-white rounded-xl font-bold text-xs uppercase hover:bg-[#0e9135] shadow-md shadow-green-100 transition-all"
          >
            <Save size={14} /> Salvar Registo
          </button>
        </header>

        <main className="p-6 max-w-2xl mx-auto space-y-6">
          
          {/* CARD DO FORMULÁRIO */}
          <form onSubmit={handleSave} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 space-y-6">
            
            {/* Secção: Identificação */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informações do Cliente</p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Buscar Usuário</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text"
                      placeholder="Ex: João Silva ou joao@email.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-[13px] font-medium transition-all"
                      onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secção: Detalhes do Plano */}
            <div className="space-y-4 pt-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plano e Pagamento</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Selecionar Plano</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-[13px] font-bold text-gray-700 appearance-none cursor-pointer"
                      onChange={(e) => setFormData({...formData, plano: e.target.value})}
                    >
                      <option value="">Escolha um plano...</option>
                      <option value="24h">Meu Exame 24Horas - 49 MZN</option>
                      <option value="semanal">Meu Exame Semanal - 99 MZN</option>
                      <option value="mensal">Meu Exame Mensal - 299 MZN</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Método Usado</label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-[13px] font-bold text-gray-700 appearance-none cursor-pointer"
                      onChange={(e) => setFormData({...formData, metodo: e.target.value})}
                    >
                      <option value="">Selecione o método...</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="emola">e-Mola</option>
                      <option value="mkesh">mKesh</option>
                      <option value="transferencia">Transferência Bancária</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Código de Referência</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text"
                      placeholder="Ex: MP-88273645"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-[13px] font-medium"
                      onChange={(e) => setFormData({...formData, referencia: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Data do Depósito</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date"
                      value={formData.data}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-[13px] font-medium"
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Aviso de Confirmação */}
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex gap-3">
              <CheckCircle2 className="text-[#10A63D] shrink-0" size={20} />
              <p className="text-[11px] text-green-700 leading-relaxed font-medium">
                Ao salvar, o sistema irá validar a referência e ativar automaticamente o plano para o utilizador selecionado. Certifique-se de que o valor foi recebido no gateway correspondente.
              </p>
            </div>

          </form>
          
          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}