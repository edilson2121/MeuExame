'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Share2,
  ThumbsUp,
  Clock,
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

const mockArticle = {
  id: '1',
  title: 'Como passar no vestibular da UEM em 2027',
  slug: 'como-passar-vestibular-uem',
  content: `
<p>O vestibular da Universidade Eduardo Mondlane (UEM) é um dos mais concorridos de Moçambique. Com uma preparação adequada, você pode garantir a sua vaga.</p>

<h2>1. Comece a estudar com antecedência</h2>
<p>O ideal é começar a preparação pelo menos 6 meses antes do exame. Isso permite que você cubra todo o conteúdo sem pressa.</p>

<h2>2. Organize um plano de estudos</h2>
<p>Crie um cronograma semanal dividindo as matérias por dia. Dedique mais tempo às matérias que você tem mais dificuldade.</p>

<h2>3. Faça simulados</h2>
<p>Os simulados são fundamentais para você se familiarizar com o formato das questões e gerenciar o tempo.</p>

<h2>4. Revise bastante</h2>
<p>Nas últimas semanas, foque na revisão do conteúdo já estudado. Faça questões de anos anteriores.</p>

<h2>5. Cuide da saúde</h2>
<p>Durma bem nos dias que antecedem o exame. Uma mente descansada rende muito mais!</p>
  `,
  author: { name: 'MeuExame' },
  publishedAt: '2026-07-20',
  views: 1234,
  commentsCount: 23,
  category: 'Vestibular',
  readTime: '5 min',
};

const mockComments: Comment[] = [
  { id: '1', author: 'João Silva', content: 'Ótimo artigo! Muito útil para quem vai fazer o vestibular.', date: '2026-07-21' },
  { id: '2', author: 'Maria Santos', content: 'Gracias por compartilhar essas dicas. Vou seguir todas!', date: '2026-07-20' },
  { id: '3', author: 'Carlos João', content: 'Qual o melhor horário para estudar?', date: '2026-07-19' },
];

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<typeof mockArticle | null>(mockArticle);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Artigo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span>Voltar ao Blog</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-gray-600 hover:text-green-600">Login</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User size={16} />
              {article.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(article.publishedAt).toLocaleDateString('pt-MZ')}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {article.readTime} de leitura
            </span>
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {article.views.toLocaleString()} visualizações
            </span>
          </div>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Actions */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ThumbsUp size={18} className={liked ? 'fill-current' : ''} />
              Curtir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 size={18} />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle size={20} />
            Comentários ({comments.length})
          </h3>

          {/* New Comment */}
          <div className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Deixe seu comentário..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
            <button className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Enviar Comentário
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                    {comment.author.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{comment.author}</span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{comment.date}</span>
                </div>
                <p className="text-gray-600 ml-10">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Related Articles */}
      <div className="bg-gray-100 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Artigos Relacionados</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/blog/10-dicas-matematica" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">10 dicas para estudar Matemática</h4>
              <p className="text-sm text-gray-500 mt-1">5 min de leitura</p>
            </Link>
            <Link href="/blog/fisica-basica-exames" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">Física básica: o que cai nos exames</h4>
              <p className="text-sm text-gray-500 mt-1">7 min de leitura</p>
            </Link>
            <Link href="/blog/guia-exames-admissao" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">Guia completo para exames</h4>
              <p className="text-sm text-gray-500 mt-1">10 min de leitura</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>© 2026 MeuExame. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
