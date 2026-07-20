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
  Loader2,
  AlertCircle,
  Wallet,
  Banknote,
} from 'lucide-react';

type PaymentMethod = 'MPESA' | 'EMOLA' | 'DEBITPAY';
type PaymentStatus = 'idle' | 'processing' | 'pending' | 'completed' | 'failed';

interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  shortName: string;
  description: string;
  operator: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  instructions: string[];
  phonePrefixes: string[];
}

const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'MPESA',
    name: 'M-Pesa',
    shortName: 'M-Pesa',
    description: 'Vodacom',
    operator: 'Vodacom M-Pesa',
    icon: <Smartphone size={32} />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    instructions: [
      'Receberá um código USSD no seu telemóvel',
      'Digite o código no seu telemóvel',
      'Confirme a transação com o seu PIN M-Pesa',
    ],
    phonePrefixes: ['84', '85'],
  },
  {
    id: 'EMOLA',
    name: 'eMola',
    shortName: 'eMola',
    description: 'Movitel',
    operator: 'Movitel eMola',
    icon: <Smartphone size={32} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    instructions: [
      'Receberá uma notificação no seu telemóvel',
      'Aprovar a transação na app eMola',
      'Digite o seu PIN eMola para confirmar',
    ],
    phonePrefixes: ['86', '87'],
  },
  {
    id: 'DEBITPAY',
    name: 'DebitPay',
    shortName: 'DebitPay',
    description: 'Carteira Digital',
    operator: 'DebitPay',
    icon: <Wallet size={32} />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    instructions: [
      'Aguarde o código de pagamento',
      'Copie o código e pague na app DebitPay',
      'A confirmação é automática em segundos',
    ],
    phonePrefixes: ['84', '85', '86', '87'],
  },
];

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
  const [showInstructions, setShowInstructions] = useState(false);

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

  const getSelectedMethodInfo = () => {
    return PAYMENT_METHODS.find((m) => m.id === method);
  };

  const validatePhone = (phoneNumber: string, methodType: PaymentMethod) => {
    const methodInfo = PAYMENT_METHODS.find((m) => m.id === methodType);
    if (!methodInfo) return false;
    return methodInfo.phonePrefixes.some((prefix) => phoneNumber.startsWith(prefix));
  };

  const initiatePayment = async () => {
    if (!method || !phone) {
      setError('Por favor, selecione o método de pagamento e insira o número de telefone.');
      return;
    }

    if (!validatePhone(phone, method)) {
      const methodInfo = getSelectedMethodInfo();
      setError(`Número inválido para ${methodInfo?.name}. Use: ${methodInfo?.phonePrefixes.join(', ')}XXXXXXX`);
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
          phone: `258${phone}`,
          amount: exam?.price || 0,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setInstructionId(data.instructionId);
        setStatus('pending');
        setShowInstructions(true);

        const pollInterval = setInterval(async () => {
          const completed = await checkPaymentStatus(data.instructionId);
          if (completed) {
            clearInterval(pollInterval);
          }
        }, 5000);

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
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Escolha o Método de Pagamento</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => {
                    setMethod(pm.id);
                    setPhone('');
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    method === pm.id
                      ? `border-${pm.color.split('-')[1]}-600 bg-${pm.bgColor.split('-')[1]}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: method === pm.id ? (pm.color === 'text-green-600' ? '#16a34a' : pm.color === 'text-blue-600' ? '#2563eb' : '#9333ea') : undefined,
                    backgroundColor: method === pm.id ? (pm.color === 'text-green-600' ? '#f0fdf4' : pm.color === 'text-blue-600' ? '#eff6ff' : '#faf5ff') : undefined,
                  }}
                >
                  <div className={`w-14 h-14 ${pm.bgColor} rounded-xl flex items-center justify-center`} style={{ color: pm.color === 'text-green-600' ? '#16a34a' : pm.color === 'text-blue-600' ? '#2563eb' : '#9333ea' }}>
                    {pm.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-900">{pm.name}</p>
                    <p className="text-sm text-gray-500">{pm.description}</p>
                  </div>
                  {method === pm.id && (
                    <CheckCircle size={24} className="text-green-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Selected Method Instructions */}
            {method && getSelectedMethodInfo() && (
              <div className={`${getSelectedMethodInfo()?.bgColor} rounded-xl p-4 mb-6`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={getSelectedMethodInfo()?.color}>{getSelectedMethodInfo()?.icon}</span>
                  <span className="font-semibold text-gray-900">Como pagar com {getSelectedMethodInfo()?.name}</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  {getSelectedMethodInfo()?.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`${getSelectedMethodInfo()?.color} font-bold`}>{idx + 1}.</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Phone Number */}
            {method && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Telefone {getSelectedMethodInfo()?.name}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+258</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder={getSelectedMethodInfo()?.phonePrefixes[0] + 'XXXXXXX'}
                    maxLength={9}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Prefixo: {getSelectedMethodInfo()?.phonePrefixes.join(', ')} • Ex: {getSelectedMethodInfo()?.phonePrefixes[0]}XXXXXXX
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total a pagar:</p>
                  <p className="text-xs text-green-600">{exam.title}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-green-600">{exam.price}</span>
                  <p className="text-sm text-green-600 font-medium">MZN</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={initiatePayment}
              disabled={!method || phone.length < 8 || loading}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  A processar pagamento...
                </>
              ) : (
                <>
                  <Banknote size={24} />
                  Pagar {exam.price} MZN
                </>
              )}
            </button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Pagamento seguro via carteira móvel
            </div>
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
