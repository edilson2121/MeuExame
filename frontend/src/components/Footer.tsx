'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sections = [
    {
      title: 'Plataforma',
      links: [
        { label: 'Início', href: '/' },
        { label: 'Instituições', href: '/instituicoes' },
        { label: 'Exames', href: '/exames' },
        { label: 'Preços', href: '/precos' },
      ]
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Ajuda', href: '/ajuda' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contacto', href: '/contacto' },
        { label: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Termos de Uso', href: '/termos' },
        { label: 'Privacidade', href: '/privacidade' },
        { label: 'Cookies', href: '/cookies' },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-white">MeuExame</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              A plataforma líder de exames de admissão em Moçambique.
            </p>
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-gray-500" />
            </div>
          </div>

          {/* Links */}
          {isMobile ? (
            <div className="sm:col-span-2 col-span-1 space-y-2">
              <button 
                onClick={() => setIsSectionsOpen(!isSectionsOpen)}
                className="w-full flex items-center justify-between py-2 text-white font-semibold"
              >
                <span>Secções</span>
                {isSectionsOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              {isSectionsOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="font-semibold text-white mb-3">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="mailto:info@meuexame.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={16} />
                <span>info@meuexame.com</span>
              </a>
              <a href="tel:+25821234567" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={16} />
                <span>+258 21 234 567</span>
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Maputo, Moçambique</span>
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} MeuExame. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      <div className="h-16 lg:hidden" />
    </footer>
  );
}
