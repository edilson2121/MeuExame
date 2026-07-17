"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-between items-center bg-white px-6 py-10">
      <div className="hidden sm:block h-10" />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center">
        <div className="flex items-center justify-center w-24 h-24 bg-primary/10 rounded-3xl shadow-sm">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mt-6 text-gray-900 tracking-tight">
          MeuExame
        </h1>

        <p className="mt-3 text-gray-600 text-base leading-relaxed px-2">
          A sua plataforma completa de preparação para exames nacionais.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 mb-16">
        <Link href="/login" className="btn btn-primary btn-lg">
          Entrar
        </Link>

        <Link href="/register" className="btn btn-outline btn-lg">
          Criar Conta
        </Link>
      </div>

      <div className="w-full text-center text-sm text-gray-500">
        <p suppressHydrationWarning>
          {isMounted ? "Meu exame | 2026" : "Meu exame"}
        </p>
      </div>
    </main>
  );
}