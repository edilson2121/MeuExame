'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  PlayIcon,
  LockClosedIcon,
  GiftIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function ExamesPage() {
  const [exams, setExams] = useState([]);
  const [subject, setSubject] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [showExam, setShowExam] = useState(false);
  const [answers, setAnswers] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchExams();
    fetchUserSubscription();
  }, [params.id, params.subjectId]);

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/payments/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserSubscription(data);
      }
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
    }
  };

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

      // Fetch subject
      const subjectResponse = await fetch(`${apiUrl}/subjects/${params.subjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const subjectData = await subjectResponse.json();
      setSubject(subjectData);

      // Fetch institution
      const instResponse = await fetch(`${apiUrl}/institutions/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const instData = await instResponse.json();
      setInstitution(instData);

      // Fetch exams for this subject
      const examsResponse = await fetch(`${apiUrl}/exams/subject/${params.subjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const examsData = await examsResponse.json();
      setExams(examsData);
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExam = (exam: any) => {
    const isPaidExam = exam.price && exam.price > 0;
    if (isPaidExam && !hasFullAccess) {
      router.push(`/pagamentos/${exam.id}`);
      return;
    }

    setSelectedExam(exam);
    setShowExam(true);
    setAnswers({});
    setResult(null);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

      // Start simulation
      const startResponse = await fetch(`${apiUrl}/simulations/start/${selectedExam.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const simulation = await startResponse.json();

      // Complete simulation with answers
      const completeResponse = await fetch(`${apiUrl}/simulations/${simulation.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      const data = await completeResponse.json();

      setResult({
        score: data.score,
        correctCount: Object.keys(answers).filter((key) => {
          const question = selectedExam.questions?.find((q: any) => q.id === key);
          return question && answers[key] === question.correctAnswer;
        }).length,
        totalQuestions: selectedExam.questions?.length || 0,
        results: selectedExam.questions?.map((q: any) => ({
          questionId: q.id,
          isCorrect: answers[q.id] === q.correctAnswer,
          userAnswer: answers[q.id],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })) || [],
      });
    } catch (error) {
      console.error('Erro ao validar respostas:', error);
      alert('Erro ao validar respostas');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToList = () => {
    setShowExam(false);
    setSelectedExam(null);
    setResult(null);
  };

  const hasFullAccess = userSubscription?.isActive && userSubscription?.endDate ? new Date(userSubscription.endDate) > new Date() : false;
  const isFreeUser = !hasFullAccess;

  const getAvailableQuestions = (exam: any) => {
    if (hasFullAccess) {
      return exam.questions;
    }
    return exam.questions?.slice(0, 3) || [];
  };

  if (showExam && selectedExam) {
    const questions = getAvailableQuestions(selectedExam);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Voltar aos Exames
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedExam.title}
            </h1>
            {selectedExam.description && (
              <p className="text-gray-600 mt-1">{selectedExam.description}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {result ? (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  {result.score.toFixed(0)}%
                </div>
                <p className="text-gray-600">
                  Você acertou {result.correctCount} de {result.totalQuestions} questões
                </p>
              </div>

              <div className="space-y-6">
                {result.results.map((r: any, index: number) => (
                  <div
                    key={r.questionId}
                    className={`p-6 rounded-2xl ${r.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                        {r.isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">
                          Questão {index + 1}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Sua resposta: {r.userAnswer || 'Não respondida'}
                        </p>
                        {!r.isCorrect && (
                          <p className="text-sm text-red-600 mb-2">
                            Resposta correta: {r.correctAnswer}
                          </p>
                        )}
                        {r.explanation && (
                          <p className="text-sm text-gray-700 bg-white p-4 rounded-xl mt-2">
                            <strong>Explicação:</strong> {r.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleBackToList}
                className="mt-8 w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Voltar aos Exames
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="mb-6">
                {isFreeUser && (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
                    <p className="text-amber-700 text-sm font-semibold flex items-center gap-2 mb-2">
                      <GiftIcon className="w-5 h-5" />
                      Versão Gratuita
                    </p>
                    <p className="text-amber-700 text-sm">
                      Você está visualizando as primeiras 3 questões deste exame.
                    </p>
                    <Link
                      href="/pagamento"
                      className="block mt-3 text-sm text-amber-800 hover:text-amber-900 font-medium underline"
                    >
                      Assinar por 299 MZN para acesso completo a todas as questões
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600 mb-6">
                  <ClockIcon className="w-5 h-5" />
                  <span>{selectedExam.duration} minutos • {selectedExam.questions?.length || 0} questões</span>
                </div>
                {selectedExam.imageUrl && (
                  <img
                    src={selectedExam.imageUrl}
                    alt="Exam"
                    className="w-full max-w-md mx-auto rounded-2xl mb-6"
                  />
                )}
              </div>

              <div className="space-y-6">
                {questions.map((question: any, index: number) => (
                  <div key={question.id} className="border-b-2 border-gray-100 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {index + 1}. {question.text}
                    </h3>
                    {question.imageUrl && (
                      <img
                        src={question.imageUrl}
                        alt={`Question ${index + 1}`}
                        className="w-full max-w-md rounded-2xl mb-4"
                      />
                    )}
                    <div className="space-y-3">
                      {question.options?.map((option: string, optIndex: number) => (
                        <label
                          key={optIndex}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[question.id] === option
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="mr-4"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitExam}
                disabled={submitting || Object.keys(answers).length === 0}
                className="mt-8 w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? 'Validando...' : 'Enviar Respostas'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/instituicoes/${params.id}/disciplinas`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Voltar às Disciplinas
              </Link>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpenIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {subject?.name || 'Exames'}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {institution?.name} · {exams.length} {exams.length === 1 ? 'exame disponível' : 'exames disponíveis'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando exames...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20">
            <DocumentTextIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum exame disponível</h3>
            <p className="text-gray-500">Esta disciplina ainda não possui exames cadastrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam: any) => (
              <div
                key={exam.id}
                onClick={() => handleSelectExam(exam)}
                className="bg-white rounded-3xl shadow-lg border-2 border-green-100 hover:shadow-2xl hover:border-green-400 transition-all group transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative">
                  {exam.imageUrl ? (
                    <img
                      src={exam.imageUrl}
                      alt={exam.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <DocumentTextIcon className="w-16 h-16 text-white/90" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-semibold flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      {exam.duration} min
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {exam.title}
                  </h3>
                  {exam.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {exam.description}
                    </p>
                  )}

                  {/* Price Badge */}
                  {exam.price && exam.price > 0 ? (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <LockClosedIcon className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-purple-700 text-sm font-bold">PAGO</p>
                          <p className="text-purple-600 text-xs">{exam.price} MZN</p>
                        </div>
                      </div>
                      {isFreeUser && (
                        <p className="text-purple-600 text-xs mt-2 font-medium">
                          Clique para desbloquear
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <GiftIcon className="w-5 h-5 text-green-600" />
                        <p className="text-green-700 text-sm font-bold">GRÁTIS</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {exam.questions?.length || 0} questões
                    </span>
                    <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                      <PlayIcon className="w-5 h-5" />
                      <span>Iniciar</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
