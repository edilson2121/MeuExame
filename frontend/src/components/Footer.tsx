'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Youtube, Linkedin, MessageCircle } from 'lucide-react';

const SOCIAL_ICONS: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};

const SOCIAL_COLORS: Record<string, string> = {
  facebook: 'hover:bg-[#1877F2] hover:text-white',
  instagram: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white',
  twitter: 'hover:bg-[#1DA1F2] hover:text-white',
  youtube: 'hover:bg-[#FF0000] hover:text-white',
  linkedin: 'hover:bg-[#0A66C2] hover:text-white',
  whatsapp: 'hover:bg-[#25D366] hover:text-white',
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
                  const IconComponent = SOCIAL_ICONS[social.platform] || Globe;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SOCIAL_COLORS[social.platform] || ''}`}
                      title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    >
                      <IconComponent size={18} />
                    </a>
                  );
                })
              ) : (
                // Default social icons when no data
                <>
                  <a href="https://facebook.com/meuexame" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SOCIAL_COLORS.facebook}`}>
                    <Facebook size={18} />
                  </a>
                  <a href="https://instagram.com/meuexame" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SOCIAL_COLORS.instagram}`}>
                    <Instagram size={18} />
                  </a>
                  <a href="https://twitter.com/meuexame" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SOCIAL_COLORS.twitter}`}>
                    <Twitter size={18} />
                  </a>
                  <a href="https://wa.me/258XXXXXXXXX" target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-all ${SOCIAL_COLORS.whatsapp}`}>
                    <MessageCircle size={18} />
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
