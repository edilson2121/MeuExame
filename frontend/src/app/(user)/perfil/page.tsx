"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  plan: {
    name: string;
    price: number;
    duration: number;
  };
}

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setName(parsed.name || "");
      setPhone(parsed.phone || "");
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")!;
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user profile
      const userRes = await fetch("http://localhost:3001/api/auth/profile", { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        setName(userData.name || "");
        setPhone(userData.phone || "");
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Fetch subscription
      const subRes = await fetch("http://localhost:3001/api/subscriptions/me", { headers });
      if (subRes.ok) {
        setSubscription(await subRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token")!;
      const res = await fetch("http://localhost:3001/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setMessage({ type: "success", text: "✅ Perfil atualizado!" });
      } else {
        setMessage({ type: "error", text: "❌ Erro ao atualizar" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Erro de conexão" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-MZ");

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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold mb-8">Meu Perfil</h1>

        {/* Subscription Card */}
        {subscription?.status === "ACTIVE" ? (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">👑</span>
              <div>
                <div className="text-xl font-bold">{subscription.plan?.name}</div>
                <div className="text-white/80">Assinatura Ativa</div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Início: {formatDate(subscription.startDate)}</span>
              <span>Válido até: {formatDate(subscription.endDate)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-100 border border-amber-300 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl">⚠️</span>
              <div className="flex-1">
                <div className="font-bold text-amber-800">Sem assinatura premium</div>
                <div className="text-amber-700 text-sm">Acesse todos os exames com uma assinatura</div>
              </div>
              <Link href="/pagamento" className="bg-amber-500 text-white px-4 py-2 rounded-lg">
                Assinar
              </Link>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-lg mb-6">Informações Pessoais</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">Email não pode ser alterado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telemóvel</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="84XXXXXXXX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {message.text && (
              <div className={`p-3 rounded-xl ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {message.text}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full btn btn-primary"
            >
              {saving ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Informações da Conta</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo de Conta</span>
              <span className="font-medium">
                {user?.role === "ADMIN" ? "Administrador" : 
                 user?.role === "TEACHER" ? "Professor" : "Estudante"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Membro desde</span>
              <span className="font-medium">{formatDate(user?.createdAt || "")}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-medium hover:bg-red-100"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
