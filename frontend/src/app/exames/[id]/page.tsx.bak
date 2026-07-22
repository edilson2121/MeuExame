'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Users,
  FileQuestion,
  CheckCircle,
  Star,
  Share2,
  Bookmark,
  Play,
  CreditCard,
  Shield,
  Lock,
  ChevronRight,
  Check,
  BookOpen,
  Award,
  TrendingUp,
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  institution: string;
  course: string;
  subject: string;
  description: string;
  duration: number;
  questions: number;
  students: number;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number;
  passingScore: number;
  attempts: number;
  isPaid: boolean;
  isPublished: boolean;
  features: string[];
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  curriculum: {
    title: string;
    lessons: number;
    completed: boolean;
  }[];
}

const exam: Exam = {
  id: '1',
  title: 'Matemática UEM 2024',
  institution: 'Universidade Eduardo Mondlane',
  course: 'Ciências Exatas',
  subject: 'Matemática',
  description: 'Exame abrangente de matemática cobrindo álgebra, geometria, trigonometria e cálculo. Perfeito para estudantes que desejam testar seus conhecimentos e preparação para os exames finais.',
  duration: 90,
  questions: 50,
  students: 1245,
  rating: 4.8,
  reviews: 234,
  price: 299,
  oldPrice: 499,
  passingScore: 70,
  attempts: 3,
  isPaid: true,
  isPublished: true,
  features: [
    '50 questões de múltipla escolha',
    'Tempo limite de 90 minutos',
    '3 tentativas permitidas',
    'Certificado de conclusão',
    'Resolução detalhada após término',
    'Suporte a M-Pesa e e-Mola',
  ],
  instructor: {
    name: 'Prof. António Matsinhe',
    avatar: 'AM',
    bio: 'Doutor em Matemática pela UEM com 15 anos de experiência em ensino superior.',
  },
  curriculum: [
    { title: 'Álgebra Linear', lessons: 12, completed: true },
    { title: 'Cálculo Diferencial', lessons: 15, completed: true },
    { title: 'Geometria Analítica', lessons: 10, completed: false },
    { title: 'Trigonometria', lessons: 8, completed: false },
  ],
};

export default function ExamDetailsPage() {
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState('');

  const handlePayment = async () => {
    if (!phone) {
      alert('Por favor, insira o seu número de telefone');
      return;
    }
    
    setIsProcessing(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      alert('Pagamento iniciado! Aguarde a confirmação no seu telemóvel.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/exames" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#10A63D] to-[#0e9135] text-white px-3 py-1.5 rounded-xl font-bold text-lg">
                  ME
                </div>
                <span className="text-sm text-gray-500">MeuExame</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Bookmark size={20} className="text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Share2 size={20} className="text-gray-500" />
              </button>
              <Link href="/login" className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mb-2">
                    <CheckCircle size={12} className="mr-1" />
                    Verificado
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
                  <p className="text-gray-500 mt-1">{exam.institution} • {exam.subject}</p>
                </div>
                {exam.oldPrice && (
                  <div className="text-right">
                    <span className="text-gray-400 line-through text-sm">{exam.oldPrice} MZN</span>
                    <p className="text-3xl font-bold text-green-600">{exam.price} MZN</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Clock size={16} />
                    <span className="text-sm">{exam.duration} min</span>
                  </div>
                  <p className="text-xs text-gray-400">Duração</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <FileQuestion size={16} />
                    <span className="text-sm">{exam.questions}</span>
                  </div>
                  <p className="text-xs text-gray-400">Questões</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Users size={16} />
                    <span className="text-sm">{exam.students.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400">Estudantes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Star size={16} fill="#F59E0B" />
                    <span className="text-sm">{exam.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400">({exam.reviews} reviews)</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-600 leading-relaxed">{exam.description}</p>
              </div>

              {/* What You'll Learn */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">O que você vai aprender</h3>
                <div className="grid grid-cols-2 gap-3">
                  {exam.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instrutor</h3>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                    {exam.instructor.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{exam.instructor.name}</p>
                    <p className="text-sm text-gray-500">{exam.instructor.bio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Curriculum</h3>
              <div className="space-y-3">
                {exam.curriculum.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {item.completed ? <Check size={16} /> : <BookOpen size={16} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.lessons} aulas</p>
                      </div>
                    </div>
                    {item.completed && (
                      <span className="text-xs text-green-600 font-medium">Concluído</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              {/* Exam Preview Image */}
              <div className="relative rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-green-600 to-green-800 aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                    <Play size={32} fill="white" />
                  </div>
                  <p className="text-sm font-medium">Prévia do Exame</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < 4 ? '#F59E0B' : 'none'} stroke="#F59E0B" />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">{exam.rating}/5</span>
                </div>
                <p className="text-sm text-gray-500">{exam.reviews} avaliações de estudantes</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={18} className="text-gray-400" />
                  <span className="text-gray-600">{exam.duration} minutos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileQuestion size={18} className="text-gray-400" />
                  <span className="text-gray-600">{exam.questions} questões</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <TrendingUp size={18} className="text-gray-400" />
                  <span className="text-gray-600">Nota de passagem: {exam.passingScore}%</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award size={18} className="text-gray-400" />
                  <span className="text-gray-600">Certificado de conclusão</span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Preço</p>
                    <p className="text-3xl font-bold text-gray-900">{exam.price} MZN</p>
                  </div>
                  {exam.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">{exam.oldPrice} MZN</span>
                  )}
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Comprar Agora
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <Lock size={12} />
                  <span>Pagamento seguro via M-Pesa ou e-Mola</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Finalizar Pagamento</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{exam.title}</span>
                <span className="font-semibold">{exam.price} MZN</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxa de serviço</span>
                <span>0 MZN</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-green-600 text-lg">{exam.price} MZN</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Téléfone
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                  +258
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="84/85/86xxxxxxx"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedMethod('mpesa')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedMethod === 'mpesa'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">M-Pesa</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">M-Pesa</p>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedMethod('emola')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedMethod === 'emola'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">eMola</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">e-Mola</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Shield size={16} className="text-green-600" />
              <span>Pagamento seguro. Os seus dados estão protegidos.</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Pagar {exam.price} MZN
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Ao confirmar, você concorda com os nossos Termos de Uso e Política de Privacidade.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
