"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, FileQuestion, Award, Play, ChevronRight, Users, Building2, CheckCircle, Car } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <GraduationCap size={16} className="sm:w-[18px]" />
              Preparação Completa em Moçambique
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Prepare-se para <span className="text-primary">Exames de Condução</span> e Mais
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              A sua plataforma completa de preparação. Pratique para exames de condução, 
              escolas profissionais, técnicos e muito mais em Moçambique.
            </p>
            
            <button 
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-green-200 w-full sm:w-auto justify-center"
            >
              {isAuthenticated ? (
                <>Ver Instituições <ChevronRight size={18} className="sm:w-[20px]" /></>
              ) : (
                <>Começar Grátis <ChevronRight size={18} className="sm:w-[20px]" /></>
              )}
            </button>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1">✓ Sem cartão de crédito</span>
              <span className="flex items-center gap-1">✓ Acesso imediato</span>
              <span className="flex items-center gap-1">✓ Exames gratuitos</span>
            </div>
          </div>
        </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-green-600">10+</p>
              <p className="text-gray-500 mt-1">Instituições</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">500+</p>
              <p className="text-gray-500 mt-1">Exames</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">5000+</p>
              <p className="text-gray-500 mt-1">Questões</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">1000+</p>
              <p className="text-gray-500 mt-1">Estudantes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Tudo que você precisa para passar
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Car size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">Exames de Condução</h3>
              <p className="text-gray-600 text-center">
                Prepare-se para o exame teórico e prático de condução
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">Escolas Profissionais</h3>
              <p className="text-gray-600 text-center">
                Exames para IFP, INEFP e outras escolas técnicas
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">Manuais de Estudo</h3>
              <p className="text-gray-600 text-center">
                Baixe manuais gratuitos para estudar offline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Como funciona
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Escolha seu Exame</h3>
              <p className="text-gray-500 text-sm">Selecione condução, escola técnica ou outra categoria</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Estude Manuais</h3>
              <p className="text-gray-500 text-sm">Baixe manuais e materiais de estudo gratuitos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pratique Exames</h3>
              <p className="text-gray-500 text-sm">Responda questões com tempo limitado</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Veja Resultados</h3>
              <p className="text-gray-500 text-sm">Confira pontuação e corrija erros</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Junte-se a milhares de pessoas que já estão se preparando para exames de condução e escolas profissionais em Moçambique
          </p>
          <button 
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            <Play size={20} />
            {isAuthenticated ? "Ver Exames" : "Criar Conta Grátis"}
          </button>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
