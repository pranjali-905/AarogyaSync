import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Pill, 
  Calendar, 
  RefreshCw, 
  X,
  Clock
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'High-Risk Pregnancy Flag',
    message: 'Meena Waghmare (34w) BP >= 145/95 flagged by Sunita Tai. Doctor review recommended.',
    type: 'danger',
    time: '12m ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Maternal Care Reminder',
    message: 'ANC 3 checkup and IFA tablet replenishment scheduled for 18 Sep 2026.',
    type: 'maternal',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Offline Sync Successful',
    message: '3 offline health triage checks and 1 patient registration successfully synced to server.',
    type: 'sync',
    time: '3h ago',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Essential Medicine Stock Alert',
    message: 'Paracetamol 500mg (1,200 tablets) and ORS packets restocked at Khed CHC.',
    type: 'info',
    time: 'Yesterday',
    unread: false,
  }
];

export default function NotificationsPopover() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const popoverRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'maternal':
        return <Pill className="w-4 h-4 text-rose-500" />;
      case 'sync':
        return <RefreshCw className="w-4 h-4 text-emerald-600" />;
      case 'info':
      default:
        return <Calendar className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-ring"
        title={t('nav.notifications', 'Notifications')}
        aria-label={`${t('nav.notifications', 'Notifications')} (${unreadCount})`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">
                {t('notifications.title', 'Healthcare Notifications')}
              </h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.2 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">
                  {t('notifications.newCount', '{count} new', { count: unreadCount })}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-ruralTeal-700 hover:text-ruralTeal-900 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t('notifications.markAllAsRead', 'Mark read')}</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                {t('notifications.emptyDesc', 'No notifications right now.')}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 relative ${
                    n.unread ? 'bg-ruralTeal-50/30' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {n.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {n.time}
                    </span>
                  </div>

                  <button
                    onClick={(e) => removeNotification(n.id, e)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
                    title={t('common.dismiss', 'Dismiss')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400">
              {t('notifications.nhmAlertChannel', 'National Health Mission (NHM) Alert Channel')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
