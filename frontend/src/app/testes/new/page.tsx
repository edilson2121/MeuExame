'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ChevronRight, Edit3, Eye, Save, FileCheck, 
  Building2, Clock, HelpCircle, UploadCloud, AlertCircle, 
  Trash2, Plus 
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

interface Option { id: string; text: string; }
interface Question {
  id: string;
  text: string;
  imagePreview: string;
  options: Option[];
  correctOptionIndex: number;
}

export default function NewTestPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Estados do Teste (Sem Capa)
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [duration, setDuration] = useState('90');
  const [questions, setQuestions] = useState<Question[]>([
    { 
      id: '1', text: '', imagePreview: '', 
      options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }], 
      correctOptionIndex: 0 
    }
  ]);

  const qImageRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleQuestionImage = (e: React.ChangeEvent<HTMLInputElement>, qIdx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = [...questions];
      updated[qIdx].imagePreview = URL.createObjectURL(file);
      setQuestions(updated);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now().toString(),
      text: '', imagePreview: '',
      options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }],
      correctOptionIndex: 0
    }]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!title || !institution) return alert('Título e Instituição são obrigatórios!');
    alert('✅ Simulado prático guardado com sucesso!');
    router.push('/testes');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col md:flex-row relative text-sm font-normal">
      <Sidebar 
        user={{ name: 'Administrador', email: 'admin@meuexame.com', role: 'admin' }} 
        isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} 
        handleLogout={() => router.push('/login')} 
      />

      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/testes')} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400"><ArrowLeft size={20} /></button>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900">Configurar Teste</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
            <button onClick={() => setActiveTab('edit')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${activeTab === 'edit' ? 'bg-white text-[#10A63D] shadow-xs' : 'text-gray-500'}`}><Edit3 size={13} className="inline mr-1"/> Editar</button>
            <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${activeTab === 'preview' ? 'bg-white text-[#10A63D] shadow-xs' : 'text-gray-500'}`}><Eye size={13} className="inline mr-1"/> Preview</button>
          </div>
          <button onClick={handleSave} className="px-4 py-2 bg-[#10A63D] text-white font-bold text-xs uppercase rounded-lg hover:bg-[#0e9135] transition-all"><Save size={14} className="inline mr-1"/> Publicar</button>
        </header>

        <main className="p-4 md:p-6 max-w-4xl mx-auto w-full space-y-5">
          {activeTab === 'edit' ? (
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-sm"><FileCheck size={16} className="text-[#10A63D]"/> Definições do Simulado</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Nome do Teste</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Simulado Geral Matemática" className="w-full px-4 py-2 bg-gray-50 border-transparent focus:border-green-200 focus:bg-white rounded-xl outline-none text-sm font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Tempo (Min)</label>
                    <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Instituição</label>
                  <select value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full px-4 py-2 bg-gray-50 rounded-xl outline-none text-sm cursor-pointer">
                    <option value="">Selecione...</option>
                    <option value="uem">UEM</option>
                    <option value="ispt">ISPT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="px-5 py-2.5 bg-gray-50 flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase border-b border-gray-100">
                      <span>Questão {idx + 1}</span>
                      <button onClick={() => removeQuestion(idx)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <textarea rows={3} value={q.text} onChange={(e) => { const n = [...questions]; n[idx].text = e.target.value; setQuestions(n); }} placeholder="Enunciado da questão..." className="flex-1 p-4 bg-gray-50 rounded-xl outline-none text-sm resize-none" />
                        <div className="w-full lg:w-40">
                          <input type="file" className="hidden" ref={el => { qImageRefs.current[q.id] = el; }} onChange={(e) => handleQuestionImage(e, idx)} />
                          <div onClick={() => qImageRefs.current[q.id]?.click()} className="h-24 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer bg-gray-50">
                            {q.imagePreview ? <img src={q.imagePreview} className="h-full w-full object-cover rounded-lg" /> : <><UploadCloud size={20}/><span className="text-[9px] mt-1">IMAGEM</span></>}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={opt.id} className={`flex items-center gap-3 p-1.5 pr-4 border rounded-xl ${q.correctOptionIndex === oIdx ? 'border-[#10A63D] bg-green-50/20' : 'border-gray-100 bg-gray-50/50'}`}>
                            <button onClick={() => { const n = [...questions]; n[idx].correctOptionIndex = oIdx; setQuestions(n); }} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${q.correctOptionIndex === oIdx ? 'bg-[#10A63D] text-white' : 'bg-white text-gray-400'}`}>
                              {String.fromCharCode(65 + oIdx)}
                            </button>
                            <input type="text" value={opt.text} onChange={(e) => { const n = [...questions]; n[idx].options[oIdx].text = e.target.value; setQuestions(n); }} placeholder="Alternativa..." className="flex-1 bg-transparent outline-none text-sm font-semibold" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-[#10A63D] font-bold text-xs uppercase tracking-widest">+ Adicionar Questão</button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
              <div className="text-center border-b border-gray-100 pb-6 space-y-3">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{title || 'Título do Teste'}</h2>
                <div className="flex justify-center gap-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Building2 size={14}/> {institution || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {duration} MIN</span>
                </div>
              </div>
              <div className="space-y-12">
                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-4">
                    <p className="text-xs font-black text-[#10A63D] uppercase tracking-widest">Questão {idx + 1}</p>
                    <p className="text-base font-medium text-gray-800 leading-relaxed">{q.text || 'O enunciado aparecerá aqui...'}</p>
                    {q.imagePreview && <img src={q.imagePreview} className="max-w-md rounded-xl border border-gray-100" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}