import Link from 'next/link';
import { MenuItem } from '@/services/pages.service';

interface InstitutionMenuProps {
  institutionId: string;
  menu: MenuItem[];
  loading?: boolean;
  currentSlug?: string;
  className?: string;
}

/**
 * Menu de navegação da instituição com links para páginas publicadas
 */
export function InstitutionMenu({
  institutionId,
  menu,
  loading = false,
  currentSlug,
  className = '',
}: InstitutionMenuProps) {
  if (loading) {
    return (
      <nav className={className}>
        <ul className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <li key={i} className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          ))}
        </ul>
      </nav>
    );
  }

  if (!menu || menu.length === 0) {
    return null;
  }

  return (
    <nav className={className}>
      <ul className="flex flex-wrap gap-1">
        {menu.map((item) => (
          <li key={item.id}>
            <Link
              href={`/instituicoes/${institutionId}/paginas/${item.slug}`}
              className={`block px-3 py-2 text-sm font-medium transition-colors ${
                currentSlug === item.slug
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface BreadcrumbProps {
  institutionName: string;
  pageName?: string;
  institutionId?: string;
}

/**
 * Breadcrumb para navegação
 */
export function PageBreadcrumb({
  institutionName,
  pageName,
  institutionId,
}: BreadcrumbProps) {
  return (
    <nav className="flex text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-gray-900">
            Início
          </Link>
        </li>
        {institutionId && (
          <>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link
                href={`/instituicoes/${institutionId}`}
                className="hover:text-gray-900"
              >
                {institutionName}
              </Link>
            </li>
          </>
        )}
        {pageName && (
          <>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900">{pageName}</li>
          </>
        )}
      </ol>
    </nav>
  );
}
