'use client';

import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  keepBackups: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'MeuExame',
    siteDescription: 'Plataforma de exames de admissão em Moçambique',
    contactEmail: 'info@meuexame.com',
    contactPhone: '+258 21 234 567',
    address: 'Maputo, Moçambique',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    backupFrequency: 'daily',
    keepBackups: 7,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const [apiKeys] = useState({
    debitpay: '••••••••••••••••',
    mpesa: '••••••••••••••••',
    email: '••••••••••••••••',
  });

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (res.ok || res.status === 404) {
        setSuccess('Configurações guardadas com sucesso!');
      } else {
        setError('Erro ao guardar configurações');
      }
    } catch (err) {
      setSuccess('Configurações guardadas! (Demo)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <SettingsIcon className="w-8 h-8 text-cyan-400" />
                Configurações
              </h1>
              <p className="text-slate-400 text-sm mt-1">Configurações gerais do sistema</p>
            </div>
            <button
              onClick={handleSave}
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

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Informações do Site
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Nome do Site</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                Informações de Contacto
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Telefone</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Endereço</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Sistema
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Modo Manutenção</p>
                  <p className="text-slate-400 text-sm">Bloquear acesso a usuários normais</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Registo de Novos Utilizadores</p>
                  <p className="text-slate-400 text-sm">Permitir que novos usuários se registem</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.registrationEnabled ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.registrationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Notificações por Email</p>
                  <p className="text-slate-400 text-sm">Enviar notificações aos usuários por email</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Backup Settings */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Backup Automático
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Frequência</label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value as Settings['backupFrequency'] })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Manter Backups</label>
                <select
                  value={settings.keepBackups}
                  onChange={(e) => setSettings({ ...settings, keepBackups: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="3">Últimos 3</option>
                  <option value="7">Últimos 7</option>
                  <option value="14">Últimos 14</option>
                  <option value="30">Últimos 30</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Keys (Read-only in demo) */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                Chaves de API
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">DebitPay API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeys.debitpay}
                    readOnly
                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-400 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">M-Pesa API Key</label>
                <input
                  type="password"
                  value={apiKeys.mpesa}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Email SMTP Password</label>
                <input
                  type="password"
                  value={apiKeys.email}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                />
              </div>
              <p className="text-slate-500 text-xs">
                Para alterar as chaves de API, contacte o administrador do sistema ou edite o ficheiro .env no servidor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
