"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function DynamicPagePage() {
  const params = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [params.slug]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setPage(data);
      } else if (response.status === 404) {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Página Não Encontrada</h1>
          <p className="text-gray-600 mb-8">A página que você está procurando não existe.</p>
          <a href="/" className="btn btn-primary">
            Voltar ao Início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900">MeuExame</span>
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="/instituicoes" className="text-gray-600 hover:text-gray-900">
                Instituições
              </a>
              <a href="/exames" className="text-gray-600 hover:text-gray-900">
                Exames
              </a>
              <a href="/pagamento" className="text-gray-600 hover:text-gray-900">
                Assinar
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="card">
          <div className="card-header">
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            {page.institution && (
              <p className="text-sm text-gray-600 mt-2">
                {page.institution.name}
              </p>
            )}
          </div>
          
          {page.description && (
            <div className="card-body">
              <p className="text-lg text-gray-700 leading-relaxed">
                {page.description}
              </p>
            </div>
          )}

          {page.content && (
            <div className="card-body">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          )}

          <div className="card-footer">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Última atualização: {new Date(page.updatedAt).toLocaleDateString('pt-BR')}
              </p>
              <a href="/instituicoes" className="btn btn-ghost">
                Ver Todas as Instituições
              </a>
            </div>
          </div>
        </article>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2026 MeuExame. Todos os direitos reservados.
            </p>
            <p className="text-xs mt-2">
              Plataforma de preparação para exames nacionais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
