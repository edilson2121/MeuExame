'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
  Check,
  X,
  Trash2,
  RefreshCw
} from 'lucide-react';
import Header from '@/components/Header';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export default function NotificacoesPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${apiUrl}/notifications/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        // Demo data
        setNotifications([
          {
            id: '1',
            title: 'Bem-vindo ao MeuExame!',
            message: 'Obrigado por se registrar. Explore os exames disponíveis e comece a sua preparação.',
            type: 'INFO',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '2',
            title: 'Novo exame disponível',
            message: 'Foi adicionado um novo exame de Matemática. Check it out!',
            type: 'SUCCESS',
            isRead: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            title: 'Manutenção programada',
            message: 'O sistema estará em manutenção no domingo das 2h às 6h.',
            type: 'WARNING',
            isRead: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: '4',
            title: 'Pagamento confirmado',
            message: 'O seu pagamento foi confirmado. Tem acesso aos exames premium.',
            type: 'SUCCESS',
            isRead: true,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      // Demo data
      setNotifications([
        {
          id: '1',
          title: 'Bem-vindo ao MeuExame!',
          message: 'Obrigado por se registrar. Explore os exames disponíveis.',
          type: 'INFO',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  const deleteNotification = async (id: string) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INFO': return <Info className="w-5 h-5 text-blue-400" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INFO': return 'bg-blue-500/20 border-blue-500/30';
      case 'WARNING': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'SUCCESS': return 'bg-green-500/20 border-green-500/30';
      case 'ERROR': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-7 h-7 text-green-600" />
              Notificações
            </h1>
            {unreadCount > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Marcar todas como lidas
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Não lidas
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-500">A carregar notificações...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'Todas as notificações foram lidas!' 
                : 'Nenhuma notificação'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
                  notification.isRead 
                    ? 'border-gray-200' 
                    : 'border-green-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Marcar como lida"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
