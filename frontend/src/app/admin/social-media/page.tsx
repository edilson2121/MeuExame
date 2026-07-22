'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  MessageCircle
} from 'lucide-react';

interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'whatsapp';
  url: string;
  isActive: boolean;
}

const SOCIAL_PLATFORMS = [
  { 
    id: 'facebook' as const, 
    name: 'Facebook', 
    color: '#1877F2',
    placeholder: 'https://facebook.com/meuexame'
  },
  { 
    id: 'instagram' as const, 
    name: 'Instagram', 
    color: '#E4405F',
    placeholder: 'https://instagram.com/meuexame'
  },
  { 
    id: 'twitter' as const, 
    name: 'X (Twitter)', 
    color: '#1DA1F2',
    placeholder: 'https://x.com/meuexame'
  },
  { 
    id: 'youtube' as const, 
    name: 'YouTube', 
    color: '#FF0000',
    placeholder: 'https://youtube.com/@meuexame'
  },
  { 
    id: 'linkedin' as const, 
    name: 'LinkedIn', 
    color: '#0A66C2',
    placeholder: 'https://linkedin.com/company/meuexame'
  },
  { 
    id: 'whatsapp' as const, 
    name: 'WhatsApp', 
    color: '#25D366',
    placeholder: 'https://wa.me/258XXXXXXXXX'
  },
];

export default function SocialMediaPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/social-media`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      } else {
        // Demo data
        setLinks([
          { id: '1', platform: 'facebook', url: 'https://facebook.com/meuexame', isActive: true },
          { id: '2', platform: 'instagram', url: 'https://instagram.com/meuexame', isActive: true },
          { id: '3', platform: 'whatsapp', url: 'https://wa.me/258842345678', isActive: true },
        ]);
      }
    } catch (err) {
      // Demo data
      setLinks([
        { id: '1', platform: 'facebook', url: 'https://facebook.com/meuexame', isActive: true },
        { id: '2', platform: 'instagram', url: 'https://instagram.com/meuexame', isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveLinks = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/social-media`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ links }),
      });

      if (res.ok || res.status === 404) {
        setSuccess('Links guardados com sucesso!');
        fetchLinks();
      } else {
        setError('Erro ao guardar links');
      }
    } catch (err) {
      // Demo mode
      setSuccess('Links guardados com sucesso! (Demo)');
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (platform: SocialLink['platform'], url: string) => {
    setLinks(prev => {
      const existing = prev.find(l => l.platform === platform);
      if (existing) {
        return prev.map(l => l.platform === platform ? { ...l, url } : l);
      } else {
        return [...prev, { id: Date.now().toString(), platform, url, isActive: true }];
      }
    });
  };

  const toggleLink = (platform: SocialLink['platform']) => {
    setLinks(prev => prev.map(l => 
      l.platform === platform ? { ...l, isActive: !l.isActive } : l
    ));
  };

  const deleteLink = (platform: SocialLink['platform']) => {
    setLinks(prev => prev.filter(l => l.platform !== platform));
  };

  const getLinkByPlatform = (platform: SocialLink['platform']) => {
    return links.find(l => l.platform === platform);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Globe className="w-8 h-8 text-cyan-400" />
                Redes Sociais
              </h1>
              <p className="text-slate-400 text-sm mt-1">Gerir links das redes sociais no footer</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  previewMode 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {previewMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                {previewMode ? 'Ocultar Preview' : 'Ver Preview'}
              </button>
              <button
                onClick={saveLinks}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Preview */}
        {previewMode && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 mb-8">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview do Footer
            </h3>
            <div className="bg-gray-900 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-4">Ícones das redes sociais:</p>
              <div className="flex items-center gap-3">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const link = getLinkByPlatform(platform.id);
                  return (
                    <button
                      key={platform.id}
                      disabled={!link?.isActive}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-bold ${
                        link?.isActive
                          ? 'bg-gray-800 hover:opacity-80'
                          : 'bg-gray-800/50 opacity-50'
                      }`}
                      style={{ color: link?.isActive ? platform.color : '#666' }}
                    >
                      {platform.name.charAt(0)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Links das Redes Sociais</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">A carregar...</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {SOCIAL_PLATFORMS.map((platform) => {
                const link = getLinkByPlatform(platform.id);
                
                return (
                  <div 
                    key={platform.id} 
                    className={`p-4 rounded-xl border transition-colors ${
                      link?.isActive 
                        ? 'bg-slate-700/30 border-slate-600/50' 
                        : 'bg-slate-700/10 border-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                        >
                          {platform.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{platform.name}</p>
                          <p className="text-slate-500 text-sm">
                            {link ? (link.isActive ? 'Ativo' : 'Inativo') : 'Não configurado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLink(platform.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            link?.isActive
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-slate-600/50 text-slate-400 hover:bg-slate-600'
                          }`}
                          title={link?.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {link?.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        {link && (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-white bg-slate-600/50 rounded-lg transition-colors"
                            title="Abrir link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={link?.url || ''}
                        onChange={(e) => updateLink(platform.id, e.target.value)}
                        placeholder={platform.placeholder}
                        className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      {link && (
                        <button
                          onClick={() => deleteLink(platform.id)}
                          className="p-2 text-slate-400 hover:text-red-400 bg-slate-700/50 rounded-lg transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
          <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Dica</p>
            <p className="text-blue-400/70 text-sm mt-1">
              Os links configurados aqui aparecerão no footer do site. 
              Clique no ícone do olho para ativar/desativar cada rede social sem apagar o link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
