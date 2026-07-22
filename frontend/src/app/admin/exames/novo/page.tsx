'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  FileQuestion,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Copy,
  Check,
  X,
  AlertTriangle,
  Building2,
  BookOpen,
  Search,
  Filter,
  MoreVertical,
  Send,
  DollarSign,
} from 'lucide-react';

// ============================================
// TIPOS
// ============================================

type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface Institution {
  id: string;
  name: string;
  city: string;
  subjects: Subject[];
}

interface Subject {
  id: string;
  name: string;
  institutionId: string;
  institution?: Institution;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

interface Exam {
  id?: string;
  title: string;
  description: string;
  institutionId: string;
  subjectId: string;
  duration: number;
  price: number;
  status: ExamStatus;
  year: number;
  questions: Question[];
  settings: {
    randomizeQuestions: boolean;
    showResults: boolean;
    allowReview: boolean;
    maxAttempts: number;
    passingScore: number;
  };
}

// ============================================
// DADOS DE EXEMPLO
// ============================================

const mockInstitutions: Institution[] = [
  {
    id: 'inst-1',
    name: 'Universidade Eduardo Mondlane',
    city: 'Maputo',
    subjects: [
      { id: 'sub-1', name: 'Matemática', institutionId: 'inst-1' },
      { id: 'sub-2', name: 'Física', institutionId: 'inst-1' },
      { id: 'sub-3', name: 'Química', institutionId: 'inst-1' },
      { id: 'sub-4', name: 'Biologia', institutionId: 'inst-1' },
    ],
  },
  {
    id: 'inst-2',
    name: 'Universidade Católica de Moçambique',
    city: 'Beira',
    subjects: [
      { id: 'sub-5', name: 'Contabilidade', institutionId: 'inst-2' },
      { id: 'sub-6', name: 'Gestão', institutionId: 'inst-2' },
      { id: 'sub-7', name: 'Economia', institutionId: 'inst-2' },
    ],
  },
  {
    id: 'inst-3',
    name: 'Instituto Superior de Transportes',
    city: 'Maputo',
    subjects: [
      { id: 'sub-8', name: 'Matemática', institutionId: 'inst-3' },
      { id: 'sub-9', name: 'Física', institutionId: 'inst-3' },
    ],
  },
  {
    id: 'inst-4',
    name: 'Instituto Superior Politécno de Gaza',
    city: 'Xai-Xai',
    subjects: [
      { id: 'sub-10', name: 'Matemática', institutionId: 'inst-4' },
      { id: 'sub-11', name: 'Português', institutionId: 'inst-4' },
    ],
  },
];

// ============================================
// COMPONENTES
// ============================================

function QuestionTypeBadge({ type }: { type: QuestionType }) {
  const styles: Record<QuestionType, { bg: string; text: string; label: string }> = {
    MULTIPLE_CHOICE: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Múltipla Escolha' },
    TRUE_FALSE: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'V/F' },
    SHORT_ANSWER: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Resposta Curta' },
  };
  const s = styles[type];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function StatusBadge({ status }: { status: ExamStatus }) {
  const styles: Record<ExamStatus, { bg: string; text: string; label: string }> = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Rascunho' },
    PUBLISHED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Publicado' },
    ARCHIVED: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Arquivado' },
  };
  const s = styles[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-green-600' : 'bg-gray-200'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ExamEditorPage() {
  const [step, setStep] = useState<'institution' | 'subject' | 'details' | 'questions'>('institution');
  const [institutions] = useState<Institution[]>(mockInstitutions);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [exam, setExam] = useState<Exam>({
    title: '',
    description: '',
    institutionId: '',
    subjectId: '',
    duration: 60,
    price: 0,
    status: 'DRAFT',
    year: new Date().getFullYear(),
    questions: [
      {
        id: 'q-1',
        type: 'MULTIPLE_CHOICE',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 10,
        explanation: '',
      },
    ],
    settings: {
      randomizeQuestions: false,
      showResults: true,
      allowReview: true,
      maxAttempts: 3,
      passingScore: 70,
    },
  });

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Atualizar quando instituição for selecionada
  useEffect(() => {
    if (selectedInstitution) {
      setExam({ ...exam, institutionId: selectedInstitution.id });
    }
  }, [selectedInstitution]);

  // Atualizar quando disciplina for selecionada
  useEffect(() => {
    if (selectedSubject) {
      setExam({ ...exam, subjectId: selectedSubject.id });
    }
  }, [selectedSubject]);

  // Computar passo atual
  const currentStep = step;

  // Selecionar instituição
  const handleSelectInstitution = (institution: Institution) => {
    setSelectedInstitution(institution);
    setSelectedSubject(null);
    setExam({ ...exam, institutionId: institution.id, subjectId: '' });
    setStep('subject');
  };

  // Selecionar disciplina
  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setExam({ ...exam, subjectId: subject.id });
    setStep('details');
  };

