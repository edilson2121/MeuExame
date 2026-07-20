'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Book, MessageCircle, Mail, Phone, ChevronDown, Search, FileText, CreditCard, User, Shield } from 'lucide-react';

const helpCategories = [
  {
    icon: Book,
    title: 'Como Começar',
    description: 'Aprenda a usar a plataforma MeuExame',
    articles: [
      { title: 'Como criar uma conta', href: '#criar-conta' },
      { title: 'Como fazer login', href: '#fazer-login' },
      { title: 'Escolher um exame', href: '#escolher-exame' },
      { title: 'Navegar na plataforma', href: '#navegar' },
    ]
  },
  {
    icon: FileText,
    title: 'Exames e Questões',
    description: 'Tudo sobre fazer exames e responder questões',
    articles: [
      { title: 'Como iniciar um exame', href: '#iniciar-exame' },
      { title: 'Entender o cronômetro', href: '#cronometro' },
      { title: 'Como marcar questões', href: '#marcar-questoes' },
      { title: 'Ver resultados', href: '#ver-resultados' },
    ]
  },
  {
    icon: CreditCard,
    title: 'Pagamentos',
    description: 'Métodos de pagamento e assinaturas',
    articles: [
      { title: 'Métodos de pagamento disponíveis', href: '#metodos-pagamento' },
      { title: 'Como comprar créditos', href: '#comprar-creditos' },
      { title: 'Exames gratuitos', href: '#exames-gratuitos' },
      { title: 'Problemas com pagamento', href: '#problemas-pagamento' },
    ]
  },
  {
    icon: User,
    title: 'Conta e Perfil',
    description: 'Gerir a sua conta',
    articles: [
      { title: 'Alterar palavra-passe', href: '#alterar-senha' },
      { title: 'Atualizar dados pessoais', href: '#atualizar-dados' },
      { title: 'Histórico de pagamentos', href: '#historico-pagamentos' },
      { title: 'Eliminar conta', href: '#eliminar-conta' },
    ]
  },
];

const faqItems = [
  {
    question: 'Como posso aceder aos exames?',
    answer: 'Para aceder aos exames, você precisa ter uma conta criada. Alguns exames são gratuitos e outros requerem pagamento. Após fazer login, basta navegar até à secção de exames e escolher o que deseja fazer.'
  },
  {
    question: 'Posso fazer exames no telemóvel?',
    answer: 'Sim! A plataforma MeuExame é totalmente responsiva e funciona perfeitamente em telemóveis, tablets e computadores. Pode fazer os seus exames em qualquer lugar.'
  },
  {
    question: 'Quanto tempo tenho para completar um exame?',
    answer: 'O tempo para completar cada exame varia. Alguns exames têm tempo limitado, que é indicado antes de iniciar. Pode ver o tempo restante durante a realização do exame.'
  },
  {
    question: 'Posso repetir um exame?',
    answer: 'Sim, pode repetir qualquer exame quantas vezes quiser. Basta aceder novamente ao exame a partir da sua área de membros.'
  },
  {
    question: 'Como funciona o pagamento via M-Pesa ou eMola?',
    answer: 'Ao selecionar um exame pago, escolha o método de pagamento preferido (M-Pesa ou eMola). Você receberá um código no seu telemóvel para confirmar o pagamento. Após confirmação, o acesso ao exame é imediato.'
  },
];

export default function AjudaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Centro de Ajuda</h1>
          <p className="text-xl text-green-100 mb-8">
            Encontre respostas para as suas dúvidas
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar ajuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/faq" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
            <HelpCircle className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Perguntas Frequentes</h3>
            <p className="text-sm text-gray-500 mt-1">Respostas rápidas</p>
          </Link>
          <Link href="/contacto" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Chat ao Vivo</h3>
            <p className="text-sm text-gray-500 mt-1">Fale com a nossa equipa</p>
          </Link>
          <a href="mailto:suporte@meuexame.com" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
            <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Email</h3>
            <p className="text-sm text-gray-500 mt-1">suporte@meuexame.com</p>
          </a>
        </div>

        {/* Categories */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias de Ajuda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.title ? null : category.title)}
                className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategory === category.title ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedCategory === category.title && (
                <div className="px-6 pb-6 border-t">
                  <ul className="mt-4 space-y-2">
                    {category.articles.map((article) => (
                      <li key={article.title}>
                        <a href={article.href} className="block py-2 text-primary hover:text-primary-dark transition-colors">
                          {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Preview */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
        <div className="space-y-4 mb-12">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6 border-t">
                  <p className="text-gray-600 mt-4">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Não encontrou a resposta?</h3>
          <p className="text-gray-600 mb-6">
            A nossa equipa de suporte está pronta para ajudá-lo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contacto" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Contactar Suporte
            </Link>
            <a href="tel:+25821234567" className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Ligar Agora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
