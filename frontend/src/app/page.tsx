"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AcademicCapIcon, BookOpenIcon, CheckCircleIcon, ArrowRightIcon, PlayIcon, ClockIcon, ChartBarIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsMounted(true);
  }, []);

  const handleStart = () => {
    if (isAuthenticated) {
      router.push("/instituicoes");
    } else {
      router.push("/register");
    }
  };

  const quickStart = () => {
    router.push("/instituicoes");
  };

  const institutions = [
    { name: "UEM", city: "Maputo", icon: "🎓" },
    { name: "ISUTC", city: "Maputo", icon: "🚗" },
    { name: "ISPU", city: "Quelimane", icon: "📚" },
    { name: "UniLúrio", city: "Nampula", icon: "🏛️" },
    { name: "UPM", city: "Maputo", icon: "⛪" },
    { name: "APolitécnica", city: "Maputo", icon: "🔧" },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Navigation Simplificada */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-green-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">MeuExame</span>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={quickStart}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <BookOpenIcon className="w-5 h-5" />
                  Estudar Agora
                </button>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2.5 text-gray-700 hover:text-green-600 font-medium transition-colors">
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Começar Grátis
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section Simplificada */}
        <section className="py-12 sm:py-20 lg:py-28 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
                  <span className="text-green-700 font-semibold text-sm">🎯 Plataforma #1 em Moçambique</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Passa no exame da <span className="text-green-600">UEM</span> estudando de forma inteligente
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Simulados oficiais, explicações detalhadas e preparação focada. Estude no seu ritmo, onde e quando quiser.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <PlayIcon className="w-6 h-6" />
                    Começar Agora
                  </button>
                  <button
                    onClick={quickStart}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-green-200 text-gray-700 rounded-2xl font-semibold hover:border-green-400 hover:bg-green-50 transition-all"
                  >
                    <BookOpenIcon className="w-6 h-6" />
                    Ver Instituições
                  </button>
                </div>

                {/* Stats Simplificadas */}
                <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">12k+</p>
                    <p className="text-gray-500 text-sm">Estudantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">94%</p>
                    <p className="text-gray-500 text-sm">Aprovação</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">40+</p>
                    <p className="text-gray-500 text-sm">Instituições</p>
                  </div>
                </div>
              </div>

              {/* Interactive Preview */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <PlayIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Simulado Matemática UEM</p>
                        <p className="text-green-100 text-sm">Questão 3 de 30</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <ClockIcon className="w-5 h-5" />
                      <span className="font-mono text-lg">42:18</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 font-medium mb-4">Se f(x) = 2x² − 3x + 1, qual o valor de f(2)?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left font-medium">
                        A. 3
                      </button>
                      <button className="p-4 rounded-xl border-2 border-green-500 bg-green-50 text-left font-medium">
                        B. 5 ✓
                      </button>
                      <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left font-medium">
                        C. 7
                      </button>
                      <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left font-medium">
                        D. 9
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Institutions */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Escolha sua Instituição</h2>
              <p className="text-gray-600">Comece a estudar em 3 cliques simples</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {institutions.map((inst) => (
                <button
                  key={inst.name}
                  onClick={quickStart}
                  className="group bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-green-300"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{inst.icon}</div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{inst.name}</p>
                  <p className="text-gray-500 text-xs">{inst.city}</p>
                </button>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={quickStart}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                Ver Todas as Instituições
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* How It Works - Simplified */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Como Funciona</h2>
              <p className="text-gray-600">Simples, rápido e eficiente</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Escolha a Instituição</h3>
                <p className="text-gray-600">Selecione sua universidade entre as opções disponíveis</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Selecione a Disciplina</h3>
                <p className="text-gray-600">Escolha a matéria que deseja estudar</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comece a Estudar</h3>
                <p className="text-gray-600">Realize simulados e veja seu progresso</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Visual & Clean */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Por que o MeuExame?</h2>
              <p className="text-gray-600">A escolha inteligente para sua preparação</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Exames Oficiais</h3>
                <p className="text-gray-600">Conteúdo real das universidades moçambicanas</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <ChartBarIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Acompanhamento</h3>
                <p className="text-gray-600">Acompanhe seu progresso em tempo real</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <UserGroupIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidade</h3>
                <p className="text-gray-600">Estude com milhares de outros estudantes</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Green Theme */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comece a estudar hoje mesmo
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              Junte-se a mais de 12.000 estudantes que já estão conquistando seus objetivos
            </p>
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-green-600 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <PlayIcon className="w-6 h-6" />
              Começar Gratuitamente
            </button>
          </div>
        </section>
      </main>

      {/* Footer Simplificado */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">MeuExame</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 MeuExame. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
