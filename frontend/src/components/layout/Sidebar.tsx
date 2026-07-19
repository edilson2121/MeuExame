'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  FileText,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/instituicoes', label: 'Instituições', icon: Building2 },
  { href: '/admin/disciplinas', label: 'Disciplinas', icon: BookOpen },
  { href: '/admin/exames', label: 'Exames', icon: FileText },
  { href: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { href: '/admin/usuarios', label: 'Utilizadores', icon: Users },
  { href: '/admin/planos', label: 'Planos', icon: CreditCard },
  { href: '/admin/paginas', label: 'Páginas', icon: FileText },
  { href: '/admin/pages', label: 'Gerir Páginas', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            {!collapsed && (
              <Link href="/admin" className="font-bold text-xl text-blue-600">
                MeuExame
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-gray-100 rounded hidden lg:block"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                      title={collapsed ? link.label : undefined}
                    >
                      <Icon size={20} />
                      {!collapsed && <span>{link.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/"
              className={`
                flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 rounded-lg transition-colors
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut size={20} />
              {!collapsed && <span>Sair</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
