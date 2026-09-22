import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ArrowRight,
  ShieldAlert,
  Trash2,
  FileText
} from 'lucide-react';

export default function DoctorNotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(MOCK_DOCTOR_DATA.notifications);
  const [filter, setFilter] = useState('ALL'); // ALL | UNREAD

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return n.unread;
    return true;
  });

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/doctor" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('doctor.dashboardTitle', 'Doctor Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('doctor.notifications', 'Notifications')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary-600" />
            Medical Officer Clinical Notifications
          </h1>
          <p className="text-slate-600 mt-1">
            Emergency field triage alerts, incoming store-and-forward cases, and diagnostic lab report notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[44px]"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'UNREAD'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({notifications.filter((n) => n.unread).length})
        </button>
      </div>

      {/* 3. Notifications Stream */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const isRed = n.priority === 'RED';
          const isHigh = n.priority === 'HIGH';

          return (
            <div
              key={n.id}
              className={`rounded-2xl border p-4 sm:p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                n.unread
                  ? isRed
                    ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-200'
                    : 'bg-primary-50/30 border-primary-200 ring-1 ring-primary-100'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isRed
                      ? 'bg-red-100 text-red-700'
                      : isHigh
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-primary-100 text-primary-700'
                  }`}
                >
                  {isRed ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{n.title}</h3>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary-600" />
                    )}
                    <span className="text-xs text-slate-400">• {n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  to={n.actionLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition-all min-h-[40px]"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => clearNotification(n.id)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all min-h-[40px]"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">Inbox Zero</h3>
            <p className="text-xs text-slate-500 mt-1">No unread notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
