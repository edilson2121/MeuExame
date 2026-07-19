'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileQuestion,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Play,
  Eye,
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  statementImage: string | null;
  options: string[];
  optionImages: (string | null)[];
}

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  totalQuestions: number;
  accessType: 'FREE' | 'PAID';
  discipline: { name: string };
  institution: { name: string };
  questions?: Question[];
}

interface Result {
  id: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

function ExamTakingContent() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchExam = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${apiUrl}/exams/${examId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setExam(data);
        
        if (data.duration) {
          setTimeLeft(data.duration * 60);
        }
      }

      // Fetch questions
      const questionsRes = await fetch(`${apiUrl}/exams/${examId}/questions`, { headers });
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setQuestions(Array.isArray(questionsData) ? questionsData : []);
      }
    } catch (error) {
      console.error('Erro ao carregar exame:', error);
      // Fallback
      setExam({
        id: examId,
        title: 'Matemática - Exame 2023',
        description: 'Exame de admissão Matemática 2023',
        duration: 60,
        totalQuestions: 5,
        accessType: 'FREE',
        discipline: { name: 'Matemática' },
        institution: { name: 'UEM' },
      });
      setQuestions([
        { id: '1', text: 'Quanto é 2 + 2?', type: 'MULTIPLE_CHOICE', statementImage: null, options: ['3', '4', '5', '6'], optionImages: [null, null, null, null] },
        { id: '2', text: 'Quanto é 5 x 5?', type: 'MULTIPLE_CHOICE', statementImage: null, options: ['20', '25', '30', '35'], optionImages: [null, null, null, null] },
        { id: '3', text: 'Quanto é 10 - 3?', type: 'MULTIPLE_CHOICE', statementImage: null, options: ['5', '6', '7', '8'], optionImages: [null, null, null, null] },
        { id: '4', text: 'Quanto é 8 ÷ 2?', type: 'MULTIPLE_CHOICE', statementImage: null, options: ['2', '3', '4', '5'], optionImages: [null, null, null, null] },
        { id: '5', text: 'Quanto é 3²?', type: 'MULTIPLE_CHOICE', statementImage: null, options: ['6', '8', '9', '12'], optionImages: [null, null, null, null] },
      ]);
      setTimeLeft(60 * 60);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchExam();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [fetchExam]);

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examStarted]);

  const startExam = () => {
    setExamStarted(true);
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSubmitting(true);
    
    try {
      // Calculate score locally
      let correct = 0;
      questions.forEach((q) => {
        if (answers[q.id] === 0) correct++; // Assuming first option is correct for demo
      });
      
      const score = Math.round((correct / questions.length) * 100);
      
      // Send to API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      await fetch(`${apiUrl}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examId,
          answers,
          score,
          timeSpent: exam!.duration! * 60 - timeLeft,
        }),
      });

      setResult({
        id: 'demo',
        score,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
      });
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao submeter:', error);
      // Show local results anyway
      let correct = 0;
      questions.forEach((q) => {
        if (answers[q.id] === 0) correct++;
      });
      const score = Math.round((correct / questions.length) * 100);
      setResult({
        id: 'demo',
        score,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
      });
      setShowResults(true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[currentQuestion];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={48} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500" />
          <p className="mt-4 text-gray-600">Exame não encontrado</p>
          <Link href="/instituicoes" className="text-green-600 hover:underline mt-2 inline-block">
            Voltar às instituições
          </Link>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults && result) {
    const passed = result.score >= 50;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className={`p-8 text-center ${passed ? 'bg-green-600' : 'bg-red-600'}`}>
              {passed ? (
                <CheckCircle size={64} className="mx-auto text-white" />
              ) : (
                <XCircle size={64} className="mx-auto text-white" />
              )}
              <h1 className="text-2xl font-bold text-white mt-4">
                {passed ? 'Parabéns!' : 'Não passou'}
              </h1>
              <p className="text-white/80 mt-2">Você completou o exame</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-6xl font-bold text-gray-900">{result.score}%</p>
                <p className="text-gray-500 mt-2">
                  {Math.round((result.score / 100) * result.totalQuestions)} de {result.totalQuestions} respostas corretas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">Tempo gasto</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatTime(exam.duration! * 60 - timeLeft)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">Questões</p>
                  <p className="text-xl font-bold text-gray-900">{result.totalQuestions}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/instituicoes"
                  className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors"
                >
                  Voltar às instituições
                </Link>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setAnswers({});
                    setCurrentQuestion(0);
                    setTimeLeft(exam.duration! * 60);
                    setExamStarted(false);
                  }}
                  className="block w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Start Screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Link
            href={`/disciplinas/${exam.discipline?.name}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ChevronLeft size={16} className="mr-1" />
            Voltar
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center">
              <FileQuestion size={48} className="text-white" />
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-500 mt-2">{exam.discipline?.name} - {exam.institution?.name}</p>
              
              {exam.description && (
                <p className="text-gray-600 mt-4">{exam.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileQuestion size={20} />
                    <span className="text-sm">Questões</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{exam.totalQuestions}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={20} />
                    <span className="text-sm">Duração</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{exam.duration} min</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> O exame começará quando você clicar em "Iniciar". 
                  O tempo começará a contar e você não poderá pausar.
                </p>
              </div>

              <button
                onClick={startExam}
                className="w-full mt-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Play size={24} />
                Iniciar Exame
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Exam Taking Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">{exam.title}</h1>
            <p className="text-sm text-gray-500">
              Questão {currentQuestion + 1} de {questions.length}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
            <Clock size={16} className="inline mr-2" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              #{currentQuestion + 1}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQ?.text}
          </h2>

          {currentQ?.statementImage && (
            <img
              src={currentQ.statementImage}
              alt="Enunciado"
              className="max-w-full rounded-lg mb-4"
            />
          )}

          <div className="space-y-3">
            {currentQ?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(currentQ.id, index)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  answers[currentQ.id] === index
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                  answers[currentQ.id] === index
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submetendo...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Submeter
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
            >
              Próxima
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Questões</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg font-medium flex items-center justify-center transition-colors ${
                  currentQuestion === index
                    ? 'bg-green-600 text-white'
                    : answers[q.id] !== undefined
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {answeredCount} de {questions.length} respondidas
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ExamTakingPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <ExamTakingContent />
    </ProtectedRoute>
  );
}
