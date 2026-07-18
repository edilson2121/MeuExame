"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  // Garante que o HTML seja validado apenas após a montagem segura no navegador
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-between items-center bg-white px-6 py-10">
      
      {/* Elemento de preenchimento superior para equilibrar o layout */}
      <div className="hidden sm:block h-10" />

      {/* Conteúdo Principal (Logo, Título e Descrição) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center">
        
        {/* Container do Logo */}
        <div className="flex items-center justify-center w-24 h-24 bg-[#F8F9FA] rounded-3xl shadow-sm">
          <img
            src="/logo.png"
            alt="MeuExame Logo"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold mt-6 text-black tracking-tight">
          MeuExame
        </h1>

        {/* Descrição */}
        <p className="mt-3 text-[#333333] text-base leading-relaxed px-2">
          A sua plataforma completa de preparação para exames nacionais.
        </p>
      </div>

      {/* Seção de Links/Botões */}
      <div className="w-full max-w-sm flex flex-col gap-3 mb-16">
        
       {/* Opção Entrar */}
<Link 
  href="/login" 
  className="w-full bg-[#10A63D] text-white py-3.5 px-5 rounded-xl font-medium text-base text-center hover:bg-[#0e9135] transition-colors block"
>
  Entrar
</Link>

        {/* Opção Criar Conta */}
        <Link 
          href="/register" 
          className="w-full bg-white text-black border-2 border-black py-3.5 px-5 rounded-xl font-medium text-base text-center hover:bg-gray-50 transition-colors block"
        >
          Criar Conta
        </Link>
        
      </div>

      {/* Rodapé Protegido contra Erros de Hidratação */}
      <div className="w-full text-center text-sm text-[#333333]">
        <p suppressHydrationWarning>
          {isMounted ? "Meu exame | 2026" : "Meu exame"}
        </p>
      </div>

    </main>
  );
}