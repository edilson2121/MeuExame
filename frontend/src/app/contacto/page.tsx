'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle, Facebook, Instagram, Twitter, Linkedin, MessageSquare } from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@meuexame.com',
      href: 'mailto:info@meuexame.com',
    },
    {
      icon: Phone,
      title: 'Telefone',
      value: '+258 21 234 567',
      href: 'tel:+25821234567',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      value: '+258 84 123 4567',
      href: 'https://wa.me/258841234567',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      value: 'Av. Julius Nyerere, 1234\nMaputo, Moçambique',
      href: null,
    },
    {
      icon: Clock,
      title: 'Horário',
      value: 'Seg-Sex: 8h-18h\nSáb: 9h-13h',
      href: null,
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/meuexame', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/meuexame', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/meuexame', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/meuexame', label: 'LinkedIn' },
    { icon: MessageSquare, href: 'https://wa.me/258841234567', label: 'WhatsApp' },
  ];

  const subjects = [
    'Questões sobre exames',
    'Problemas com pagamento',
    'Suporte técnico',
    'Sugestões',
    'Parcerias',
    'Outros',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Contacte-nos</h1>
          <p className="text-green-100">
            Estamos aqui para ajudá-lo. Entre em contacto connosco.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Envie-nos uma mensagem</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mensagem enviada!</h3>
                  <p className="text-gray-600 mb-4">
                    Obrigado por nos contactar. Responderemos em breve.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="O seu nome"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    >
                      <option value="">Selecione um assunto</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                      placeholder="Escreva a sua mensagem aqui..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informações de Contacto</h2>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-gray-600 hover:text-primary transition-colors whitespace-pre-line"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Siga-nos</h2>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Mapa de Maputo</p>
                <p className="text-sm">Av. Julius Nyerere, 1234</p>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-primary/5 rounded-2xl p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Precisa de ajuda rápida?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Consulte as nossas perguntas frequentes para respostas imediatas.
              </p>
              <a href="/faq" className="text-primary hover:text-primary-dark font-medium">
                Ver FAQ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
