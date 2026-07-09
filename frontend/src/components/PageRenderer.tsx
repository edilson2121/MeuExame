import React, { useMemo } from 'react';
import { PublishedPage } from '@/services/pages.service';

interface PageRendererProps {
  page: PublishedPage;
  className?: string;
}

/**
 * Renderiza uma página publicada usando seu layout template
 */
export function PageRenderer({ page, className = '' }: PageRendererProps) {
  const renderedHtml = useMemo(() => {
    if (!page.layout.html) {
      return <div className="p-8">{page.content}</div>;
    }

    // Substitui placeholders no HTML do layout
    let html = page.layout.html;
    html = html.replace('{{title}}', page.title || '');
    html = html.replace('{{description}}', page.description || '');
    html = html.replace('{{content}}', page.content || '');

    return html;
  }, [page]);

  return (
    <div className={className}>
      <style>{page.layout.css}</style>
      <div
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        suppressHydrationWarning
      />
    </div>
  );
}

interface PageContainerProps {
  page: PublishedPage;
  children?: React.ReactNode;
}

/**
 * Container para uma página com layout básico
 */
export function PageContainer({ page, children }: PageContainerProps) {
  return (
    <div>
      {/* SEO Meta Tags - devem ser adicionados ao Head da página */}
      <div className="bg-white">
        <article className="mx-auto max-w-4xl px-4 py-8">
          <header className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-lg text-gray-600">{page.description}</p>
            )}
            <time className="text-sm text-gray-500" dateTime={page.publishedAt}>
              Publicado em{' '}
              {new Date(page.publishedAt).toLocaleDateString('pt-MZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </header>

          <main className="prose prose-sm max-w-none">
            {page.layout.html ? (
              <PageRenderer page={page} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
            )}
          </main>

          {children}
        </article>
      </div>
    </div>
  );
}

interface SimplePageProps {
  page: PublishedPage | null;
  loading?: boolean;
  error?: Error | null;
}

/**
 * Componente simples para exibir uma página com estados de carregamento e erro
 */
export function SimplePage({ page, loading = false, error = null }: SimplePageProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600">Carregando página...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-800">
            Erro ao carregar página
          </h2>
          <p className="text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-yellow-800">
            Página não encontrada
          </h2>
          <p className="text-yellow-700">
            A página solicitada não está disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return <PageContainer page={page} />;
}
