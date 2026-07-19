'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';

type PaymentMethod = 'MPESA' | 'EMOLA';
type PaymentStatus = 'idle' | 'processing' | 'pending' | 'completed' | 'failed';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<any>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [instructionId, setInstructionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${apiUrl}/exams/${examId}`);
        if (res.ok) {
          const data = await res.json();
          setExam(data);
        }
      } catch (err) {
        console.error('Erro ao carregar exame:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const checkPaymentStatus = useCallback(async (instId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/payments/status/${instId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'COMPLETED') {
          setStatus('completed');
          // Redirecionar para o exame após 2 segundos
          setTimeout(() => {
            router.push(`/exames/${examId}`);
          }, 2000);
          return true;
        } else if (data.status === 'FAILED') {
          setStatus('failed');
          setError('Pagamento recusado. Tente novamente.');
          return true;
        }
      }
    } catch (err) {
      console.error('Erro ao verificar status:', err);
    }
    return false;
  }, [examId, router]);

  const initiatePayment = async () => {
    if (!method || !phone) {
      setError('Por favor, selecione o método de pagamento e insira o número de telefone.');
      return;
    }

    // Validar número de telefone moçambicano
    const phoneRegex = /^(84|85|86|87)\d{7}$/;
    if (!phoneRegex.test(phone)) {
      setError('Número de telefone inválido. Use o formato: 84XXXXXXX ou 85XXXXXXX');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus('processing');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');

      const res = await fetch(`${apiUrl}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          examId,
          method,
          phone,
          amount: exam?.price || 0,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setInstructionId(data.instructionId);
        setStatus('pending');

        // Verificar status periodicamente (polling)
        const pollInterval = setInterval(async () => {
          const completed = await checkPaymentStatus(data.instructionId);
          if (completed) {
            clearInterval(pollInterval);
          }
        }, 5000);

        // Timeout após 5 minutos
        setTimeout(() => {
          clearInterval(pollInterval);
          if (status === 'pending') {
            setError('Tempo limite excedido. Verifique o status do pagamento mais tarde.');
          }
        }, 300000);
      } else {
        setStatus('failed');
        setError(data.message || 'Erro ao iniciar pagamento. Tente novamente.');
      }
    } catch (err) {
      setStatus('failed');
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto text-green-600" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500" />
          <p className="mt-4 text-gray-600">Exame não encontrado</p>
          <Link href="/instituicoes" className="text-green-600 hover:underline mt-2 inline-block">
            Voltar às instituições
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showBackButton backHref={`/disciplinas/${exam?.discipline?.id}`} />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Exam Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{exam.discipline?.name}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">{exam.price} MZN</span>
            <span className="text-sm text-gray-500">Acesso ao exame</span>
          </div>
        </div>

        {/* Status Messages */}
        {status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
            <CheckCircle size={48} className="mx-auto text-green-600" />
            <h2 className="text-xl font-bold text-green-700 mt-4">Pagamento Confirmado!</h2>
            <p className="text-green-600 mt-2">Aguarde, redirecionando para o exame...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
            <XCircle size={48} className="mx-auto text-red-600" />
            <h2 className="text-xl font-bold text-red-700 mt-4">Pagamento Falhou</h2>
            <p className="text-red-600 mt-2">{error || 'Tente novamente.'}</p>
            <button
              onClick={() => {
                setStatus('idle');
                setError(null);
                setInstructionId(null);
              }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-center">
            <Clock size={48} className="mx-auto text-yellow-600 animate-pulse" />
            <h2 className="text-xl font-bold text-yellow-700 mt-4">Aguardando Confirmação</h2>
            <p className="text-yellow-600 mt-2">
              Aguarde a confirmação do pagamento no seu telemóvel.
            </p>
            <p className="text-sm text-yellow-500 mt-4">
              Número: {phone} | Método: {method === 'MPESA' ? 'M-Pesa' : 'eMola'}
            </p>
            <div className="mt-4 flex justify-center">
              <Loader2 size={24} className="animate-spin text-yellow-600" />
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-center">
            <Loader2 size={48} className="mx-auto text-blue-600 animate-spin" />
            <h2 className="text-xl font-bold text-blue-700 mt-4">A Processar...</h2>
            <p className="text-blue-600 mt-2">Initiando transação de pagamento.</p>
          </div>
        )}

        {/* Payment Form */}
        {(status === 'idle' || status === 'failed') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Método de Pagamento</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Payment Methods */}
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setMethod('MPESA')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  method === 'MPESA'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <Smartphone size={32} className="text-green-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">M-Pesa</p>
                  <p className="text-sm text-gray-500">Vodacom</p>
                </div>
                {method === 'MPESA' && <CheckCircle size={24} className="text-green-600" />}
              </button>

              <button
                onClick={() => setMethod('EMOLA')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  method === 'EMOLA'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Smartphone size={32} className="text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">eMola</p>
                  <p className="text-sm text-gray-500">Movitel</p>
                </div>
                {method === 'EMOLA' && <CheckCircle size={24} className="text-green-600" />}
              </button>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Telefone
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+258</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="84XXXXXXX"
                  maxLength={9}
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Insira o número sem o código do país. Ex: 84XXXXXXX
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="text-2xl font-bold text-green-600">{exam.price} MZN</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={initiatePayment}
              disabled={!method || !phone || loading}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  A processar...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Pagar {exam.price} MZN
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao clicar em "Pagar", você concorda com os termos e condições.
            </p>
          </div>
        )}

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Problemas com o pagamento?{' '}
            <Link href="/ajuda" className="text-green-600 hover:underline">
              Entre em contacto
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
