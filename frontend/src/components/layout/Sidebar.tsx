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
  Database,
  Bell,
  Globe,
  Download,
  Book,
} from 'lucide-react';
import { useState } from 'react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/instituicoes', label: 'Instituições', icon: Building2 },
  { href: '/admin/disciplinas', label: 'Disciplinas', icon: BookOpen },
  { href: '/admin/exames', label: 'Exames', icon: FileText },
  { href: '/admin/manuais', label: 'Manuais', icon: Book },
  { href: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { href: '/admin/usuarios', label: 'Utilizadores', icon: Users },
  { href: '/admin/planos', label: 'Planos', icon: CreditCard },
  { href: '/admin/notifications', label: 'Notificações', icon: Bell },
  { href: '/admin/social-media', label: 'Redes Sociais', icon: Globe },
  { href: '/admin/backup', label: 'Backup', icon: Database },
  { href: '/admin/paginas', label: 'Páginas', icon: FileText },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-72'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-700/50">
            {!collapsed && (
              <Link href="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <span className="font-bold text-xl text-white">Meu</span>
                  <span className="font-bold text-xl text-cyan-400">Exame</span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors hidden lg:block"
            >
              {collapsed ? (
                <ChevronRight size={20} className="text-slate-400" />
              ) : (
                <ChevronLeft size={20} className="text-slate-400" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {adminLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white border border-transparent'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? link.label : undefined}
                  >
                    <Icon size={20} className={isActive ? 'text-cyan-400' : ''} />
                    {!collapsed && <span className="font-medium">{link.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700/50 p-4 space-y-2">
            <Link
              href="/"
              className={`
                flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-colors
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
