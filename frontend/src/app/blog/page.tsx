'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  User,
  Eye,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featuredImage?: string;
  author: { name: string };
  publishedAt: string;
  views: number;
  commentsCount: number;
  category: string;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Como passar no vestibular da UEM em 2027',
    slug: 'como-passar-vestibular-uem',
    excerpt: ' Guia completo com todas as dicas e estratégias para você passar no vestibular da Universidade Eduardo Mondlane.',
    author: { name: 'MeuExame' },
    publishedAt: '2026-07-20',
    views: 1234,
    commentsCount: 23,
    category: 'Vestibular',
  },
  {
    id: '2',
    title: '10 dicas para estudar Matemática',
    slug: '10-dicas-matematica',
    excerpt: 'Aprenda as melhores técnicas para melhorar seu desempenho em Matemática e garantir uma nota alta nos exames.',
    author: { name: 'MeuExame' },
    publishedAt: '2026-07-18',
    views: 987,
    commentsCount: 15,
    category: 'Dicas de Estudo',
  },
  {
    id: '3',
    title: 'Guia completo para exames de admissão',
    slug: 'guia-exames-admissao',
    excerpt: 'Tudo o que você precisa saber sobre os exames de admissão em Moçambique: datas, requisitos e preparação.',
    author: { name: 'MeuExame' },
    publishedAt: '2026-07-10',
    views: 2456,
    commentsCount: 45,
    category: 'Guias',
  },
  {
    id: '4',
    title: 'Física básica: o que cai nos exames',
    slug: 'fisica-basica-exames',
    excerpt: 'Os temas de Física mais frequentes nos exames de admissão das universidades moçambicanas.',
    author: { name: 'MeuExame' },
    publishedAt: '2026-07-05',
    views: 1567,
    commentsCount: 32,
    category: 'Física',
  },
  {
    id: '5',
    title: 'Como se preparar para prova de Português',
    slug: 'preparar-prova-portugues',
    excerpt: 'Estratégias eficazes para dominar a prova de Português e garantir uma boa nota.',
    author: { name: 'MeuExame' },
    publishedAt: '2026-06-28',
    views: 892,
    commentsCount: 18,
    category: 'Português',
  },
  {
    id: '6',
    title: 'Química Orgânica: Resumo completo',
    slug: 'quimica-organica-resumo',
    excerpt: 'Todo o conteúdo de Química Orgânica que você precisa saber para os exames de admissão.',
    author: { name: 'MeuExame' },
    publishedAt: '2026-06-20',
    views: 1234,
    commentsCount: 27,
    category: 'Química',
  },
];

const categories = ['Todos', 'Vestibular', 'Dicas de Estudo', 'Guias', 'Matemática', 'Física', 'Química', 'Português'];

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(false);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-green-600 text-white px-2 py-0.5 rounded-lg font-bold text-sm">ME</div>
            <span className="font-bold text-gray-900">MeuExame</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-green-600">Login</Link>
            <Link href="/register" className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Criar Conta</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📝 Blog do MeuExame</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dicas, guias e estratégias para você passar nos exames de admissão em Moçambique
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(article.publishedAt).toLocaleDateString('pt-MZ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {article.author.name}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        {article.views.toLocaleString()} visualizações
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        {article.commentsCount} comentários
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      Ler mais <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum artigo encontrado</p>
            </div>
          )}
        </div>

        {/* Newsletter */}
        <div className="mt-12 bg-green-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Receba dicas no seu email</h3>
          <p className="text-green-100 mb-6">
            Assine nossa newsletter e receba as melhores dicas de estudo diretamente na sua caixa de entrada
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100">
              Assinar
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>© 2026 MeuExame. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
