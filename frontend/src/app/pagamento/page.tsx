"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TransactionEmola from "@/components/payments/TransactionEmola";
import TransactionMpesa from "@/components/payments/TransactionMpesa";

export default function PagamentoPage() {
  const [method, setMethod] = useState<"emola" | "mpesa">("mpesa");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Escolha o Método de Pagamento
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Acesso total ao MeuExame por apenas 299 MZN
          </p>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setMethod("mpesa")}
              className={`p-6 rounded-xl border-2 transition-all ${
                method === "mpesa"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">M-Pesa</div>
                <div className="text-sm text-gray-600">84XXXXXXX ou 85XXXXXXX</div>
              </div>
            </button>

            <button
              onClick={() => setMethod("emola")}
              className={`p-6 rounded-xl border-2 transition-all ${
                method === "emola"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">E-Mola</div>
                <div className="text-sm text-gray-600">86XXXXXXX ou 87XXXXXXX</div>
              </div>
            </button>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {method === "mpesa" ? <TransactionMpesa /> : <TransactionEmola />}
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Precisa de ajuda? Contacte o suporte:
            </p>
            <p className="text-green-600 font-semibold mt-1">
              +258 84 05 07 462
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