  // Adicionar questão
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'MULTIPLE_CHOICE',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
      explanation: '',
    };
    setExam({ ...exam, questions: [...exam.questions, newQuestion] });
    setActiveQuestionIndex(exam.questions.length);
    setHasUnsavedChanges(true);
  };

  // Atualizar questão
  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...exam.questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setExam({ ...exam, questions: newQuestions });
    setHasUnsavedChanges(true);
  };

  // Eliminar questão
  const deleteQuestion = (index: number) => {
    if (exam.questions.length === 1) return;
    const newQuestions = exam.questions.filter((_, i) => i !== index);
    setExam({ ...exam, questions: newQuestions });
    if (activeQuestionIndex >= newQuestions.length) {
      setActiveQuestionIndex(newQuestions.length - 1);
    }
    setHasUnsavedChanges(true);
  };

  // Duplicar questão
  const duplicateQuestion = (index: number) => {
    const question = { ...exam.questions[index], id: `q-${Date.now()}` };
    const newQuestions = [...exam.questions];
    newQuestions.splice(index + 1, 0, question);
    setExam({ ...exam, questions: newQuestions });
    setActiveQuestionIndex(index + 1);
    setHasUnsavedChanges(true);
  };

  // Mover questão
  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === exam.questions.length - 1)
    ) return;
    const newQuestions = [...exam.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setExam({ ...exam, questions: newQuestions });
    setActiveQuestionIndex(targetIndex);
    setHasUnsavedChanges(true);
  };

  const currentQuestion = exam.questions[activeQuestionIndex];

  // Salvar exame
  const handleSave = () => {
    console.log('Salvando exame:', exam);
    alert('Exame guardado com sucesso!');
    setHasUnsavedChanges(false);
  };

  // Publicar exame
  const handlePublish = () => {
    setExam({ ...exam, status: 'PUBLISHED' });
    handleSave();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/exames" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-gray-900">Criar Novo Exame</h1>
                  {hasUnsavedChanges && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      <AlertTriangle size={12} />
                      Não guardado
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedInstitution?.name || 'Selecione instituição'} 
                  {selectedSubject && ` → ${selectedSubject.name}`}
                  {exam.title && ` → ${exam.title}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {step === 'questions' && (
                <>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${
                      showSettings
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings size={16} />
                    Configurações
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <Eye size={16} />
                    Pré-visualizar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                  <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <Send size={16} />
                    Publicar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { key: 'institution', label: 'Instituição', icon: Building2 },
              { key: 'subject', label: 'Disciplina', icon: BookOpen },
              { key: 'details', label: 'Detalhes', icon: FileQuestion },
              { key: 'questions', label: 'Questões', icon: FileQuestion },
            ].map((s, index) => {
              const stepIndex = ['institution', 'subject', 'details', 'questions'].indexOf(step);
              const isActive = s.key === step;
              const isCompleted = index < stepIndex;
              const Icon = s.icon;
              
              return (
                <div key={s.key} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-700' :
                    isCompleted ? 'bg-green-50 text-green-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Check size={14} />
                    ) : (
                      <Icon size={14} />
                    )}
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  {index < 3 && (
                    <ChevronRight size={16} className="text-gray-300 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Lista de Questões (só aparece no passo de questões) */}
        {step === 'questions' && (
          <aside className="w-80 bg-white border-r border-gray-200 min-h-[calc(100vh-160px)] sticky top-[160px]">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Questões ({exam.questions.length})
              </h2>
              <button
                onClick={addQuestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
              >
                <Plus size={16} />
                Adicionar Questão
              </button>
            </div>
            
            <div className="p-2 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
              {exam.questions.map((q, index) => (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionIndex(index)}
                  className={`p-3 rounded-xl cursor-pointer transition-all group ${
                    activeQuestionIndex === index
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-gray-400 cursor-grab">
                      <GripVertical size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        <QuestionTypeBadge type={q.type} />
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {q.text || 'Pergunta não definida'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{q.points} pts</span>
                        {q.type === 'MULTIPLE_CHOICE' && (
                          <span>{q.options.filter(o => o).length} opções</span>
                        )}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); duplicateQuestion(index); }} className="p-1 hover:bg-gray-200 rounded">
                        <Copy size={12} className="text-gray-500" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteQuestion(index); }} className="p-1 hover:bg-red-100 rounded">
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumo */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Total Pontos</p>
                  <p className="font-bold text-gray-900">
                    {exam.questions.reduce((sum, q) => sum + q.points, 0)} pts
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Questões</p>
                  <p className="font-bold text-gray-900">{exam.questions.length}</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 ${step === 'questions' ? '' : 'max-w-4xl mx-auto'}`}>
          {/* STEP 1: Selecionar Instituição */}
          {step === 'institution' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Selecionar Instituição</h2>
                <p className="text-gray-500 mb-6">Escolha a instituição para qual o exame será criado</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {institutions.map((institution) => (
                    <button
                      key={institution.id}
                      onClick={() => handleSelectInstitution(institution)}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                          {institution.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                            {institution.name}
                          </h3>
                          <p className="text-sm text-gray-500">{institution.city}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {institution.subjects.length} disciplinas disponíveis
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Selecionar Disciplina */}
          {step === 'subject' && selectedInstitution && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => setStep('institution')} className="text-sm text-gray-500 hover:text-gray-700">
                    {selectedInstitution.name}
                  </button>
                  <ChevronRight size={14} className="text-gray-400" />
                  <span className="text-sm text-green-600 font-medium">Selecionar Disciplina</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Disciplinas de {selectedInstitution.name}
                </h2>
                <p className="text-gray-500 mb-6">Selecione a disciplina para este exame</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedInstitution.subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => handleSelectSubject(subject)}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <BookOpen size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                            {subject.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {selectedInstitution.name}
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Detalhes do Exame */}
          {step === 'details' && selectedSubject && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <button onClick={() => setStep('institution')} className="text-gray-500 hover:text-gray-700">
                    {selectedInstitution?.name}
                  </button>
                  <ChevronRight size={14} className="text-gray-400" />
                  <button onClick={() => setStep('subject')} className="text-gray-500 hover:text-gray-700">
                    {selectedSubject.name}
                  </button>
                  <ChevronRight size={14} className="text-gray-400" />
                  <span className="text-green-600 font-medium">Detalhes</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhes do Exame</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Exame *</label>
                    <input
                      type="text"
                      value={exam.title}
                      onChange={(e) => { setExam({ ...exam, title: e.target.value }); setHasUnsavedChanges(true); }}
                      placeholder="Ex: Matemática UEM 2024 - 1ª Época"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      value={exam.description}
                      onChange={(e) => { setExam({ ...exam, description: e.target.value }); setHasUnsavedChanges(true); }}
                      placeholder="Descreva o conteúdo do exame..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos) *</label>
                    <input
                      type="number"
                      value={exam.duration}
                      onChange={(e) => { setExam({ ...exam, duration: parseInt(e.target.value) || 60 }); setHasUnsavedChanges(true); }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                    <input
                      type="number"
                      value={exam.year}
                      onChange={(e) => { setExam({ ...exam, year: parseInt(e.target.value) || new Date().getFullYear() }); setHasUnsavedChanges(true); }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (MZN)</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={exam.price}
                        onChange={(e) => { setExam({ ...exam, price: parseFloat(e.target.value) || 0 }); setHasUnsavedChanges(true); }}
                        placeholder="0 para gratuito"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={exam.status}
                      onChange={(e) => { setExam({ ...exam, status: e.target.value as ExamStatus }); setHasUnsavedChanges(true); }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="DRAFT">Rascunho</option>
                      <option value="PUBLISHED">Publicado</option>
                      <option value="ARCHIVED">Arquivado</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setStep('questions')}
                    disabled={!exam.title}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Continuar para Questões
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Editor de Questões */}
          {step === 'questions' && currentQuestion && (
            <div className="space-y-6">
              {/* Editor de Questão */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Questão {activeQuestionIndex + 1}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveQuestion(activeQuestionIndex, 'up')}
                      disabled={activeQuestionIndex === 0}
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      <ChevronUp size={18} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => moveQuestion(activeQuestionIndex, 'down')}
                      disabled={activeQuestionIndex === exam.questions.length - 1}
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      <ChevronDown size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Tipo de Questão */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Questão</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'MULTIPLE_CHOICE', label: 'Múltipla Escolha' },
                      { value: 'TRUE_FALSE', label: 'Verdadeiro/Falso' },
                      { value: 'SHORT_ANSWER', label: 'Resposta Curta' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => updateQuestion(activeQuestionIndex, { type: type.value as QuestionType })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          currentQuestion.type === type.value
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pergunta */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta *</label>
                  <textarea
                    value={currentQuestion.text}
                    onChange={(e) => updateQuestion(activeQuestionIndex, { text: e.target.value })}
                    placeholder="Digite a pergunta aqui..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                {/* Opções (para múltipla escolha) */}
                {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opções de Resposta</label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuestion(activeQuestionIndex, { correctAnswer: index })}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              currentQuestion.correctAnswer === index
                                ? 'bg-green-600 border-green-600'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {currentQuestion.correctAnswer === index && (
                              <Check size={14} className="text-white" />
                            )}
                          </button>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options];
                              newOptions[index] = e.target.value;
                              updateQuestion(activeQuestionIndex, { options: newOptions });
                            }}
                            placeholder={`Opção ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {currentQuestion.options.length > 2 && (
                            <button
                              onClick={() => {
                                const newOptions = currentQuestion.options.filter((_, i) => i !== index);
                                updateQuestion(activeQuestionIndex, { 
                                  options: newOptions,
                                  correctAnswer: index < currentQuestion.correctAnswer 
                                    ? currentQuestion.correctAnswer - 1 
                                    : currentQuestion.correctAnswer
                                });
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg"
                            >
                              <X size={16} className="text-gray-400" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {currentQuestion.options.length < 6 && (
                      <button
                        onClick={() => {
                          const newOptions = [...currentQuestion.options, ''];
                          updateQuestion(activeQuestionIndex, { options: newOptions });
                        }}
                        className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Plus size={14} />
                        Adicionar Opção
                      </button>
                    )}
                  </div>
                )}

                {/* True/False */}
                {currentQuestion.type === 'TRUE_FALSE' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resposta Correta</label>
                    <div className="flex gap-4">
                      {['Verdadeiro', 'Falso'].map((option, index) => (
                        <button
                          key={option}
                          onClick={() => updateQuestion(activeQuestionIndex, { correctAnswer: index })}
                          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                            currentQuestion.correctAnswer === index
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pontos e Explicação */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pontos</label>
                    <input
                      type="number"
                      value={currentQuestion.points}
                      onChange={(e) => updateQuestion(activeQuestionIndex, { points: parseInt(e.target.value) || 1 })}
                      min={1}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explicação (opcional)</label>
                    <input
                      type="text"
                      value={currentQuestion.explanation || ''}
                      onChange={(e) => updateQuestion(activeQuestionIndex, { explanation: e.target.value })}
                      placeholder="Explicação da resposta..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navegação de Questões */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => deleteQuestion(activeQuestionIndex)}
                  disabled={exam.questions.length === 1}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Eliminar Questão
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                    disabled={activeQuestionIndex === 0}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    {activeQuestionIndex + 1} / {exam.questions.length}
                  </span>
                  <button
                    onClick={() => setActiveQuestionIndex(Math.min(exam.questions.length - 1, activeQuestionIndex + 1))}
                    disabled={activeQuestionIndex === exam.questions.length - 1}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Settings Panel */}
        {showSettings && step === 'questions' && (
          <aside className="w-80 bg-white border-l border-gray-200 min-h-[calc(100vh-160px)] sticky top-[160px] p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações do Exame</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Aleatorizar Questões</p>
                  <p className="text-xs text-gray-500">Misturar ordem</p>
                </div>
                <Toggle
                  enabled={exam.settings.randomizeQuestions}
                  onChange={(v) => setExam({ ...exam, settings: { ...exam.settings, randomizeQuestions: v } })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Mostrar Resultados</p>
                  <p className="text-xs text-gray-500">Exibir nota após teste</p>
                </div>
                <Toggle
                  enabled={exam.settings.showResults}
                  onChange={(v) => setExam({ ...exam, settings: { ...exam.settings, showResults: v } })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Permitir Revisão</p>
                  <p className="text-xs text-gray-500">Revisar após teste</p>
                </div>
                <Toggle
                  enabled={exam.settings.allowReview}
                  onChange={(v) => setExam({ ...exam, settings: { ...exam.settings, allowReview: v } })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Tentativas</label>
                <input
                  type="number"
                  value={exam.settings.maxAttempts}
                  onChange={(e) => setExam({ ...exam, settings: { ...exam.settings, maxAttempts: parseInt(e.target.value) || 1 } })}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota de Passagem (%)</label>
                <input
                  type="number"
                  value={exam.settings.passingScore}
                  onChange={(e) => setExam({ ...exam, settings: { ...exam.settings, passingScore: parseInt(e.target.value) || 70 } })}
                  min={0}
                  max={100}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
