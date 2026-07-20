'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageData {
  title: string;
  slug: string;
  content: string;
  description: string;
  showInMenu: boolean;
  status: 'draft' | 'published';
}

export default function NewPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState<PageData>({
    title: '',
    slug: '',
    content:
      '<h1>Bem-vindo!</h1><p>Edite este conteúdo usando HTML.</p>',
    description: '',
    showInMenu: false,
    status: 'draft',
  });

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        'http://localhost:3001/api/pages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...page,
            status: publish ? 'published' : 'draft',
          }),
        }
      );

      if (response.ok) {
        router.push('/admin/pages');
      } else {
        alert('Erro ao criar página.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao criar página.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Criar Página
        </h1>

        <Link href="/admin/pages">
          Voltar
        </Link>

      </div>

      <div className="space-y-5">

        <input
          className="w-full border p-2 rounded"
          placeholder="Título"
          value={page.title}
          onChange={(e) =>
            setPage({
              ...page,
              title: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Slug"
          value={page.slug}
          onChange={(e) =>
            setPage({
              ...page,
              slug: e.target.value,
            })
          }
        />

        <textarea
          className="w-full border rounded p-2 h-72"
          value={page.content}
          onChange={(e) =>
            setPage({
              ...page,
              content: e.target.value,
            })
          }
        />

        <textarea
          className="w-full border rounded p-2"
          placeholder="Descrição"
          value={page.description}
          onChange={(e) =>
            setPage({
              ...page,
              description: e.target.value,
            })
          }
        />

        <label className="flex gap-2">

          <input
            type="checkbox"
            checked={page.showInMenu}
            onChange={(e) =>
              setPage({
                ...page,
                showInMenu: e.target.checked,
              })
            }
          />

          Mostrar no menu

        </label>

        <div className="flex gap-4">

          <button
            disabled={loading}
            onClick={() => handleSubmit(false)}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Salvar
          </button>

          <button
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            Publicar
          </button>

        </div>

      </div>

      <div className="mt-8">

        <h2 className="font-bold mb-2">
          Pré-visualização
        </h2>

        <div
          className="border rounded p-5"
          dangerouslySetInnerHTML={{
            __html: page.content,
          }}
        />

      </div>

    </div>
  );
}