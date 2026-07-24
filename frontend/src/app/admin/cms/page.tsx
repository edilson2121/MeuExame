'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  MessageSquare,
  Star,
  FileStack,
  Newspaper,
  Quote,
} from 'lucide-react';

type TabType = 'pages' | 'blog' | 'testimonials';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  commentsCount: number;
  publishedAt: string;
}

interface Testimonial {
  id: string;
  authorName: string;
  content: string;
  rating: number;
  status: string;
}

const mockPages: Page[] = [
  { id: '1', title: 'Página Inicial', slug: '/', status: 'published', updatedAt: '2026-07-20' },
  { id: '2', title: 'Sobre Nós', slug: '/sobre', status: 'published', updatedAt: '2026-07-18' },
  { id: '3', title: 'Blog', slug: '/blog', status: 'published', updatedAt: '2026-07-15' },
  { id: '4', title: 'Promoção Natal', slug: '/promocao-natal', status: 'draft', updatedAt: '2026-07-22' },
  { id: '5', title: 'Contacto', slug: '/contacto', status: 'archived', updatedAt: '2026-01-10' },
];

const mockArticles: Article[] = [
  { id: '1', title: 'Como passar no vestibular da UEM', slug: 'como-passar-vestibular-uem', status: 'published', views: 1234, commentsCount: 23, publishedAt: '2026-07-20' },
  { id: '2', title: '10 dicas para estudar Matemática', slug: '10-dicas-matematica', status: 'published', views: 987, commentsCount: 15, publishedAt: '2026-07-18' },
  { id: '3', title: 'Guia completo para exames de admissão', slug: 'guia-exames-admissao', status: 'published', views: 2456, commentsCount: 45, publishedAt: '2026-07-10' },
  { id: '4', title: 'Novidades 2027', slug: 'novidades-2027', status: 'draft', views: 0, commentsCount: 0, publishedAt: '' },
];

const mockTestimonials: Testimonial[] = [
  { id: '1', authorName: 'Ana Silva', content: 'Passei na UEM graças ao MeuExame!', rating: 5, status: 'published' },
  { id: '2', authorName: 'Carlos João', content: 'Melhor plataforma de estudo.', rating: 5, status: 'published' },
  { id: '3', authorName: 'Maria Paulo', content: 'Me ajudou muito nos estudos.', rating: 4, status: 'pending' },
];

export default function CMSPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('pages');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/admin/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12} />Publicado</span>;
      case 'draft':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock size={12} />Rascunho</span>;
      case 'archived':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><XCircle size={12} />Arquivado</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700"><Clock size={12} />Pendente</span>;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const filteredPages = mockPages.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredArticles = mockArticles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTestimonials = mockTestimonials.filter(t => t.authorName.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold">ME</Link>
            <div>
              <h1 className="text-base font-bold text-gray-900">MeuExame</h1>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">Dashboard</Link>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 transition-colors">
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:block p-4">
          <nav className="space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50">
              <BarChart3 size={20} /> Dashboard
            </Link>
            <Link href="/admin/cms" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-green-50 text-green-700 font-medium">
              <FileText size={20} /> CMS
            </Link>
            <Link href="/admin/instituicoes" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50">
              <FileStack size={20} /> Instituições
            </Link>
            <Link href="/admin/exames" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50">
              <Newspaper size={20} /> Exames
            </Link>
            <Link href="/admin/pagamentos" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50">
              <BarChart3 size={20} /> Pagamentos
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📝 Sistema CMS</h1>
              <p className="text-gray-500">Gerencie páginas, artigos e depoimentos</p>
            </div>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Plus size={18} /> Novo {activeTab === 'pages' ? 'Página' : activeTab === 'blog' ? 'Artigo' : 'Depoimento'}
            </button>
          </div>

          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'pages' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
            >
              <FileStack size={18} /> Páginas
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'blog' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
            >
              <Newspaper size={18} /> Blog/Artigos
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'testimonials' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
            >
              <Quote size={18} /> Depoimentos
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Pesquisar ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {activeTab === 'pages' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Atualizado</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{page.slug}</td>
                      <td className="px-6 py-4">{getStatusBadge(page.status)}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{page.updatedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/paginas/${page.slug}`} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16} /></Link>
                          <button className="p-2 text-gray-400 hover:text-green-600"><Edit size={16} /></button>
                          <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Views</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Comentários</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Publicado</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                      <td className="px-6 py-4">{getStatusBadge(article.status)}</td>
                      <td className="px-6 py-4 text-gray-500">{article.views.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-1"><MessageSquare size={14} />{article.commentsCount}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{article.publishedAt || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/blog/${article.slug}`} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16} /></Link>
                          <button className="p-2 text-gray-400 hover:text-green-600"><Edit size={16} /></button>
                          <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="grid gap-4">
              {filteredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                        {testimonial.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{testimonial.authorName}</p>
                        <div className="flex items-center gap-1 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">"{testimonial.content}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(testimonial.status)}
                      <button className="p-2 text-gray-400 hover:text-green-600"><Edit size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
