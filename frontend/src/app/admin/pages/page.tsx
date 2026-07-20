'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [showInMenu, setShowInMenu] = useState(false);
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Gerar slug automaticamente se não for fornecido
    const finalSlug = slug || title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const data = {
      title,
      slug: finalSlug,
      content,
      description,
      keywords,
      showInMenu,
      status: publish ? 'published' : 'draft',
    };

    try {
      const res = await fetch('http://localhost:3001/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro ao criar página');
      }

      router.push('/admin/pages');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Erro ao criar página');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📄 Nova Página</h1>
        <Link href="/admin/pages" className="text-gray-600 hover:text-gray-800">
          ← Voltar
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título da página"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="exemplo-de-url"
            />
            <p className="text-xs text-gray-500 mt-1">Deixe em branco para gerar automaticamente</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (Meta)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição para SEO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palavras-chave (Meta)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="palavra1, palavra2, palavra3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="<h1>Título</h1><p>Seu conteúdo em HTML...</p>"
            />
            <p className="text-xs text-gray-500 mt-1">Use HTML para formatar o conteúdo</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInMenu}
                onChange={(e) => setShowInMenu(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Mostrar no menu</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={status === 'published'}
                onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Publicar imediatamente</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : '💾 Salvar Rascunho'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Publicando...' : '🚀 Publicar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}