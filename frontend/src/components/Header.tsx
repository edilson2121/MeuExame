'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Building2, BookOpen, FileQuestion, 
  Search, Bell, User, Settings, LogOut, ChevronDown,
  CreditCard, HelpCircle
} from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  title?: string;
}

export default function Header({ showBackButton = false, backHref = '/', title }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Início', href: '/', icon: <Home size={18} /> },
    { label: 'Instituições', href: '/instituicoes', icon: <Building2 size={18} /> },
    { label: 'Exames', href: '/exames', icon: <FileQuestion size={18} /> },
    { label: 'Blog', href: '/blog', icon: <BookOpen size={18} /> },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3">
              {showBackButton && (
                <Link href={backHref} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
              
              <Link href="/" className="flex items-center gap-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl">M</span>
                </div>
                <span className="font-bold text-lg sm:text-xl text-gray-900 hidden xs:block">
                  Meu<span className="text-primary">Exame</span>
                </span>
              </Link>
            </div>

            {/* Center - Title */}
            {title && (
              <h1 className="hidden md:block text-lg font-semibold text-gray-900">{title}</h1>
            )}

            {/* Right */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Desktop Navigation */}
              {!isMobile && (
                <nav className="hidden lg:flex items-center gap-1 mr-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              )}

              {/* Search - Desktop */}
              {!isMobile && (
                <button className="p-2.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors">
                  <Search size={20} />
                </button>
              )}

              {/* Notifications - Desktop */}
              {!isMobile && (
                <button className="relative p-2.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative hidden sm:block">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={16} className="text-gray-400 hidden md:block" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b bg-gray-50">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="py-2">
                            <Link href="/perfil" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                              <User size={18} /> Meu Perfil
                            </Link>
                            <Link href="/configuracoes" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                              <Settings size={18} /> Configurações
                            </Link>
                          </div>
                          <div className="py-2 border-t">
                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full">
                              <LogOut size={18} /> Terminar Sessão
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="px-3 py-2 text-gray-600 hover:text-primary font-medium text-sm">
                    Entrar
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm">
                    Criar Conta
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden bg-white border-t"
            >
              <nav className="px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5"
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t mt-4 space-y-2">
                  {user ? (
                    <>
                      <Link href="/perfil" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                        <User size={18} /> Meu Perfil
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full">
                        <LogOut size={18} /> Terminar Sessão
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-center border-2 border-primary text-primary rounded-xl font-medium">
                        Entrar
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-center bg-primary text-white rounded-xl font-medium">
                        Criar Conta
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
