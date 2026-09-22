import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_NOTIFICATIONS } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Bell,
  ArrowLeft,
  Calendar,
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeNotification = (n) => ({
    id: n.id,
    title: n.title,
    message: n.message || n.content,
    type: n.type || 'ADVISORY',
    time: n.created_at ? new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (n.time || 'Recent'),
    unread: n.unread !== undefined ? n.unread : !(n.is_read || n.read),
    link: n.link || n.metadata?.link || '/patient'
  });

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.notifications.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setNotifications(res.data.map(normalizeNotification));
      } else if (res && Array.isArray(res.data)) {
        setNotifications(res.data.map(normalizeNotification));
      } else {
        setNotifications(MOCK_NOTIFICATIONS.map(normalizeNotification));
      }
    } catch (err) {
      console.warn('Fallback to local notifications:', err);
      setNotifications(MOCK_NOTIFICATIONS.map(normalizeNotification));
      setError('Live notification feed unavailable. Displaying local notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllRead = async () => {
    try {
      await apiService.notifications.markAllAsRead();
    } catch (err) {
      console.warn('Local read state update:', err);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = async (notif) => {
    if (notif.unread) {
      try {
        await apiService.notifications.markAsRead(notif.id);
      } catch (err) {
        console.warn('Local mark read:', err);
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
      );
    }
  };

  const filtered = filterUnread ? notifications.filter((n) => n.unread) : notifications;

  const getIcon = (type) => {
    switch (type) {
      case 'APPOINTMENT':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'MEDICINE':
        return <Pill className="w-5 h-5 text-emerald-600" />;
      case 'FOLLOW_UP':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'ADVISORY':
      default:
        return <AlertTriangle className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-ruralTeal-700" />
              {t('patient.notificationsTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Appointments, medication reminders & rural health advisories
            </p>
          </div>
        </div>

        {notifications.some((n) => n.unread) && (
          <button
            onClick={markAllRead}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <ErrorState
          compact
          title="Notice"
          error={error}
          onRetry={loadNotifications}
        />
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterUnread(false)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            !filterUnread ? 'bg-ruralTeal-700 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterUnread(true)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filterUnread ? 'bg-ruralTeal-700 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Unread ({notifications.filter((n) => n.unread).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <LoadingState message="Checking health advisories..." subtitle="Retrieving alerts from District Health System" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Notifications"
            description="You are completely up to date on all your health tasks and checkups."
            actionLabel={filterUnread ? "View All Notifications" : null}
            onAction={() => setFilterUnread(false)}
          />
        ) : (
          filtered.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => handleNotificationClick(item)}
              className={`rural-card p-4 sm:p-5 flex items-start gap-4 rural-card-hover group border ${
                item.unread ? 'border-ruralTeal-300 bg-ruralTeal-50/20' : 'border-slate-200/80'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-ruralTeal-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-ruralTeal-700 group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
