"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";

interface Institution {
  id: string;
  name: string;
  city?: string;
  country: string;
  isActive: boolean;
  _count?: {
    courses?: number;
  };
}

export default function UserHomePage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/institutions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erro ao carregar instituições");
      const data = await res.json();
      setInstitutions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const filteredInstitutions = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase()) ||
    inst.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Prepare-se para os seus Exames
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Acesse exames de instituições de todo o país
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Pesquisar instituição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Instituições Disponíveis
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredInstitutions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhuma instituição encontrada
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution) => (
              <Link
                key={institution.id}
                href={`/institutions/${institution.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {institution.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {institution.city || "Moçambique"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>📚 {institution._count?.courses || 0} cursos</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        institution.isActive 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {institution.isActive ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Escolha a Instituição</h3>
              <p className="text-gray-600">
                Selecione a instituição onde deseja prestar exame
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Pratique Exames</h3>
              <p className="text-gray-600">
                Faça simulados com questões de anos anteriores
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Acompanhe Resultados</h3>
              <p className="text-gray-600">
                Veja sua pontuação e melhore a cada tentativa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
