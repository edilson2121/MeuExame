"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  type: string;
}

export default function PaymentPage() {
  const router = useRouter();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [phonePrefix, setPhonePrefix] = useState("84");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await fetch("http://localhost:3001/api/plans", { headers: headers as Record<string, string> });
      if (res.ok) {
        const data = await res.json();
        const premiumPlans = data.filter((p: Plan) => p.type !== "DAILY");
        setPlans(premiumPlans);
        if (premiumPlans.length > 0) {
          setSelectedPlan(premiumPlans[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const fullPhone = `${phonePrefix}${phoneNumber}`;
    
    if (phoneNumber.length < 9) {
      setStatus("error");
      setMessage("Número inválido. Digite 9 dígitos.");
      return;
    }

    setProcessing(true);
    setStatus("pending");
    setMessage("A processar pagamento via M-Pesa...");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        } as Record<string, string>,
        body: JSON.stringify({
          planId: selectedPlan,
          phoneNumber: fullPhone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(`✅ Pedido criado!\n\nID: ${data.transactionId}\n\nAguarde SMS no ${fullPhone}\nConfirme no seu M-Pesa`);
        
        // Poll for payment status
        setTimeout(() => checkPayment(data.paymentId), 5000);
      } else {
        setStatus("error");
        setMessage(data.message || "Erro ao criar pagamento");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Erro de conexão");
    } finally {
      setProcessing(false);
    }
  };

  const checkPayment = async (paymentId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/payments/${paymentId}`, {
        headers: (token ? { Authorization: `Bearer ${token}` } : {}) as Record<string, string>,
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.status === "APPROVED") {
          setMessage("🎉 Pagamento aprovado!\n\nSua assinatura está ativa!");
          setTimeout(() => router.push("/home"), 2000);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <button 
          onClick={() => router.back()} 
          className="text-gray-500 hover:text-gray-700 mb-6"
        >
          ← Voltar
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💳</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Assinatura Premium</h1>
          <p className="text-gray-600 mt-2">Acesse todos os exames</p>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Escolha seu plano:</h2>
          
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{plan.price} MZN</div>
                    {selectedPlan === plan.id && (
                      <span className="text-xs text-primary">✓ Selecionado</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Number */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Número M-Pesa:</h2>
          
          <div className="flex gap-2">
            <select 
              value={phonePrefix}
              onChange={(e) => setPhonePrefix(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
            >
              <option value="84">84 +</option>
              <option value="85">85 +</option>
              <option value="82">82 +</option>
              <option value="86">86 +</option>
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="XXXXXXXXX"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={9}
            />
          </div>
        </div>

        {/* Status */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-center whitespace-pre-line ${
            status === "success" ? "bg-green-100 text-green-800" :
            status === "error" ? "bg-red-100 text-red-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {message}
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing || phoneNumber.length < 9}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processando...
            </span>
          ) : (
            `Pagar ${selectedPlanData?.price || 0} MZN via M-Pesa`
          )}
        </button>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-blue-800 mb-3">📱 Como funciona:</h3>
          <ol className="text-sm text-blue-700 space-y-2">
            <li>1. Escolha o plano</li>
            <li>2. Digite seu número M-Pesa</li>
            <li>3. Clique em Pagar</li>
            <li>4. Receba um SMS no telemóvel</li>
            <li>5. Confirme no M-Pesa</li>
            <li>6. Assinatura ativada automaticamente!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
