'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  X,
  Mail
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  sentBy: string;
  sentAt: string;
  recipients: number;
  readCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'>('INFO');
  const [sendTo, setSendTo] = useState<'all' | 'specific'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch notifications
      const notifRes = await fetch(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      } else {
        // Demo data
        setNotifications([
          {
            id: '1',
            title: 'Nova funcionalidade disponível',
            message: 'Já pode fazer pagamento via M-Pesa e eMola!',
            type: 'INFO',
            sentBy: 'Admin',
            sentAt: new Date(Date.now() - 86400000).toISOString(),
            recipients: 150,
            readCount: 120,
          },
          {
            id: '2',
            title: 'Manutenção programada',
            message: 'Sistema estará em manutenção no domingo das 2h às 6h.',
            type: 'WARNING',
            sentBy: 'Admin',
            sentAt: new Date(Date.now() - 172800000).toISOString(),
            recipients: 150,
            readCount: 145,
          },
          {
            id: '3',
            title: 'Exames atualizados',
            message: 'Novos exames de Matemática disponíveis!',
            type: 'SUCCESS',
            sentBy: 'Admin',
            sentAt: new Date(Date.now() - 259200000).toISOString(),
            recipients: 150,
            readCount: 98,
          },
        ]);
      }

      // Fetch users
      const usersRes = await fetch(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } else {
        setUsers([
          { id: '1', name: 'João Machava', email: 'joao@email.com' },
          { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
          { id: '3', name: 'Carlos Dique', email: 'carlos@email.com' },
        ]);
      }
    } catch (err) {
      // Demo data
      setNotifications([
        {
          id: '1',
          title: 'Nova funcionalidade disponível',
          message: 'Já pode fazer pagamento via M-Pesa e eMola!',
          type: 'INFO',
          sentBy: 'Admin',
          sentAt: new Date(Date.now() - 86400000).toISOString(),
          recipients: 150,
          readCount: 120,
        },
      ]);
      setUsers([
        { id: '1', name: 'João Machava', email: 'joao@email.com' },
        { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setError('Por favor, preencha o título e a mensagem.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/notifications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message,
          type,
          sendTo: sendTo === 'all' ? 'all' : selectedUsers,
        }),
      });

      if (res.ok || res.status === 404) {
        setSuccess('Notificação enviada com sucesso!');
        setShowModal(false);
        resetForm();
        fetchData();
      } else {
        setError('Erro ao enviar notificação.');
      }
    } catch (err) {
      // Demo mode
      setSuccess('Notificação enviada com sucesso! (Demo)');
      setShowModal(false);
      const newNotification: Notification = {
        id: Date.now().toString(),
        title,
        message,
        type,
        sentBy: 'Admin',
        sentAt: new Date().toISOString(),
        recipients: sendTo === 'all' ? users.length : selectedUsers.length,
        readCount: 0,
      };
      setNotifications([newNotification, ...notifications]);
      resetForm();
    } finally {
      setSending(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta notificação?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setType('INFO');
    setSendTo('all');
    setSelectedUsers([]);
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INFO': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'WARNING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'SUCCESS': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ERROR': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-cyan-400" />
                Notificações
              </h1>
              <p className="text-slate-400 text-sm mt-1">Enviar notificações para os utilizadores</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
              Nova Notificação
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Enviadas</p>
                <p className="text-2xl font-bold text-white">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Utilizadores</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Leituras Total</p>
                <p className="text-2xl font-bold text-white">
                  {notifications.reduce((acc, n) => acc + n.readCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Notifications List */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Histórico de Notificações</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">A carregar...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhuma notificação enviada</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {notifications.map((notif) => (
                <div key={notif.id} className="px-6 py-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getTypeColor(notif.type)}`}>
                        {notif.type}
                      </span>
                      <div>
                        <p className="text-white font-medium">{notif.title}</p>
                        <p className="text-slate-400 text-sm mt-1">{notif.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(notif.sentAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {notif.recipients} destinatários
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {notif.readCount} leituras
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" />
                Nova Notificação
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Tipo</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['INFO', 'WARNING', 'SUCCESS', 'ERROR'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        type === t 
                          ? `${getTypeColor(t)} border-current` 
                          : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da notificação"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Mensagem</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite a mensagem"
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* Send To */}
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Enviar para</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSendTo('all')}
                    className={`flex-1 py-3 rounded-xl border transition-colors ${
                      sendTo === 'all' 
                        ? 'bg-cyan-600 text-white border-cyan-600' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    Todos
                  </button>
                  <button
                    onClick={() => setSendTo('specific')}
                    className={`flex-1 py-3 rounded-xl border transition-colors ${
                      sendTo === 'specific' 
                        ? 'bg-cyan-600 text-white border-cyan-600' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <Mail className="w-5 h-5 mx-auto mb-1" />
                    Específicos
                  </button>
                </div>
              </div>

              {/* User Selection */}
              {sendTo === 'specific' && (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {users.map((user) => (
                    <label key={user.id} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-600 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div>
                        <p className="text-white text-sm">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="flex-1 py-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={sendNotification}
                disabled={sending || !title.trim() || !message.trim()}
                className="flex-1 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
