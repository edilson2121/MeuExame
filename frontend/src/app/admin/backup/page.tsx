'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Database,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Shield,
  Calendar,
  HardDrive,
  AlertTriangle,
  Loader2,
  Upload,
  Play,
  Pause,
  Eye,
  FileJson,
  Zap,
} from 'lucide-react';

interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  type: string;
  status: string;
  tables?: string[];
  recordsCount?: Record<string, number>;
}

interface StatusData {
  connected: boolean;
  latency: number;
  backupCount: number;
  config: any;
  lastBackup: BackupInfo | null;
}

export default function BackupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [status, setStatus] = useState<StatusData | null>(null);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<BackupInfo | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuth();
    fetchStatus();
    fetchBackups();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') {
      router.push('/home');
    }
  };

  const getToken = () => localStorage.getItem('token');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${apiUrl}/backup/status`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await fetch(`${apiUrl}/backup/list`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBackups(data);
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${apiUrl}/backup/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        showNotification('success', '✅ Backup criado com sucesso!');
        fetchBackups();
        fetchStatus();
      } else {
        showNotification('error', '❌ Erro ao criar backup');
      }
    } catch (error) {
      showNotification('error', '❌ Erro de conexão');
    } finally {
      setCreating(false);
    }
  };

  const restoreBackup = async (filename: string) => {
    if (!confirm('⚠️ Tem certeza que deseja restaurar este backup?\n\nOs dados atuais serão substituídos!')) {
      return;
    }

    setRestoring(filename);
    try {
      const res = await fetch(`${apiUrl}/backup/restore/${filename}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        showNotification('success', `✅ Backup restaurado: ${data.restored} registros`);
      } else {
        showNotification('error', '❌ Erro ao restaurar backup');
      }
    } catch (error) {
      showNotification('error', '❌ Erro de conexão');
    } finally {
      setRestoring(null);
    }
  };

  const downloadBackup = async (filename: string) => {
    try {
      const token = getToken();
      const link = document.createElement('a');
      link.href = `${apiUrl}/backup/download/${filename}?token=${token}`;
      link.download = filename;
      link.click();
      showNotification('success', '📥 Download iniciado');
    } catch (error) {
      showNotification('error', '❌ Erro ao baixar backup');
    }
  };

  const deleteBackup = async (filename: string) => {
    if (!confirm('🗑️ Tem certeza que deseja eliminar este backup?')) {
      return;
    }

    setDeleting(filename);
    try {
      const res = await fetch(`${apiUrl}/backup/${filename}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        showNotification('success', '🗑️ Backup eliminado');
        fetchBackups();
        fetchStatus();
      } else {
        showNotification('error', '❌ Erro ao eliminar backup');
      }
    } catch (error) {
      showNotification('error', '❌ Erro de conexão');
    } finally {
      setDeleting(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeSince = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    return 'agora';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  Sistema de Backup
                </h1>
                <p className="text-slate-400 text-sm mt-1">Gerir backups automáticos e restaurações</p>
              </div>
            </div>

            <button
              onClick={createBackup}
              disabled={creating}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25"
            >
              {creating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              Criar Backup Agora
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-pulse ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Database Status */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <div className={`w-3 h-3 rounded-full ${status?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <p className="text-slate-400 text-sm">Base de Dados</p>
            <p className="text-white font-semibold mt-1">
              {status?.connected ? (
                <span className="text-green-400">Conectada</span>
              ) : (
                <span className="text-red-400">Desconectada</span>
              )}
            </p>
            {status?.latency && (
              <p className="text-xs text-slate-500 mt-1">Latência: {status.latency}ms</p>
            )}
          </div>

          {/* Total Backups */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">Total de Backups</p>
            <p className="text-white font-semibold text-2xl mt-1">{backups.length}</p>
          </div>

          {/* Last Backup */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">Último Backup</p>
            <p className="text-white font-semibold mt-1">
              {status?.lastBackup ? (
                timeSince(status.lastBackup.createdAt)
              ) : (
                <span className="text-slate-500">Nunca</span>
              )}
            </p>
          </div>

          {/* Security */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">Proteção</p>
            <p className="text-white font-semibold mt-1">Ativo 24/7</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Backups Automáticos</h3>
              <p className="text-slate-400 text-sm">
                O sistema cria backups automáticos diariamente às 02:00h. Você pode manter até 7 backups.
                Os mais antigos são eliminados automaticamente para poupar espaço.
              </p>
            </div>
          </div>
        </div>

        {/* Backups List */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-slate-400" />
              Histórico de Backups
            </h2>
          </div>

          {backups.length === 0 ? (
            <div className="p-12 text-center">
              <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Nenhum backup encontrado</p>
              <p className="text-slate-500 text-sm">Clique em "Criar Backup Agora" para iniciar</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {backups.map((backup) => (
                <div key={backup.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                        <FileJson className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{backup.filename}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(backup.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {formatSize(backup.size)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            {Object.values(backup.recordsCount || {}).reduce((a, b) => a + b, 0)} registros
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBackup(backup)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => downloadBackup(backup.filename)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                        title="Baixar"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => restoreBackup(backup.filename)}
                        disabled={restoring === backup.filename}
                        className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Restaurar"
                      >
                        {restoring === backup.filename ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteBackup(backup.filename)}
                        disabled={deleting === backup.filename}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        {deleting === backup.filename ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backup Details Modal */}
      {selectedBackup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBackup(null)}>
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Detalhes do Backup</h3>
              <button onClick={() => setSelectedBackup(null)} className="p-2 hover:bg-slate-700 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Arquivo</p>
                    <p className="text-white font-medium">{selectedBackup.filename}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Tamanho</p>
                    <p className="text-white font-medium">{formatSize(selectedBackup.size)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Data</p>
                    <p className="text-white font-medium">{formatDate(selectedBackup.createdAt)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Registos</p>
                    <p className="text-white font-medium">{Object.values(selectedBackup.recordsCount || {}).reduce((a, b) => a + b, 0)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-3">Tabelas Incluídas</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedBackup.tables?.map((table) => (
                      <div key={table} className="bg-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300">
                        {table}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-3">Registos por Tabela</p>
                  <div className="space-y-2">
                    {Object.entries(selectedBackup.recordsCount || {}).map(([table, count]) => (
                      <div key={table} className="flex items-center justify-between bg-slate-700/50 rounded-lg px-3 py-2">
                        <span className="text-slate-300">{table}</span>
                        <span className="text-cyan-400 font-medium">{count} registos</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => { downloadBackup(selectedBackup.filename); setSelectedBackup(null); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white font-medium rounded-xl hover:bg-cyan-500 transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
              <button
                onClick={() => { restoreBackup(selectedBackup.filename); setSelectedBackup(null); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-500 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
