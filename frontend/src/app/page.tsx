"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
      router.push("/home");
    } else {
      router.push("/register");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">MeuExame</span>
          </div>
          {isAuthenticated ? (
            <div className="flex gap-3">
              <Link href="/home" className="btn btn-primary">
                Ver Instituições
              </Link>
              <Link href="/login" className="btn btn-outline">
                Login
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="btn btn-outline">
                Entrar
              </Link>
              <Link href="/register" className="btn btn-primary">
                Criar Conta Grátis
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Prepare-se para os seus <span className="text-primary">Exames Nacionais</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            A sua plataforma completa de preparação. Pratique com exames de instituições 
            de todo o Moçambique e aumente suas chances de aprovação.
          </p>
          
          <button onClick={handleStart} className="btn btn-primary btn-lg text-lg px-10">
            {isAuthenticated ? "Ver Instituições →" : "Começar Grátis →"}
          </button>
          
          <p className="mt-4 text-sm text-gray-500">
            ✓ Sem cartão de crédito  ✓ Acesso imediato  ✓ 3 exames gratuitos
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Tudo que você precisa para passar
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Múltiplas Instituições</h3>
              <p className="text-gray-600">
                Acesse exames de universidades e escolas de todo o país
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Simulados Realistas</h3>
              <p className="text-gray-600">
                Questões de anos anteriores com tempo limitado
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Resultados Imediatos</h3>
              <p className="text-gray-600">
                Veja sua pontuação e corrija erros imediatamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Planos Simples e Acessíveis
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Comece com acesso gratuito. Quando precisar de mais, escolha o plano ideal para você.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
              <h3 className="text-xl font-semibold mb-2">Grátis</h3>
              <div className="text-4xl font-bold mb-6">0 <span className="text-lg font-normal text-gray-500">MZN</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 3 exames gratuitos
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span>✗</span> Questões ilimitadas
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span>✗</span> Estatísticas avançadas
                </li>
              </ul>
              <button className="w-full btn btn-outline">Atualizar</button>
            </div>
            
            {/* Mensal */}
            <div className="bg-primary rounded-2xl p-8 shadow-lg text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Mensal</h3>
              <div className="text-4xl font-bold mb-6">750 <span className="text-lg font-normal opacity-80">MZN</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span>✓</span> Todos os exames
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Questões ilimitadas
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Estatísticas avançadas
                </li>
              </ul>
              <button className="w-full bg-white text-primary btn">Assinar</button>
            </div>
            
            {/* Anual */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
              <h3 className="text-xl font-semibold mb-2">Anual</h3>
              <div className="text-4xl font-bold mb-6">5000 <span className="text-lg font-normal text-gray-500">MZN</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Tudo do plano Mensal
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Economia de 4 meses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Prioridade no suporte
                </li>
              </ul>
              <button className="w-full btn btn-outline">Assinar</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-bold">MeuExame</span>
          </div>
          <p className="text-gray-400">
            {isMounted ? "© 2026 MeuExame - Todos os direitos reservados" : "© MeuExame"}
          </p>
        </div>
      </footer>
    </main>
  );
}