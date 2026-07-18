"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

interface Question {
  id: string;
  text: string;
  options: string;
  points: number;
  type: string;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  questions?: Question[];
}

interface Answer {
  questionId: string;
  answer: string;
}

interface Result {
  score: number;
  total: number;
  percentage: number;
  correct: number;
  wrong: number;
}

export default function ExamPage({ 
  params 
}: { 
  params: Promise<{ id: string; examId: string }> 
}) {
  const { id, examId } = use(params);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchExam();
  }, [examId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || submitted) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/exams/${examId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Exame não encontrado");
      const data = await res.json();
      setExam(data);
      
      // Set timer if duration is defined
      if (data.duration) {
        setTimeLeft(data.duration * 60);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitted || !exam?.questions) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const answersArray: Answer[] = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const res = await fetch(`http://localhost:3001/api/exams/${examId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ answers: answersArray })
      });

      if (!res.ok) throw new Error("Erro ao submeter");
      
      const data = await res.json();
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao submeter");
    } finally {
      setSubmitting(false);
    }
  }, [answers, examId, submitted, exam]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const question = exam?.questions?.[currentQuestion];
  const questions = exam?.questions || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600">{error || "Exame não encontrado"}</h1>
          <button onClick={() => router.back()} className="btn btn-primary mt-4">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Show result
  if (submitted && result) {
    const percentage = result.percentage;
    const isApproved = percentage >= 50;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              isApproved ? "bg-green-100" : "bg-red-100"
            }`}>
              <span className={`text-5xl ${isApproved ? "text-green-500" : "text-red-500"}`}>
                {isApproved ? "🎉" : "😢"}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">
              {isApproved ? "Parabéns!" : "Não desista!"}
            </h1>
            
            <div className="text-7xl font-bold mb-4" style={{
              color: isApproved ? "#22c55e" : "#ef4444"
            }}>
              {percentage.toFixed(1)}%
            </div>
            
            <p className="text-gray-600 mb-8">
              Você acertou <strong>{result.correct}</strong> de <strong>{result.total}</strong> questões
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">{result.correct}</div>
                <div className="text-sm text-green-700">Corretas</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-600">{result.wrong}</div>
                <div className="text-sm text-red-700">Erradas</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setResult(null);
                }}
                className="btn btn-outline"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => router.push(`/institutions/${id}`)}
                className="btn btn-primary"
              >
                Voltar aos Exames
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show questions
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-lg">{exam.title}</h1>
              <p className="text-sm text-gray-500">
                Questão {currentQuestion + 1} de {questions.length}
              </p>
            </div>
            {timeLeft !== null && (
              <div className={`px-4 py-2 rounded-lg font-mono text-lg ${
                timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100"
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {question && (
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {question.points} pontos
                </span>
              </div>
              
              <h2 className="text-xl font-medium text-gray-900 mb-8">
                {question.text}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {JSON.parse(question.options || "[]").map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      answers[question.id] === option
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-4 text-sm font-medium ${
                      answers[question.id] === option
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="btn btn-outline disabled:opacity-50"
            >
              ← Anterior
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? "bg-primary text-white"
                      : answers[questions[index]?.id]
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Enviando..." : "Finalizar"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                className="btn btn-primary"
              >
                Próxima →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
