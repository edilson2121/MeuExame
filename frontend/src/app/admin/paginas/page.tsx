'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Square3Stack3DIcon,
  DocumentTextIcon,
  PhotoIcon,
  ListBulletIcon,
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Page {
  id: string;
  title: string;
  slug: string;
  layout: string;
  isPublished: boolean;
  institutionId: string;
  institutionName: string;
  createdAt: string;
  updatedAt: string;
}

const LAYOUT_TEMPLATES = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: Square3Stack3DIcon,
    description: 'Seção principal com título e subtítulo',
    preview: 'hero-preview',
  },
  {
    id: 'content',
    name: 'Conteúdo de Texto',
    icon: DocumentTextIcon,
    description: 'Bloco de texto com formatação rica',
    preview: 'content-preview',
  },
  {
    id: 'image-text',
    name: 'Imagem com Texto',
    icon: PhotoIcon,
    description: 'Imagem lateral com texto descritivo',
    preview: 'image-text-preview',
  },
  {
    id: 'features',
    name: 'Lista de Funcionalidades',
    icon: ListBulletIcon,
    description: 'Grid de cards com características',
    preview: 'features-preview',
  },
  {
    id: 'cta',
    name: 'Call to Action',
    icon: ArrowTopRightOnSquareIcon,
    description: 'Seção de chamada para ação',
    preview: 'cta-preview',
  },
];

export default function AdminPages() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('admin_token');

      // Simular dados da API
      setPages([
        {
          id: '1',
          title: 'Sobre a UEM',
          slug: 'sobre-uem',
          layout: 'hero',
          isPublished: true,
          institutionId: '1',
          institutionName: 'Universidade Eduardo Mondlane',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
        },
        {
          id: '2',
          title: 'Cursos de Engenharia',
          slug: 'cursos-engenharia',
          layout: 'content',
          isPublished: true,
          institutionId: '1',
          institutionName: 'Universidade Eduardo Mondlane',
          createdAt: '2024-01-18',
          updatedAt: '2024-01-22',
        },
        {
          id: '3',
          title: 'Faculdade de Medicina',
          slug: 'faculdade-medicina',
          layout: 'image-text',
          isPublished: false,
          institutionId: '1',
          institutionName: 'Universidade Eduardo Mondlane',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
        },
      ]);
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (pageId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('admin_token');

      setPages(pages.map(page =>
        page.id === pageId
          ? { ...page, isPublished: !page.isPublished }
          : page
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('admin_token');

      setPages(pages.filter(page => page.id !== pageId));
    } catch (error) {
      console.error('Erro ao excluir página:', error);
    }
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando páginas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Páginas</h1>
            <p className="text-slate-400">Crie e gerencie páginas sem programação</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Nova Página
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar páginas..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
            />
          </div>
          <button className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:border-slate-600 transition-all flex items-center gap-2">
            <FunnelIcon className="w-5 h-5" />
            Filtros
          </button>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{page.title}</h3>
                    <p className="text-slate-400 text-sm mb-2">/{page.slug}</p>
                    <p className="text-cyan-400 text-xs">{page.institutionName}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${page.isPublished
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                    {page.isPublished ? 'Publicado' : 'Rascunho'}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Atualizado em {new Date(page.updatedAt).toLocaleDateString('pt-PT')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingPage(page)}
                    className="flex-1 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleTogglePublish(page.id)}
                    className={`p-2 rounded-lg transition-all ${page.isPublished
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    title={page.isPublished ? 'Despublicar' : 'Publicar'}
                  >
                    {page.isPublished ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                    title="Excluir"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-20">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">Nenhuma página encontrada</h3>
            <p className="text-slate-500 mb-6">Comece criando sua primeira página</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Criar Primeira Página
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Criar Nova Página</h2>
                <p className="text-slate-400">Escolha um template para começar</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <XMarkIcon className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {!selectedTemplate ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LAYOUT_TEMPLATES.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all group text-left"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                        <p className="text-slate-400 text-sm">{template.description}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all"
                  >
                    <X size={20} />
                    Voltar aos templates
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Título da Página
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Sobre Nós"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        URL (Slug)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: sobre-nos"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Instituição
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white">
                      <option value="">Selecione uma instituição</option>
                      <option value="1">Universidade Eduardo Mondlane</option>
                      <option value="2">Universidade Católica de Moçambique</option>
                      <option value="3">ISUTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Conteúdo da Página
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Digite o conteúdo da página..."
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-slate-400 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setSelectedTemplate(null);
                      }}
                      className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
                    >
                      Cancelar
                    </button>
                    <button className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                      <Save size={20} />
                      Criar Página
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
