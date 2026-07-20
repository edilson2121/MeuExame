'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ExamesPage() {
  const [exams, setExams] = useState([]);
  const [subject, setSubject] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [manuals, setManuals] = useState([]);
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

      // Fetch study contents for this subject
      const studyContentsResponse = await fetch(`${apiUrl}/study-contents/subject/${params.subjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (studyContentsResponse.ok) {
        const studyContentsData = await studyContentsResponse.json();
        setManuals(studyContentsData);
      }
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExam = (exam: any) => {
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

  const hasFullAccess = userSubscription?.isActive && new Date(userSubscription?.endDate) > new Date();
  const isFreeUser = !hasFullAccess;

  const getAvailableQuestions = (exam: any) => {
    if (hasFullAccess) {
      return exam.questions;
    }
    // Return only first 3 questions for free users
    return exam.questions?.slice(0, 3) || [];
  };

  if (showExam && selectedExam) {
    const questions = getAvailableQuestions(selectedExam);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={handleBackToList}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Voltar aos Exames
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
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
            <div className="bg-white rounded-lg shadow-md p-8">
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
                    className={`p-4 rounded-lg ${
                      r.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        r.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {r.isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          Questão {index + 1}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Sua resposta: {r.userAnswer || 'Não respondida'}
                        </p>
                        {!r.isCorrect && (
                          <p className="text-sm text-green-700 mb-2">
                            Resposta correta: {r.correctAnswer}
                          </p>
                        )}
                        {r.explanation && (
                          <p className="text-sm text-gray-700 bg-white p-3 rounded mt-2">
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
                className="mt-8 w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Voltar aos Exames
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                {isFreeUser && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <p className="text-orange-600 text-sm font-semibold">
                      🎁 Versão Gratuita
                    </p>
                    <p className="text-orange-700 text-sm mt-1">
                      Você está visualizando as primeiras 3 questões deste exame.
                    </p>
                    <Link
                      href="/pagamento"
                      className="block mt-2 text-sm text-orange-800 hover:text-orange-900 font-medium underline"
                    >
                      Assinar por 299 MZN para acesso completo a todas as questões
                    </Link>
                  </div>
                )}
                <p className="text-gray-600 mb-4">
                  Responda às questões abaixo. O sistema irá validar suas respostas automaticamente.
                </p>
                {selectedExam.imageUrl && (
                  <img
                    src={selectedExam.imageUrl}
                    alt="Exam"
                    className="w-full max-w-md mx-auto rounded-lg mb-4"
                  />
                )}
              </div>

              <div className="space-y-8">
                {questions.map((question: any, index: number) => (
                  <div key={question.id} className="border-b pb-6 last:border-b-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {index + 1}. {question.text}
                    </h3>
                    {question.imageUrl && (
                      <img
                        src={question.imageUrl}
                        alt={`Question ${index + 1}`}
                        className="w-full max-w-md rounded-lg mb-4"
                      />
                    )}
                    <div className="space-y-3">
                      {question.options?.map((option: string, optIndex: number) => (
                        <label
                          key={optIndex}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            answers[question.id] === option
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="mr-3"
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
                className="mt-8 w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/instituicoes/${params.id}/disciplinas`}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ← Voltar às Disciplinas
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {subject?.name || 'Exames'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {institution?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Study Contents Section */}
        {manuals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conteúdos de Estudo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {manuals.map((manual: any) => (
                <div
                  key={manual.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {manual.title}
                  </h3>
                  {manual.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {manual.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>👁️ {manual.views}</span>
                    <span>❤️ {manual.likes}</span>
                  </div>
                  <button
                    onClick={() => window.open(`/study-contents/${manual.id}`, '_blank')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ver Conteúdo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exams Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exames Disponíveis</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Carregando exames...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum exame disponível para esta disciplina.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam: any) => (
                <div
                  key={exam.id}
                  onClick={() => handleSelectExam(exam)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
                >
                  {exam.imageUrl && (
                    <img
                      src={exam.imageUrl}
                      alt={exam.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  {exam.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {exam.description}
                    </p>
                  )}
                  {exam.duration && (
                    <p className="text-gray-500 text-sm">
                      Duração: {exam.duration} minutos
                    </p>
                  )}
                  <p className="text-green-600 text-sm mt-3 font-medium">
                    Clique para iniciar o exame
                  </p>
                  {isFreeUser && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                      <p className="text-orange-600 text-xs font-semibold">
                        🎁 Versão Gratuita
                      </p>
                      <p className="text-orange-700 text-xs mt-1">
                        3 questões disponíveis
                      </p>
                      <Link
                        href="/pagamento"
                        className="block mt-2 text-xs text-orange-800 hover:text-orange-900 font-medium underline"
                      >
                        Assinar por 299 MZN para acesso completo
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
