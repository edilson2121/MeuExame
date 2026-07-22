'use client';

import { useState } from 'react';
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
  Copy,
  MoreVertical,
  Check,
  X,
  Image,
  AlertTriangle,
} from 'lucide-react';

// Tipos de questão
type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

interface ExamData {
  title: string;
  description: string;
  institution: string;
  course: string;
  subject: string;
  duration: number;
  price: number;
  passingScore: number;
  questions: Question[];
  settings: {
    randomizeQuestions: boolean;
    showResults: boolean;
    allowReview: boolean;
    maxAttempts: number;
  };
}

const institutions = ['UEM', 'UCM', 'UniLúrio', 'ISUTC', 'ISPG'];
const courses = ['Engenharia', 'Medicina', 'Direito', 'Economia', 'Ciências'];
const subjects = ['Matemática', 'Física', 'Química', 'Biologia', 'Português'];

export default function ExamEditorPage() {
  const [exam, setExam] = useState<ExamData>({
    title: '',
    description: '',
    institution: '',
    course: '',
    subject: '',
    duration: 60,
    price: 299,
    passingScore: 70,
    questions: [
      {
        id: '1',
        type: 'multiple_choice',
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
    },
  });

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
      explanation: '',
    };
    setExam({ ...exam, questions: [...exam.questions, newQuestion] });
    setActiveQuestion(exam.questions.length);
    setHasUnsavedChanges(true);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...exam.questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setExam({ ...exam, questions: newQuestions });
    setHasUnsavedChanges(true);
  };

  const deleteQuestion = (index: number) => {
    if (exam.questions.length === 1) return;
    const newQuestions = exam.questions.filter((_, i) => i !== index);
    setExam({ ...exam, questions: newQuestions });
    if (activeQuestion >= newQuestions.length) {
      setActiveQuestion(newQuestions.length - 1);
    }
    setHasUnsavedChanges(true);
  };

  const duplicateQuestion = (index: number) => {
    const question = exam.questions[index];
    const newQuestion = { ...question, id: Date.now().toString() };
    const newQuestions = [...exam.questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setExam({ ...exam, questions: newQuestions });
    setActiveQuestion(index + 1);
    setHasUnsavedChanges(true);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === exam.questions.length - 1)
    ) {
      return;
    }
    const newQuestions = [...exam.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setExam({ ...exam, questions: newQuestions });
    setActiveQuestion(targetIndex);
    setHasUnsavedChanges(true);
  };

  const currentQuestion = exam.questions[activeQuestion];

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
                  {exam.title || 'Sem título'} • {exam.questions.length} questões
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                <Save size={16} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Lista de Questões */}
        <aside className="w-80 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Questões</h2>
            <button
              onClick={addQuestion}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
            >
              <Plus size={16} />
              Adicionar Questão
            </button>
          </div>
          
          <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {exam.questions.map((q, index) => (
              <div
                key={q.id}
                onClick={() => setActiveQuestion(index)}
                className={`p-3 rounded-xl cursor-pointer transition-all group ${
                  activeQuestion === index
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
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        q.type === 'multiple_choice' ? 'bg-blue-100 text-blue-700' :
                        q.type === 'true_false' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {q.type === 'multiple_choice' ? 'Múltipla escolha' :
                         q.type === 'true_false' ? 'V/F' : 'Resposta curta'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {q.text || 'Pergunta não definida'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileQuestion size={12} />
                        {q.points} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Check size={12} />
                        {q.options.filter(o => o).length} opções
                      </span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateQuestion(index); }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy size={12} className="text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteQuestion(index); }}
                      className="p-1 hover:bg-red-100 rounded"
                    >
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentQuestion ? (
            <div className="max-w-3xl mx-auto">
              {/* Informações do Exame */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informações do Exame</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Exame</label>
                    <input
                      type="text"
                      value={exam.title}
                      onChange={(e) => { setExam({ ...exam, title: e.target.value }); setHasUnsavedChanges(true); }}
                      placeholder="Ex: Matemática UEM 2024"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instituição</label>
                    <select
                      value={exam.institution}
                      onChange={(e) => { setExam({ ...exam, institution: e.target.value }); setHasUnsavedChanges(true); }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecionar...</option>
                      {institutions.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                    <select
                      value={exam.subject}
                      onChange={(e) => { setExam({ ...exam, subject: e.target.value }); setHasUnsavedChanges(true); }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecionar...</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
                    <input
                      type="number"
                      value={exam.duration}
                      onChange={(e) => { setExam({ ...exam, duration: parseInt(e.target.value) || 60 }); setHasUnsavedChanges(true); }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (MZN)</label>
                    <input
                      type="number"
                      value={exam.price}
                      onChange={(e) => { setExam({ ...exam, price: parseInt(e.target.value) || 0 }); setHasUnsavedChanges(true); }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Editor de Questão */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Questão {activeQuestion + 1}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveQuestion(activeQuestion, 'up')}
                      disabled={activeQuestion === 0}
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      <ChevronUp size={18} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => moveQuestion(activeQuestion, 'down')}
                      disabled={activeQuestion === exam.questions.length - 1}
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
                      { value: 'multiple_choice', label: 'Múltipla Escolha' },
                      { value: 'true_false', label: 'Verdadeiro/Falso' },
                      { value: 'short_answer', label: 'Resposta Curta' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => updateQuestion(activeQuestion, { type: type.value as QuestionType })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
                  <textarea
                    value={currentQuestion.text}
                    onChange={(e) => updateQuestion(activeQuestion, { text: e.target.value })}
                    placeholder="Digite a pergunta aqui..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                {/* Opções (para múltipla escolha) */}
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opções de Resposta</label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuestion(activeQuestion, { correctAnswer: index })}
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
                              updateQuestion(activeQuestion, { options: newOptions });
                            }}
                            placeholder={`Opção ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <button className="p-2 hover:bg-red-50 rounded-lg">
                            <X size={16} className="text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const newOptions = [...currentQuestion.options, ''];
                        updateQuestion(activeQuestion, { options: newOptions });
                      }}
                      disabled={currentQuestion.options.length >= 6}
                      className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                    >
                      <Plus size={14} />
                      Adicionar Opção
                    </button>
                  </div>
                )}

                {/* True/False */}
                {currentQuestion.type === 'true_false' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resposta Correta</label>
                    <div className="flex gap-4">
                      {['Verdadeiro', 'Falso'].map((option, index) => (
                        <button
                          key={option}
                          onClick={() => updateQuestion(activeQuestion, { correctAnswer: index })}
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
                      onChange={(e) => updateQuestion(activeQuestion, { points: parseInt(e.target.value) || 1 })}
                      min={1}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explicação (opcional)</label>
                    <input
                      type="text"
                      value={currentQuestion.explanation || ''}
                      onChange={(e) => updateQuestion(activeQuestion, { explanation: e.target.value })}
                      placeholder="Por que esta resposta..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => deleteQuestion(activeQuestion)}
                  disabled={exam.questions.length === 1}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Eliminar Questão
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveQuestion(Math.max(0, activeQuestion - 1))}
                    disabled={activeQuestion === 0}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setActiveQuestion(Math.min(exam.questions.length - 1, activeQuestion + 1))}
                    disabled={activeQuestion === exam.questions.length - 1}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                  >
                    Próxima Questão
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileQuestion size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Selecione uma questão para editar</p>
            </div>
          )}
        </main>

        {/* Settings Panel */}
        {showSettings && (
          <aside className="w-80 bg-white border-l border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px] p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações do Exame</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Aleatorizar Questões</p>
                  <p className="text-xs text-gray-500">Misturar ordem das questões</p>
                </div>
                <button
                  onClick={() => setExam({ ...exam, settings: { ...exam.settings, randomizeQuestions: !exam.settings.randomizeQuestions } })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    exam.settings.randomizeQuestions ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    exam.settings.randomizeQuestions ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Mostrar Resultados</p>
                  <p className="text-xs text-gray-500">Exibir nota após conclusão</p>
                </div>
                <button
                  onClick={() => setExam({ ...exam, settings: { ...exam.settings, showResults: !exam.settings.showResults } })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    exam.settings.showResults ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    exam.settings.showResults ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Permitir Revisão</p>
                  <p className="text-xs text-gray-500">Revisar respostas após teste</p>
                </div>
                <button
                  onClick={() => setExam({ ...exam, settings: { ...exam.settings, allowReview: !exam.settings.allowReview } })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    exam.settings.allowReview ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    exam.settings.allowReview ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
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
                  value={exam.passingScore}
                  onChange={(e) => setExam({ ...exam, passingScore: parseInt(e.target.value) || 70 })}
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
