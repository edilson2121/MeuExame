"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  plan: {
    name: string;
    price: number;
  };
}

interface ExamResult {
  id: string;
  score: number;
  total: number;
  percentage: number;
  exam: {
    title: string;
  };
  createdAt: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentExams, setRecentExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ examsTaken: 0, averageScore: 0, passed: 0 });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) setUser(JSON.parse(userData));
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")!;
      const headers = { Authorization: `Bearer ${token}` };

      // Subscription
      const subRes = await fetch("http://localhost:3001/api/subscriptions/me", { headers });
      if (subRes.ok) setSubscription(await subRes.json());

      // Results
      const resRes = await fetch("http://localhost:3001/api/results/my", { headers });
      if (resRes.ok) {
        const data = await resRes.json();
        setRecentExams(data.slice(0, 5));
        if (data.length > 0) {
          const avg = data.reduce((acc: number, r: ExamResult) => acc + r.percentage, 0) / data.length;
          setStats({
            examsTaken: data.length,
            averageScore: Math.round(avg),
            passed: data.filter((r: ExamResult) => r.percentage >= 50).length,
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-MZ");
  const scoreColor = (pct: number) => pct >= 70 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <h1 className="text-2xl font-bold mb-1">
          Olá, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 mb-8">Seu progresso de estudos</p>

        {/* Subscription Alert */}
        {subscription?.status === "ACTIVE" ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-semibold text-green-800">Assinatura: {subscription.plan?.name}</div>
                <div className="text-sm text-green-600">Válido até {formatDate(subscription.endDate)}</div>
              </div>
            </div>
            <Link href="/pagamento" className="text-green-700 text-sm hover:underline">Renovar →</Link>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-semibold text-amber-800">Sem assinatura</div>
                <div className="text-sm text-amber-600">Apenas 3 exames gratuitos</div>
              </div>
            </div>
            <Link href="/pagamento" className="bg-amber-500 text-white px-4 py-2 rounded-lg">Assinar</Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-primary">{stats.examsTaken}</div>
            <div className="text-sm text-gray-500">Exames Feitos</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className={`text-3xl font-bold ${scoreColor(stats.averageScore)}`}>{stats.averageScore}%</div>
            <div className="text-sm text-gray-500">Média</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600">{stats.passed}</div>
            <div className="text-sm text-gray-500">Aprovados</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/home" className="bg-primary text-white rounded-xl p-6 hover:bg-primary/90">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📚</span>
              <div>
                <div className="font-bold text-lg">Ver Instituições</div>
                <div className="text-white/80 text-sm">Acessar exames</div>
              </div>
            </div>
          </Link>
          <Link href="/perfil" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
              <span className="text-4xl">👤</span>
              <div>
                <div className="font-bold text-lg text-gray-900">Meu Perfil</div>
                <div className="text-gray-500 text-sm">Editar informações</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Exams */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Exames Recentes</h2>
            <Link href="/home" className="text-primary text-sm hover:underline">Ver todos →</Link>
          </div>

          {recentExams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-5xl mb-4 block">📝</span>
              <p>Nenhum exame feito ainda</p>
              <Link href="/home" className="text-primary hover:underline">Começar →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExams.map((r) => (
                <div key={r.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium">{r.exam?.title || "Exame"}</div>
                    <div className="text-sm text-gray-500">{formatDate(r.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${scoreColor(r.percentage)}`}>{r.percentage.toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
