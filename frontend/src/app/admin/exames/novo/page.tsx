'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  Upload,
  Plus,
  Trash2,
  Image,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  DollarSign,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  statementImage: string | null;
  options: string[];
  optionImages: (string | null)[];
  correctOption: number;
  explanation: string;
}

interface ExamFormData {
  title: string;
  description: string;
  disciplineId: string;
  duration: number;
  accessType: 'FREE' | 'PAID';
  price: number;
}

export default function NovoExamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    description: '',
    disciplineId: '',
    duration: 60,
    accessType: 'FREE',
    price: 0,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiUrl}/institutions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setInstitutions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
        // Fallback
        setInstitutions([
          { id: '1', name: 'Universidade Eduardo Mondlane' },
          { id: '2', name: 'Universidade Católica de Moçambique' },
        ]);
      }
    };

    fetchInstitutions();
  }, []);

  const fetchDisciplines = useCallback(async (institutionId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/disciplines?institutionId=${institutionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDisciplines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      setDisciplines([
        { id: '1', name: 'Matemática' },
        { id: '2', name: 'Física' },
        { id: '3', name: 'Química' },
      ]);
    }
  }, []);

  const handleInstitutionChange = (institutionId: string) => {
    setSelectedInstitution(institutionId);
    setFormData((prev) => ({ ...prev, disciplineId: '' }));
    if (institutionId) {
      fetchDisciplines(institutionId);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      type: 'MULTIPLE_CHOICE',
      statementImage: null,
      options: ['', '', '', ''],
      optionImages: [null, null, null, null],
      correctOption: 0,
      explanation: '',
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
    }
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex].options = newOptions;
    setQuestions(newQuestions);
  };

  const handleImageUpload = async (file: File, type: 'statement' | 'option', questionIndex: number, optionIndex?: number) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/uploads/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.url;

        if (type === 'statement') {
          updateQuestion(questionIndex, { statementImage: imageUrl });
        } else if (optionIndex !== undefined) {
          const newQuestions = [...questions];
          const newOptionImages = [...newQuestions[questionIndex].optionImages];
          newOptionImages[optionIndex] = imageUrl;
          newQuestions[questionIndex].optionImages = newOptionImages;
          setQuestions(newQuestions);
        }

        setUploadedImages((prev) => ({ ...prev, [file.name]: imageUrl }));
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      // Simular URL para demo
      const fakeUrl = `/uploads/${file.name}`;
      if (type === 'statement') {
        updateQuestion(questionIndex, { statementImage: fakeUrl });
      } else if (optionIndex !== undefined) {
        const newQuestions = [...questions];
        const newOptionImages = [...newQuestions[questionIndex].optionImages];
        newOptionImages[optionIndex] = fakeUrl;
        newQuestions[questionIndex].optionImages = newOptionImages;
        setQuestions(newQuestions);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');

      // Criar exame
      const examRes = await fetch(`${apiUrl}/exams`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalQuestions: questions.length,
        }),
      });

      if (!examRes.ok) throw new Error('Erro ao criar exame');

      const examData = await examRes.json();

      // Criar questões
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await fetch(`${apiUrl}/exams/${examData.id}/questions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: q.text,
            type: q.type,
            statementImage: q.statementImage,
            options: q.options,
            optionImages: q.optionImages,
            correctOption: q.correctOption,
            explanation: q.explanation,
            order: i,
          }),
        });
      }

      router.push('/admin/exames');
    } catch (error) {
      console.error('Erro ao guardar exame:', error);
      alert('Erro ao guardar o exame. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = formData.title && formData.disciplineId;
  const canProceedToStep3 = questions.length > 0 && questions.every((q) => q.text && q.options.every((o) => o));

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/exames"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          Voltar para Exames
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Criar Novo Exame</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preencha os dados do exame e adicione as questões
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > 1 ? <Check size={20} /> : '1'}
            </div>
            <p className="text-sm mt-2 font-medium">Dados Básicos</p>
          </div>
          <div className="flex-1 border-t-2 border-gray-200 mx-4 mt-5" />
          <div className="flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > 2 ? <Check size={20} /> : '2'}
            </div>
            <p className="text-sm mt-2 font-medium">Questões</p>
          </div>
          <div className="flex-1 border-t-2 border-gray-200 mx-4 mt-5" />
          <div className="flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </div>
            <p className="text-sm mt-2 font-medium">Revisão</p>
          </div>
        </div>
      </div>

      {/* Step 1: Basic Data */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Dados do Exame</h2>

          <div className="space-y-6">
            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instituição *
              </label>
              <select
                value={selectedInstitution}
                onChange={(e) => handleInstitutionChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Selecione uma instituição</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Discipline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disciplina *
              </label>
              <select
                value={formData.disciplineId}
                onChange={(e) => setFormData({ ...formData, disciplineId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={!selectedInstitution}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplines.map((disc) => (
                  <option key={disc.id} value={disc.id}>
                    {disc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Exame *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Matemática - Exame de Admissão 2024"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional do exame..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração (minutos)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                min={1}
                max={300}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Access Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Acesso
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accessType: 'FREE' })}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    formData.accessType === 'FREE'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Unlock size={24} />
                  <div className="text-left">
                    <p className="font-medium">Grátis</p>
                    <p className="text-xs text-gray-500">Acesso livre para todos</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accessType: 'PAID' })}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    formData.accessType === 'PAID'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Lock size={24} />
                  <div className="text-left">
                    <p className="font-medium">Pago</p>
                    <p className="text-xs text-gray-500">Requer pagamento</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Price (if PAID) */}
            {formData.accessType === 'PAID' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (MZN)
                </label>
                <div className="relative">
                  <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!canProceedToStep2}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Próximo: Questões
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Questions */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Questions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Questões ({questions.length})
              </h2>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Adicionar Questão
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma questão adicionada</p>
                <p className="text-sm mt-1">Clique em "Adicionar Questão" para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      currentQuestionIndex === index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">
                          #{index + 1}
                        </span>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {q.text || 'Questão sem texto'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQuestion(index);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Question Editor */}
          {currentQuestion && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Questão {currentQuestionIndex + 1}
              </h3>

              <div className="space-y-6">
                {/* Question Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Questão
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => updateQuestion(currentQuestionIndex, { type: 'MULTIPLE_CHOICE', options: ['', '', '', ''] })}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        currentQuestion.type === 'MULTIPLE_CHOICE'
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Múltipla Escolha
                    </button>
                    <button
                      type="button"
                      onClick={() => updateQuestion(currentQuestionIndex, { type: 'TRUE_FALSE', options: ['Verdadeiro', 'Falso'] })}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        currentQuestion.type === 'TRUE_FALSE'
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Verdadeiro / Falso
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto da Questão *
                  </label>
                  <textarea
                    value={currentQuestion.text}
                    onChange={(e) => updateQuestion(currentQuestionIndex, { text: e.target.value })}
                    placeholder="Digite o enunciado da questão..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Statement Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Enunciado (opcional)
                  </label>
                  <div className="flex items-start gap-4">
                    {currentQuestion.statementImage ? (
                      <div className="relative">
                        <img
                          src={currentQuestion.statementImage}
                          alt="Enunciado"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => updateQuestion(currentQuestionIndex, { statementImage: null })}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50">
                        <Image size={24} className="text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'statement', currentQuestionIndex);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opções de Resposta *
                  </label>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuestion(currentQuestionIndex, { correctOption: optionIndex })}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                            currentQuestion.correctOption === optionIndex
                              ? 'border-green-600 bg-green-600 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {currentQuestion.correctOption === optionIndex && <Check size={16} />}
                        </button>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(currentQuestionIndex, optionIndex, e.target.value)}
                          placeholder={`Opção ${optionIndex + 1}`}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        {currentQuestion.optionImages?.[optionIndex] ? (
                          <div className="relative">
                            <img
                              src={currentQuestion.optionImages[optionIndex]}
                              alt={`Opção ${optionIndex + 1}`}
                              className="w-12 h-12 object-cover rounded border"
                            />
                          </div>
                        ) : (
                          <label className="p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <Image size={20} className="text-gray-500" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'option', currentQuestionIndex, optionIndex);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Check size={12} className="text-green-600" />
                    Clique no botão ao lado da opção para marcá-la como correta
                  </p>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explicação (opcional)
                  </label>
                  <textarea
                    value={currentQuestion.explanation}
                    onChange={(e) => updateQuestion(currentQuestionIndex, { explanation: e.target.value })}
                    placeholder="Explique a resposta correta..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Voltar
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!canProceedToStep3}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Próximo: Revisão
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Revisão do Exame</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Título</p>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Disciplina</p>
                  <p className="font-medium">
                    {disciplines.find((d) => d.id === formData.disciplineId)?.name || '-'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Duração</p>
                  <p className="font-medium">{formData.duration} minutos</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Tipo de Acesso</p>
                  <p className={`font-medium ${formData.accessType === 'PAID' ? 'text-red-600' : 'text-green-600'}`}>
                    {formData.accessType === 'FREE' ? 'Grátis' : `Pago - ${formData.price} MZN`}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Questões ({questions.length})</p>
                <div className="space-y-2">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-2 text-sm">
                      <span className="font-medium">#{i + 1}</span>
                      <span className="line-clamp-1">{q.text || 'Sem texto'}</span>
                      {q.statementImage && (
                        <Image size={14} className="text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Voltar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Exame
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
