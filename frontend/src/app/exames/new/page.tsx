'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Plus, Image as ImageIcon, Trash2, Save, 
  ArrowLeft, CheckCircle2, Building2, Eye, Edit3, 
  AlertCircle, Clock, ChevronRight, UploadCloud
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

interface Option { id: string; text: string; }
interface Question {
  id: string;
  text: string;
  imagePreview: string; // Guarda a URL local da imagem carregada
  options: Option[];
  correctOptionIndex: number;
}

export default function NewExamPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // Estados do Exame
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [questions, setQuestions] = useState<Question[]>([
    { 
      id: '1', text: '', imagePreview: '', 
      options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }], 
      correctOptionIndex: 0 
    }
  ]);

  // Referências para os inputs de arquivos ocultos
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // --- Funções de Upload de Imagem ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, qIdx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Cria um link temporário da imagem
      const updatedQuestions = [...questions];
      updatedQuestions[qIdx].imagePreview = imageUrl;
      setQuestions(updatedQuestions);
    }
  };

  const removeImage = (qIdx: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIdx].imagePreview = '';
    setQuestions(updatedQuestions);
  };

  // --- Lógica do Construtor ---
  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now().toString(),
      text: '', imagePreview: '',
      options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }],
      correctOptionIndex: 0
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title || !institution) {
      alert('⚠️ Erro: O Título e a Instituição são de preenchimento obrigatório.');
      return;
    }
    console.log("Enviando Exame:", { title, institution, status, questions });
    alert('✅ Exame gravado com sucesso no banco de dados!');
    router.push('/exames');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col md:flex-row relative text-sm font-normal">
      <Sidebar />

      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        
        {/* HEADER DE ACÇÕES */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/exames')} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-all">
              <ArrowLeft size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900 tracking-tight">Novo Exame</h1>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                <span>Painel</span>
                <ChevronRight size={10} />
                <span className="text-[#10A63D]">{activeTab === 'edit' ? 'Edição' : 'Preview Técnico'}</span>
              </div>
            </div>
          </div>

          {/* ABAS INTUITIVAS */}
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'edit' ? 'bg-white text-[#10A63D] shadow-xs' : 'text-gray-500 hover:text-black'}`}
            >
              <Edit3 size={13} /> Construtor
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'preview' ? 'bg-white text-[#10A63D] shadow-xs' : 'text-gray-500 hover:text-black'}`}
            >
              <Eye size={13} /> Pré-visualizar
            </button>
          </div>

          <button 
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#10A63D] hover:bg-[#0e9135] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
          >
            <Save size={14} /> Gravar Tudo
          </button>
        </header>

        <main className="p-4 md:p-6 max-w-4xl mx-auto w-full space-y-5">
          
          {/* ABA CONSTRUTOR */}
          {activeTab === 'edit' && (
            <div className="space-y-5">
              
              {/* CONFIGURAÇÃO DA PROVA */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-50 text-[#10A63D] rounded-md"><FileText size={16} /></div>
                  <h2 className="font-bold text-gray-800 text-sm">Definições Principais</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Título do Exame (Fonte 14)</label>
                    <input 
                      type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Exame de Admissão de Matemática - 2026"
                      className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-sm font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Instituição de Ensino</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <select 
                        value={institution} onChange={(e) => setInstitution(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-sm font-medium appearance-none cursor-pointer transition-all"
                      >
                        <option value="">Selecione...</option>
                        <option value="inst-1">Universidade Eduardo Mondlane (UEM)</option>
                        <option value="inst-2">Instituto Superior Politécnico (ISPT)</option>
                        <option value="inst-3">Escola de Marketing e Negócios (EMN)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-3 border-t border-gray-50 text-xs">
                   <span className="font-bold text-gray-400 uppercase self-center mr-2">Status:</span>
                   <button type="button" onClick={() => setStatus('draft')} className={`px-3 py-1.5 rounded-lg font-bold uppercase border transition-all ${status === 'draft' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white text-gray-300 border-gray-100'}`}>Rascunho</button>
                   <button type="button" onClick={() => setStatus('published')} className={`px-3 py-1.5 rounded-lg font-bold uppercase border transition-all ${status === 'published' ? 'bg-green-50 border-green-200 text-[#10A63D]' : 'bg-white text-gray-300 border-gray-100'}`}>Publicar Direto</button>
                </div>
              </div>

              {/* QUESTÕES */}
              <div className="space-y-4">
                {questions.map((q, qIdx) => (
                  <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="px-5 py-2.5 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#10A63D] shadow-xs">{qIdx + 1}</span>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Enunciado & Respostas</span>
                      </div>
                      <button onClick={() => removeQuestion(qIdx)} className="p-1 text-gray-300 hover:text-red-500 rounded-md transition-all"><Trash2 size={16} /></button>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Enunciado */}
                        <div className="flex-1 space-y-1">
                           <label className="text-[11px] font-bold text-gray-400 uppercase">Escreva o Enunciado da Pergunta (Fonte 14)</label>
                           <textarea 
                             rows={3} value={q.text} onChange={(e) => { const n = [...questions]; n[qIdx].text = e.target.value; setQuestions(n); }}
                             placeholder="Ex: Determine o conjunto solução para a seguinte inequação..."
                             className="w-full px-4 py-2 bg-gray-50 rounded-xl outline-none text-sm font-medium focus:bg-white border border-transparent focus:border-green-100 transition-all resize-none"
                           />
                        </div>
                        
                        {/* Mídia Dinâmica */}
                        <div className="w-full lg:w-48 space-y-1">
                           <label className="text-[11px] font-bold text-gray-400 uppercase">Imagem da Questão</label>
                           <input 
                             type="file" 
                             accept="image/*"
                             className="hidden" 
                             ref={el => { fileInputRefs.current[q.id] = el; }}
                             onChange={(e) => handleImageUpload(e, qIdx)}
                           />
                           
                           {q.imagePreview ? (
                             <div className="relative h-20 border border-gray-100 rounded-xl overflow-hidden group">
                               <img src={q.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                               <button 
                                 type="button"
                                 onClick={() => removeImage(qIdx)}
                                 className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 Remover
                               </button>
                             </div>
                           ) : (
                             <div 
                               onClick={() => fileInputRefs.current[q.id]?.click()}
                               className="h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-[#10A63D] hover:border-[#10A63D] hover:bg-green-50 transition-all cursor-pointer"
                             >
                               <UploadCloud size={20} />
                               <span className="text-[10px] font-bold uppercase mt-1">Carregar</span>
                             </div>
                           )}
                        </div>
                      </div>

                      {/* Opções de Resposta Alternativas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={opt.id} className={`flex items-center gap-3 p-1.5 pr-4 border rounded-xl transition-all ${q.correctOptionIndex === oIdx ? 'border-[#10A63D] bg-green-50/20' : 'border-gray-100 bg-gray-50/50'}`}>
                            <button
                              type="button"
                              onClick={() => { const n = [...questions]; n[qIdx].correctOptionIndex = oIdx; setQuestions(n); }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${q.correctOptionIndex === oIdx ? 'bg-[#10A63D] text-white' : 'bg-white text-gray-400 shadow-xs'}`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </button>
                            <input 
                              type="text" value={opt.text} onChange={(e) => { const n = [...questions]; n[qIdx].options[oIdx].text = e.target.value; setQuestions(n); }}
                              placeholder={`Alternativa ${String.fromCharCode(65 + oIdx)}`}
                              className="flex-1 bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder-gray-300"
                            />
                            {q.correctOptionIndex === oIdx && <CheckCircle2 size={16} className="text-[#10A63D]" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addQuestion}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-[#10A63D] hover:border-[#10A63D] transition-all font-bold text-xs uppercase tracking-wider"
              >
                <Plus size={16} /> Adicionar Questão
              </button>
            </div>
          )}

          {/* ABA PREVIEW (FONTE INTERMEDIÁRIA 16PX) */}
          {activeTab === 'preview' && (
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-8 transition-all border border-gray-100">
               <div className="max-w-2xl mx-auto space-y-8">
                  
                  <div className="text-center space-y-2 border-b border-gray-100 pb-5">
                     <h2 className="text-base font-bold text-gray-900 leading-tight md:text-lg">{title || 'Título do Exame não configurado'}</h2>
                     <div className="flex items-center justify-center gap-4 text-xs text-gray-400 font-semibold">
                        <span className="flex items-center gap-1"><Building2 size={14} /> {institution ? institution.toUpperCase() : 'NENHUMA'}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> 120 MINUTOS</span>
                     </div>
                  </div>

                  <div className="space-y-10">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="space-y-4">
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-[#10A63D] uppercase tracking-wider">Questão {idx + 1}</span>
                          {/* Fonte 16px para leitura nítida do enunciado no preview */}
                          <p className="text-base font-medium text-gray-800 leading-relaxed">{q.text || 'O enunciado desta pergunta ainda está em branco...'}</p>
                        </div>

                        {/* Imagem Carregada Exibida no Preview */}
                        {q.imagePreview && (
                          <div className="max-w-md border border-gray-100 rounded-xl overflow-hidden shadow-xs bg-gray-50">
                            <img src={q.imagePreview} alt={`Ilustração Questão ${idx + 1}`} className="w-full max-h-64 object-contain" />
                          </div>
                        )}

                        {/* Alternativas organizadas */}
                        <div className="space-y-2">
                           {q.options.map((opt, oIdx) => (
                             <div key={opt.id} className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${q.correctOptionIndex === oIdx ? 'border-[#10A63D] bg-green-50/20' : 'border-gray-100'}`}>
                                <span className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${q.correctOptionIndex === oIdx ? 'bg-[#10A63D] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className={`text-sm font-semibold ${q.correctOptionIndex === oIdx ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {opt.text || `Alternativa vazia...`}
                                </span>
                             </div>
                           ))}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-bold text-green-600 bg-green-50 w-fit px-2.5 py-1 rounded-md border border-green-100">
                           <AlertCircle size={12} /> 
                           <span>Resposta correta salva no gabarito oficial do sistema.</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex justify-center border-t border-gray-50">
                    <button onClick={() => setActiveTab('edit')} className="flex items-center gap-1.5 text-gray-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-all">
                      <Edit3 size={14} /> Voltar ao Construtor
                    </button>
                  </div>
               </div>
            </div>
          )}

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}