"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const TransactionEmola = () => {
  const [numeroTelefone, setNumeroTelefone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "cancel" | "pending" | null;
    title: string;
    message: string;
    transactionId?: string;
  }>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 9) return cleaned;
    return cleaned.slice(0, 9);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setNumeroTelefone(formatted);
  };

  const showModal = (type: "success" | "error" | "cancel" | "pending", title: string, message: string, transactionId?: string) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      transactionId,
    });
  };

  const closeModal = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setCurrentTransactionId(null);
    setModal({ isOpen: false, type: null, title: "", message: "" });
    
    if (modal.type === "success") {
      router.push("/exames");
    }
  };

  const startPollingStatus = (transactionId: string) => {
    let attempts = 0;
    const maxAttempts = 30;
    
    const interval = setInterval(async () => {
      attempts++;
      console.log(`🔍 [E-Mola] Verificando status (tentativa ${attempts}/${maxAttempts})...`);
      
      try {
        const response = await axios.get(`/api/payments?reference=${transactionId}`);
        
        console.log(`📊 [E-Mola] Status:`, response.data);
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          setPollingInterval(null);
          showModal(
            "success",
            "✓ Pagamento Confirmado!",
            "Seu pagamento via E-Mola foi confirmado! O acesso total ao MeuExame.com foi liberado.",
            transactionId
          );
        } 
        else if (response.data.status === 'cancelled') {
          clearInterval(interval);
          setPollingInterval(null);
          showModal(
            "cancel",
            "✗ Pagamento Cancelado",
            "O pagamento foi cancelado. Nenhum valor foi cobrado da sua conta.",
            transactionId
          );
        }
        else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPollingInterval(null);
          showModal(
            "error",
            "⏰ Tempo Excedido",
            "Tempo limite excedido. Você não confirmou o pagamento a tempo. Nenhum valor foi cobrado.",
            transactionId
          );
        }
        
      } catch (error) {
        console.error("❌ [E-Mola] Erro no polling:", error);
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPollingInterval(null);
        }
      }
    }, 10000);
    
    setPollingInterval(interval);
  };

  const handlePagamento = async () => {
    if (!numeroTelefone || numeroTelefone.length < 9) {
      showModal("error", "Número Inválido", "Por favor, digite um número de telefone válido com 9 dígitos (ex: 86XXXXXXX)");
      return;
    }

    const prefixo = numeroTelefone.substring(0, 2);
    if (prefixo !== "86" && prefixo !== "87") {
      showModal("error", "Número E-Mola Inválido", "O número deve começar com 86 ou 87.\n\nExemplo: 86 123 4567 ou 87 123 4567");
      return;
    }

    setIsLoading(true);
    setModal(prev => ({ ...prev, isOpen: false }));

    try {
      const response = await axios.post("/api/payments", { 
        numeroTelefone, 
        method: "emola",
        amount: 299 
      });
      
      console.log("📱 [E-Mola] Resposta:", response.data);
      
      if (response.data.confirmed === true) {
        showModal(
          "success",
          "✓ Pagamento Confirmado",
          "Seu pagamento via E-Mola foi processado com sucesso! O acesso total ao MeuExame.com foi liberado.",
          response.data.transactionId
        );
      }
      else if (response.data.pending === true || response.data.awaiting_confirmation === true) {
        const transId = response.data.transactionId;
        setCurrentTransactionId(transId);
        
        showModal(
          "pending",
          "⏳ Pagamento Pendente",
          `Solicitação enviada para o número ${numeroTelefone}\n\n📌 *Instruções:*\n1. Verifique seu celular E-Mola\n2. Digite sua senha\n3. Confirme o valor de 299 MZN\n\n✅ O acesso será liberado automaticamente após confirmação.\n⏰ Você tem 5 minutos para confirmar.`,
          transId
        );
        
        startPollingStatus(transId);
      }
      
    } catch (err: any) {
      const errorData = err.response?.data;
      const isCancelled = errorData?.cancelled === true;
      const errorMsg = errorData?.message || err.message || "Erro ao realizar a transação";
      
      console.log("❌ [E-Mola] Erro:", errorData);
      
      if (isCancelled) {
        showModal(
          "cancel",
          "✗ Operação Cancelada",
          "Você cancelou a operação no seu celular E-Mola. Nenhum valor foi cobrado da sua conta."
        );
      }
      else if (errorMsg.toLowerCase().includes("saldo") || 
          errorMsg.toLowerCase().includes("balance") || 
          errorMsg.toLowerCase().includes("insufficient")) {
        showModal(
          "error",
          "💰 Saldo Insuficiente",
          `Seu saldo E-Mola é insuficiente para completar esta transação de 299 MZN.\n\nRecarregue sua conta e tente novamente.` 
        );
      }
      else if (errorMsg.toLowerCase().includes("timeout") || errorMsg.toLowerCase().includes("tempo")) {
        showModal(
          "error",
          "⏰ Tempo Excedido",
          "A operação demorou muito tempo. Verifique sua conexão e tente novamente."
        );
      }
      else if (errorMsg.toLowerCase().includes("inválido") || errorMsg.toLowerCase().includes("invalid")) {
        showModal(
          "error",
          "📱 Número Inválido",
          "O número informado não é válido ou não está registrado no E-Mola."
        );
      }
      else {
        showModal(
          "error",
          "❌ Falha no Pagamento",
          errorMsg
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <h1 className="text-xl font-bold mb-4 text-gray-900">Pagar via E-Mola</h1>

      <div className="w-full max-w-md">
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
          EX: 86XXXXXXX ou 87XXXXXXX
        </label>
        <input
          type="tel"
          id="telefone"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="86XXXXXXX"
          value={numeroTelefone}
          onChange={handlePhoneChange}
          maxLength={9}
        />
        <p className="text-red-600 mt-2 text-sm">
          * Digite o seu número de telefone E-Mola e clique em pagar agora!
        </p>
      </div>

      {isLoading && (
        <div className="mt-4 w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700 text-sm">Processando pagamento...</p>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`mt-6 w-full max-w-md flex items-center justify-center px-4 py-3 ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        } text-white font-semibold rounded-lg shadow-md transition-all duration-300`}
        onClick={handlePagamento}
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Pagar Agora"}
      </button>

      <p className="text-black font-semibold mt-4">Valor: 299 MZN</p>
      <p className="text-gray-500 text-sm">
        Suporte: <strong className="text-green-600">+258 84 05 07 462</strong>
      </p>

      {/* MODAL DE SUCESSO */}
      {modal.isOpen && modal.type === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md text-center overflow-hidden">
            <div className="bg-green-500 p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h3>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{modal.message}</p>
              {modal.transactionId && (
                <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded mb-4">
                  ID: {modal.transactionId}
                </p>
              )}
              <button
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                onClick={closeModal}
              >
                Continuar para os Exames
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PENDENTE */}
      {modal.isOpen && modal.type === "pending" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md text-center overflow-hidden">
            <div className="bg-yellow-500 p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h3>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{modal.message}</p>
              {modal.transactionId && (
                <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded mb-4">
                  Referência: {modal.transactionId}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                  onClick={closeModal}
                >
                  Fechar
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
                  onClick={() => {
                    setModal(prev => ({ ...prev, isOpen: false }));
                  }}
                >
                  OK, Entendi
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                ⏳ O acesso será liberado automaticamente após confirmação no seu celular.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ERRO */}
      {modal.isOpen && modal.type === "error" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md text-center overflow-hidden">
            <div className="bg-red-500 p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h3>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{modal.message}</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                  onClick={closeModal}
                >
                  Fechar
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                  onClick={() => {
                    closeModal();
                    setTimeout(() => handlePagamento(), 100);
                  }}
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CANCELAMENTO */}
      {modal.isOpen && modal.type === "cancel" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md text-center overflow-hidden">
            <div className="bg-orange-500 p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h3>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{modal.message}</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                  onClick={closeModal}
                >
                  Fechar
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                  onClick={() => {
                    closeModal();
                    setTimeout(() => handlePagamento(), 100);
                  }}
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionEmola;
