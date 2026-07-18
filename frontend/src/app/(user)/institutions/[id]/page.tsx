"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

interface Institution {
  id: string;
  name: string;
  city?: string;
  country: string;
  isActive: boolean;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  status: string;
  year?: number;
  isFree?: boolean;
  subject?: {
    name: string;
  };
}

interface User {
  role: string;
}

export default function InstitutionExamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }

    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch institution
      const instRes = await fetch(`http://localhost:3001/api/institutions/${id}`, { headers });
      if (!instRes.ok) throw new Error("Instituição não encontrada");
      const instData = await instRes.json();
      setInstitution(instData);

      // Fetch exams for this institution
      const examsRes = await fetch(`http://localhost:3001/api/exams?institutionId=${id}`, { headers });
      if (examsRes.ok) {
        const examsData = await examsRes.json();
        // Mark first 3 as free
        const examsWithFree = examsData.map((exam: Exam, index: number) => ({
          ...exam,
          isFree: index < 3 // First 3 exams are FREE
        }));
        setExams(examsWithFree);
      }

      // Check subscription
      if (token) {
        const statsRes = await fetch("http://localhost:3001/api/stats", { headers });
        if (statsRes.ok) {
          setHasSubscription(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleExamClick = (exam: Exam) => {
    // If exam is paid and user has no subscription, redirect to payment
    if (!exam.isFree && !hasSubscription) {
      router.push(`/pagamento?exam=${exam.id}`);
    } else {
      router.push(`/institutions/${id}/exames/${exam.id}`);
    }
  };

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

  if (error || !institution) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600">{error || "Instituição não encontrada"}</h1>
          <Link href="/home" className="btn btn-primary mt-4">
            Voltar às Instituições
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <Link href="/home" className="text-primary hover:underline mb-4 inline-block">
            ← Voltar às Instituições
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🏛️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{institution.name}</h1>
              <p className="text-gray-500">📍 {institution.city || "Moçambique"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Alert */}
      {!hasSubscription && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-4 py-4">
            <p className="text-amber-800 text-center">
              ⚠️ Você tem acesso apenas aos <strong>3 primeiros exames gratuitos</strong>. 
              Para acessar todos os exames, <Link href="/pagamento" className="underline font-semibold">faça uma assinatura</Link>.
            </p>
          </div>
        </div>
      )}

      {/* Exams List */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Exames Disponíveis ({exams.length})
        </h2>

        {exams.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
            <span className="text-6xl mb-4 block">📝</span>
            <p>Nenhum exame disponível para esta instituição ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam, index) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 cursor-pointer"
                onClick={() => handleExamClick(exam)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/10 rounded-lg px-3 py-1">
                    <span className="text-primary font-semibold text-sm">
                      {exam.subject?.name || "Geral"}
                    </span>
                  </div>
                  {exam.isFree ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      FREE
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                      💰 PAGO
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {exam.title}
                </h3>
                
                {exam.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {exam.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  {exam.year && <span>📅 {exam.year}</span>}
                  {exam.duration && <span>⏱️ {exam.duration} min</span>}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    exam.isFree || hasSubscription
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}>
                    {exam.isFree || hasSubscription ? "Fazer Exame" : "Assine para acessar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
