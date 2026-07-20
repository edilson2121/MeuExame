'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Trophy,
  Loader2,
  Lock,
  FileQuestion,
  Image,
} from 'lucide-react';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  imageUrl?: string;
  options: Option[];
  explanation?: string;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number;
  subject: { name: string };
  questions: Question[];
}

interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

interface ExamResult {
  score: number;
  total: number;
  percentage: number;
  answers: Answer[];
}

function RealizarExameContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const examId = resolvedParams.id;
  const router = useRouter();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (started && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, timeLeft, submitted]);

  const fetchExam = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        
        // Verificar se tem acesso
        if (data.accessType === 'PAID' && !data.hasAccess) {
          router.push(`/pagamentos/${examId}`);
          return;
        }

        setExam(data);
        setTimeLeft((data.duration || 60) * 60); // Converter minutos para segundos
      } else {
        setError('Exame não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar exame');
      // Demo data
      setExam({
        id: examId,
        title: 'Exame de Matemática',
        description: 'Exame de admissão 2024',
        duration: 60,
        subject: { name: 'Matemática' },
        questions: [
          {
            id: '1',
            text: 'Quanto é 2 + 2?',
            type: 'MULTIPLE_CHOICE',
            options: [
              { id: 0, text: '3', isCorrect: false },
              { id: 1, text: '4', isCorrect: true },
              { id: 2, text: '5', isCorrect: false },
              { id: 3, text: '6', isCorrect: false },
            ],
          },
          {
            id: '2',
            text: 'Quanto é 5 x 5?',
            type: 'MULTIPLE_CHOICE',
            options: [
              { id: 0, text: '10', isCorrect: false },
              { id: 1, text: '20', isCorrect: false },
              { id: 2, text: '25', isCorrect: true },
              { id: 3, text: '30', isCorrect: false },
            ],
          },
          {
            id: '3',
            text: 'Quanto é 10 - 3?',
            type: 'MULTIPLE_CHOICE',
            options: [
              { id: 0, text: '5', isCorrect: false },
              { id: 1, text: '6', isCorrect: false },
              { id: 2, text: '7', isCorrect: true },
              { id: 3, text: '8', isCorrect: false },
            ],
          },
        ],
      });
      setTimeLeft(60 * 60);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleSelectOption = (questionId: string, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!exam || submitted) return;

    setSubmitting(true);

    // Calcular resultado
    let correct = 0;
    const answerDetails: Answer[] = [];

    exam.questions.forEach((q) => {
      const selectedOption = answers[q.id];
      const correctOption = q.options.findIndex((o) => o.isCorrect);
      const isCorrect = selectedOption === correctOption;
      
      if (isCorrect) correct++;
      
      answerDetails.push({
        questionId: q.id,
        selectedOption: selectedOption ?? -1,
        isCorrect,
      });
    });

    const percentage = Math.round((correct / exam.questions.length) * 100);

    const resultData: ExamResult = {
      score: correct,
      total: exam.questions.length,
      percentage,
      answers: answerDetails,
    };

    setResult(resultData);
    setSubmitted(true);

    // Enviar resultado para o backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: answerDetails,
          score: correct,
          total: exam.questions.length,
        }),
      });
    } catch (err) {
      console.error('Erro ao enviar resultado:', err);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{error || 'Exame não encontrado'}</h2>
            <Link href="/exames" className="text-green-600 hover:underline">
              Voltar aos exames
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Tela inicial
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileQuestion className="text-green-600" size={40} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h1>
            <p className="text-gray-500 mb-6">{exam.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-gray-900">{exam.questions.length}</p>
                <p className="text-sm text-gray-500">Questões</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-gray-900">{exam.duration}</p>
                <p className="text-sm text-gray-500">Minutos</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ Uma vez iniciado, o temporizador não pode ser pausado. 
                Certifique-se de ter tempo suficiente para completar o exame.
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              Iniciar Exame
            </button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Tela de resultado
  if (submitted && result) {
    const getGrade = (percentage: number) => {
      if (percentage >= 90) return { text: 'Excelente!', color: 'text-green-600', bg: 'bg-green-100' };
      if (percentage >= 70) return { text: 'Muito Bom', color: 'text-blue-600', bg: 'bg-blue-100' };
      if (percentage >= 50) return { text: 'Bom', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      return { text: 'Necessita Melhorar', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const grade = getGrade(result.percentage);

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
              <div className={`w-24 h-24 ${grade.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Trophy className={`${grade.color}`} size={48} />
              </div>
              
              <h1 className={`text-3xl font-bold ${grade.color} mb-2`}>{grade.text}</h1>
              <p className="text-gray-500 mb-6">Você completou o exame</p>

              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">{result.score}</p>
                  <p className="text-sm text-gray-500">Corretas</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-400">{result.total - result.score}</p>
                  <p className="text-sm text-gray-500">Erradas</p>
                </div>
                <div className="text-center">
                  <p className={`text-4xl font-bold ${result.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.percentage}%
                  </p>
                  <p className="text-sm text-gray-500">Pontuação</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/home"
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Voltar ao Início
                </Link>
                <button
                  onClick={() => {
                    setStarted(false);
                    setAnswers({});
                    setSubmitted(false);
                    setResult(null);
                    setTimeLeft((exam?.duration || 60) * 60);
                  }}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>

            {/* Revisão das respostas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Revisão das Respostas</h2>
              <div className="space-y-4">
                {exam.questions.map((q, idx) => {
                  const answer = result.answers.find((a) => a.questionId === q.id);
                  const correctOption = q.options.findIndex((o) => o.isCorrect);
                  
                  return (
                    <div key={q.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {answer?.isCorrect ? (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="text-green-600" size={16} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <X className="text-red-600" size={16} />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Questão {idx + 1}</p>
                          <p className="text-gray-700">{q.text}</p>
                        </div>
                      </div>
                      
                      <div className="ml-9 space-y-2">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-lg text-sm ${
                              opt.isCorrect
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : opt.id === answer?.selectedOption && !opt.isCorrect
                                ? 'bg-red-50 border border-red-200 text-red-800'
                                : 'bg-gray-50 border border-gray-200 text-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{String.fromCharCode(65 + opt.id)}.</span>
                              <span>{opt.text}</span>
                              {opt.isCorrect && <Check className="ml-auto text-green-600" size={16} />}
                              {opt.id === answer?.selectedOption && !opt.isCorrect && <X className="ml-auto text-red-600" size={16} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Tela do exame
  const question = exam.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header do exame */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/home" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft size={24} />
            </Link>
            
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <Clock className="inline-block mr-1" size={16} />
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Enviar'}
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{answeredCount} de {exam.questions.length} respondidas</span>
              <span>{Math.round((answeredCount / exam.questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questão */}
      <div className="flex-1 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">
                {currentQuestion + 1}
              </span>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-900">{question.text}</p>
              </div>
            </div>

            {question.imageUrl && (
              <div className="mb-4">
                <img
                  src={question.imageUrl}
                  alt="Questão"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Opções */}
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(question.id, option.id)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  answers[question.id] === option.id
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-white border-2 border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    answers[question.id] === option.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + option.id)}
                  </span>
                  <span className="text-lg text-gray-900">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            {/* Indicadores de questões */}
            <div className="flex gap-2">
              {exam.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                    idx === currentQuestion
                      ? 'bg-green-600 text-white'
                      : answers[q.id] !== undefined
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentQuestion((prev) => Math.min(exam.questions.length - 1, prev + 1))}
              disabled={currentQuestion === exam.questions.length - 1}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Próxima
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RealizarExamePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute requireAuth={true}>
      <RealizarExameContent params={params} />
    </ProtectedRoute>
  );
}
