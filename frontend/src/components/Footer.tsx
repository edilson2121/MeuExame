'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone, MapPin, Globe } from 'lucide-react';

// Social Media SVG Icons
const SocialIcons: Record<string, { icon: JSX.Element; color: string }> = {
  facebook: {
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    color: 'hover:bg-[#1877F2] hover:text-white',
  },
  instagram: {
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white',
  },
  twitter: {
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    color: 'hover:bg-[#1DA1F2] hover:text-white',
  },
  youtube: {
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    color: 'hover:bg-[#FF0000] hover:text-white',
  },
  linkedin: {
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    color: 'hover:bg-[#0A66C2] hover:text-white',
  },
  whatsapp: {
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    color: 'hover:bg-[#25D366] hover:text-white',
  },
};

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Fetch social media links
    fetch(`${apiUrl}/social-media`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSocialLinks(data))
      .catch(() => setSocialLinks([]));

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
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => {
                  const socialIcon = SocialIcons[social.platform];
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${socialIcon?.color || ''}`}
                      title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    >
                      {socialIcon?.icon}
                    </a>
                  );
                })
              ) : (
                // Default social icons when no data
                <>
                  <a href="https://facebook.com/meuexame" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SocialIcons.facebook.color}`}>
                    {SocialIcons.facebook.icon}
                  </a>
                  <a href="https://instagram.com/meuexame" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SocialIcons.instagram.color}`}>
                    {SocialIcons.instagram.icon}
                  </a>
                  <a href="https://twitter.com/meuexame" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SocialIcons.twitter.color}`}>
                    {SocialIcons.twitter.icon}
                  </a>
                  <a href="https://wa.me/258XXXXXXXXX" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SocialIcons.whatsapp.color}`}>
                    {SocialIcons.whatsapp.icon}
                  </a>
                </>
              )}
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
