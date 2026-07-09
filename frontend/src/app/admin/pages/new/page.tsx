'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    title: '',
    slug: '',
    content: '<h1>Bem-vindo!</h1><p>Edite este conteúdo usando HTML.</p>',
    description: '',
    showInMenu: false,
    status: 'draft',
  });

  const handleSubmit = async (publish) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ ...page, status: publish ? 'published' : 'draft' }),
      });
      if (res.ok) router.push('/admin/pages');
      else alert('Erro ao criar página');
    } catch(e) { alert('Erro: ' + e); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 Criar Página</h1>
        <Link href="/admin/pages" className="text-gray-600 hover:text-gray-800">← Voltar</Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Título *</label>
            <input className="w-full border rounded-lg p-2" value={page.title} onChange={e => setPage({...page, title: e.target.value})} placeholder="Ex: Sobre" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Slug</label>
            <input className="w-full border rounded-lg p-2" value={page.slug} onChange={e => setPage({...page, slug: e.target.value})} placeholder="sobre" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Conteúdo (HTML) *</label>
            <textarea className="w-full border rounded-lg p-2 h-64 font-mono text-sm" value={page.content} onChange={e => setPage({...page, content: e.target.value})} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Descrição</label>
            <textarea className="w-full border rounded-lg p-2 h-20" value={page.description} onChange={e => setPage({...page, description: e.target.value})} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={page.showInMenu} onChange={e => setPage({...page, showInMenu: e.target.checked})} />
              Mostrar no menu
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={page.status === 'published'} onChange={e => setPage({...page, status: e.target.checked ? 'published' : 'draft'})} />
              Publicar agora
            </label>
          </div>
          <div className="flex gap-4 pt-4 border-t">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={() => handleSubmit(false)} disabled={loading || !page.title || !page.content}>
              {loading ? 'Salvando...' : '💾 Salvar'}
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700" onClick={() => handleSubmit(true)} disabled={loading || !page.title || !page.content}>
              {loading ? 'Publicando...' : '🚀 Publicar'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-gray-50 border rounded-lg p-4">
        <h3 className="font-semibold mb-2">📱 Pré-visualização</h3>
        <div className="bg-white rounded-lg p-4 border">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content || '<p class="text-gray-400">Digite o conteúdo...</p>' }} />
        </div>
      </div>
    </div>
  );
}
