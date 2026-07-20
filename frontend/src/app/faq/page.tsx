'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Search, MessageCircle, Mail, Phone, BookOpen, CreditCard, Shield, User } from 'lucide-react';

const faqCategories = [
  {
    icon: BookOpen,
    title: 'Geral',
    questions: [
      {
        question: 'O que é o MeuExame?',
        answer: 'MeuExame é uma plataforma online de preparação para exames em Moçambique. Oferecemos exames para condução, escolas profissionais, técnicos e muito mais. A nossa missão é ajudar os estudantes a preparar-se melhor e alcançar o sucesso nos seus exames.'
      },
      {
        question: 'Como funciona a plataforma?',
        answer: 'Após criar uma conta, pode navegar pelos exames disponíveis, seleccionar o desejado e começar a estudar. Alguns exames são gratuitos e outros requerem pagamento via M-Pesa ou eMola. Pode fazer os exames quantas vezes quiser.'
      },
      {
        question: 'Que tipos de exames estão disponíveis?',
        answer: 'Oferecemos exames para: Condução (categoria A, B, etc.), Escolas Profissionais (IFP, INEFP), Cursos Técnicos, Exames de Admissão, e muito mais. Estamos constantemente a adicionar novos exames.'
      },
      {
        question: 'Posso usar a plataforma no telemóvel?',
        answer: 'Sim! O MeuExame é totalmente responsivo e funciona perfeitamente em telemóveis, tablets e computadores. Pode estudar em qualquer lugar e a qualquer momento.'
      },
    ]
  },
  {
    icon: CreditCard,
    title: 'Pagamentos',
    questions: [
      {
        question: 'Quais são os métodos de pagamento?',
        answer: 'Aceitamos pagamentos via M-Pesa (Vodacom) e eMola (Movitel). Ambos os métodos são seguros e instantâneos. Após o pagamento, o acesso ao exame é concedido automaticamente.'
      },
      {
        question: 'Como faço um pagamento via M-Pesa?',
        answer: 'Selecione o exame desejado, escolha M-Pesa como método de pagamento, insira o seu número de telemóvel e clique em "Pagar". Receberá um código no telemóvel para confirmar a transação. Após confirmar, o acesso é imediato.'
      },
      {
        question: 'Os pagamentos são seguros?',
        answer: 'Sim, todos os pagamentos são processados de forma segura. Utilizamos tecnologias de encriptação para proteger os seus dados financeiros. Os pagamentos são processados directamente pelas operadoras de telemóvel.'
      },
      {
        question: 'Posso obter reembolso?',
        answer: 'Os pagamentos são normalmente não reembolsáveis uma vez que o acesso ao exame é concedido imediatamente após a confirmação do pagamento. Se tiver problemas técnicos, entre em contacto com o nosso suporte.'
      },
    ]
  },
  {
    icon: Shield,
    title: 'Segurança e Privacidade',
    questions: [
      {
        question: 'Os meus dados estão seguros?',
        answer: 'Sim, tomamos a segurança dos seus dados muito a sério. Utilizamos encriptação SSL, políticas de privacidade rigorosas e não partilhamos os seus dados com terceiros sem o seu consentimento.'
      },
      {
        question: 'Como protegemos a sua conta?',
        answer: 'A sua conta é protegida por palavra-passe encriptada. Recomendamos que escolha uma palavra-passe forte e única. Também pode activar a verificação em dois passos para maior segurança.'
      },
    ]
  },
  {
    icon: User,
    title: 'Conta',
    questions: [
      {
        question: 'Como criar uma conta?',
        answer: 'Clique em "Criar Conta" na página inicial, preencha os seus dados (nome, email, palavra-passe) e clique em "Registar". Receberá um email de confirmação para activar a sua conta.'
      },
      {
        question: 'Esqueci a minha palavra-passe. O que fazer?',
        answer: 'Clique em "Esqueci a palavra-passe" na página de login, insira o seu email e receberá instruções para redefinir a sua palavra-passe.'
      },
      {
        question: 'Como actualizar os meus dados?',
        answer: 'Aceda à secção "Perfil" após fazer login. Lá pode actualizar o seu nome, email, número de telemóvel e outras informações pessoais.'
      },
    ]
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-xl text-green-100 mb-8">
            Encontre respostas rápidas para as suas dúvidas
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500">Tente pesquisar com outras palavras-chave</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.title} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="space-y-3">
                {category.questions.map((item) => {
                  const currentIndex = globalIndex++;
                  return (
                    <div key={currentIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedQuestion(expandedQuestion === currentIndex ? null : currentIndex)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedQuestion === currentIndex ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedQuestion === currentIndex && (
                        <div className="px-5 pb-5 border-t">
                          <p className="text-gray-600 mt-4">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ainda tem dúvidas?</h3>
          <p className="text-gray-600 mb-6">
            A nossa equipa de suporte está pronta para ajudá-lo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contacto" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Contactar Suporte
            </Link>
            <a href="mailto:suporte@meuexame.com" className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Enviar Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
