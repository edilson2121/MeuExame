"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, FileQuestion, Award, Play, ChevronRight, Users, Building2, CheckCircle, Menu, X, Clock, Target, TrendingUp } from "lucide-react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsMounted(true);
  }, []);

  const handleStart = () => {
    if (isAuthenticated) {
      router.push("/home");
    } else {
      router.push("/register");
    }
  };

  const plans = [
    {
      name: "Diário",
      price: "50MT",
      period: "/dia",
      features: ["Acesso a 1 exame", "Correção detalhada"],
      popular: false,
    },
    {
      name: "Semanal",
      price: "200MT",
      period: "/semana",
      features: ["Todos os exames", "Simulados ilimitados", "Progresso semanal"],
      popular: false,
    },
    {
      name: "Mensal",
      price: "500MT",
      period: "/mês",
      features: ["Acesso total", "Todos os cursos", "Correções e explicações", "Prioridade no suporte"],
      popular: true,
    },
  ];

  const institutions = [
    { name: "UEM", city: "Maputo", abbr: "UEM" },
    { name: "UPM", city: "Maputo", abbr: "UPM" },
    { name: "ISPU", city: "Quelimane", abbr: "ISPU" },
    { name: "UniLúrio", city: "Nampula", abbr: "UL" },
    { name: "ISUTC", city: "Maputo", abbr: "ISUTC" },
    { name: "APolitécnica", city: "Maputo", abbr: "AP" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              <span className="font-bold text-xl text-gray-900">MeuExame</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/home" className="text-gray-600 hover:text-green-600 font-medium">Dashboard</Link>
              <Link href="/instituicoes" className="text-gray-600 hover:text-green-600 font-medium">Instituições</Link>
              <Link href="/#planos" className="text-gray-600 hover:text-green-600 font-medium">Planos</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium">Entrar</Link>
              <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Criar conta
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <Link href="/home" className="block text-gray-600 font-medium py-2">Dashboard</Link>
            <Link href="/instituicoes" className="block text-gray-600 font-medium py-2">Instituições</Link>
            <Link href="/#planos" className="block text-gray-600 font-medium py-2">Planos</Link>
            <Link href="/login" className="block text-gray-600 font-medium py-2">Entrar</Link>
            <Link href="/register" className="block bg-green-600 text-white text-center px-4 py-2 rounded-lg font-medium">
              Criar conta
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Passa no exame da UEM, com estudo que faz sentido.
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                  Aulas, simulados oficiais e correções explicadas — pensado para o estudante moçambicano. Sem enrolação, sem promessas vazias.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button 
                    onClick={handleStart}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Começar grátis
                    <ChevronRight size={18} />
                  </button>
                  <Link 
                    href="/instituicoes"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Ver instituições
                  </Link>
                </div>
              </div>

              {/* Simulated Exam Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
                  <span className="text-white font-medium">Simulado ao vivo</span>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock size={16} />
                    <span className="text-sm">42:18</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">Se f(x) = 2x² − 3x + 1, qual o valor de f(2)?</p>
                  <div className="space-y-2 mb-4">
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors">
                      A. 3
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors">
                      B. 5
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors">
                      C. 7
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors">
                      D. 9
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Questão 3 de 30</span>
                    <span className="text-gray-500">UEM · Matemática · 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-4xl font-bold text-green-600">12k+</p>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Estudantes</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-bold text-green-600">94%</p>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Aprovação média</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-bold text-green-600">40+</p>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Cursos cobertos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Instituições cobertas
          </h2>
          <p className="text-center text-gray-500 mb-8">Exames oficiais e simulados atualizados.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {institutions.map((inst, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-green-500 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-700 font-bold text-sm">{inst.abbr}</span>
                </div>
                <p className="font-medium text-gray-900">{inst.name}</p>
                <p className="text-xs text-gray-500">{inst.city}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/instituicoes" className="text-green-600 font-medium hover:underline">
              Ver todas →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
            Como o MeuExame funciona
          </h2>
          <p className="text-center text-gray-500 mb-12">Um caminho claro: estuda, treina, revisa e passa.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Estuda com aulas curtas</h3>
              <p className="text-gray-600 text-sm">
                Vídeos, PDFs e resumos organizados por disciplina e por instituição.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileQuestion size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Treina com simulados reais</h3>
              <p className="text-gray-600 text-sm">
                Exames com tempo cronometrado, no formato oficial.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Acompanha o teu progresso</h3>
              <p className="text-gray-600 text-sm">
                Recomendações personalizadas com base nos teus erros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
            Planos simples
          </h2>
          <p className="text-center text-gray-500 mb-12">Sem contratos. Cancela quando quiseres.</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border ${plan.popular ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200'}`}>
                {plan.popular && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    Mais escolhido
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.popular 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Escolher {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-green-100 mb-8">
            Cria uma conta grátis, faz um simulado hoje e descobre onde precisas melhorar.
          </p>
          <button 
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Criar conta grátis
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2026 MeuExame · Feito em Moçambique
          </p>
        </div>
      </footer>
    </div>
  );
}
