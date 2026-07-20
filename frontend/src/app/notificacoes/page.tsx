'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  FileText,
  CreditCard,
  Settings,
  Gift,
  Info,
  Loader2,
  X,
} from 'lucide-react';

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  GENERAL: <Bell className="w-5 h-5" />,
  EXAM: <FileText className="w-5 h-5" />,
  PAYMENT: <CreditCard className="w-5 h-5" />,
  SYSTEM: <Settings className="w-5 h-5" />,
  PROMOTION: <Gift className="w-5 h-5" />,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  GENERAL: 'bg-blue-100 text-blue-600',
  EXAM: 'bg-green-100 text-green-600',
  PAYMENT: 'bg-yellow-100 text-yellow-600',
  SYSTEM: 'bg-gray-100 text-gray-600',
  PROMOTION: 'bg-pink-100 text-pink-600',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchNotifications();
  }, [router]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ));
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    setActionLoading('all');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteNotification = async (id: string) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Hoje';
    } else if (days === 1) {
      return 'Ontem';
    } else if (days < 7) {
      return `Há ${days} dias`;
    } else {
      return d.toLocaleDateString('pt-BR');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Notificações</h1>
            {unreadCount > 0 && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={actionLoading === 'all'}
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-2xl mx-auto py-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma notificação</p>
            <p className="text-sm text-gray-400">Você receberá notificações aqui</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white border-b border-gray-100 ${
                  !notification.isRead ? 'bg-green-50/50' : ''
                }`}
              >
                <div className="px-4 py-4 flex gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.GENERAL
                  }`}>
                    {NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.GENERAL}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            disabled={actionLoading === notification.id}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full"
                            title="Marcar como lida"
                          >
                            {actionLoading === notification.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          disabled={actionLoading === notification.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Link */}
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="inline-block mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        Ver detalhes →
                      </Link>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
