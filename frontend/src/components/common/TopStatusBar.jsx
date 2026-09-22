import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { PhoneCall, Signal, Wifi, WifiOff, LayoutDashboard } from 'lucide-react';

/**
 * TopStatusBar - 100% width responsive mobile & desktop status strip
 * Displays:
 * 1. Live device / clinical time
 * 2. Cellular/Network signal indicator (4G / Online / Offline)
 * 3. 108 SOS Emergency hotline quick dial
 * 4. Dashboard navigation link
 * 
 * Strict Anti-Gravity rules:
 * - 100% width (w-full max-w-full)
 * - Flexbox layout with proper padding/margins on all sides
 * - Zero clipping, zero overflow, no negative margins
 */
export default function TopStatusBar() {
  const { activeRole } = useAuth();
  const { t } = useTranslation();

  // 1. Live device time
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // 2. Network connectivity status
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOffline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine dashboard link according to active persona
  const getDashboardPath = () => {
    switch (activeRole) {
      case 'ASHA':
        return '/asha';
      case 'DOCTOR':
        return '/doctor';
      case 'ADMIN':
        return '/admin';
      case 'PATIENT':
      default:
        return '/patient';
    }
  };

  return (
    <div
      id="top-status-bar"
      className="w-full max-w-full bg-slate-900 text-slate-100 border-b border-slate-800/80 px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 text-xs select-none z-50 shrink-0"
    >
      {/* Left: Time + Signal status */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Device Time */}
        <div className="flex items-center gap-1 font-semibold text-slate-200 tracking-tight shrink-0">
          <span className="text-[11px] sm:text-xs font-mono font-bold">{currentTime}</span>
        </div>

        {/* Signal & Network Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isOnline ? (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-medium"
              title="Cellular 4G Network Connected"
            >
              <Signal className="w-3 h-3 text-emerald-400" />
              <span className="font-bold">4G</span>
              <span className="hidden xs:inline">• Online</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] sm:text-[11px] font-medium"
              title="Offline Mode Active"
            >
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Dashboard Link + 108 SOS Hotline */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Dashboard Link */}
        <Link
          to={getDashboardPath()}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] sm:text-xs font-semibold transition-colors focus-ring shrink-0"
          title="Go to main Dashboard"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-ruralTeal-400 shrink-0" />
          <span>{t('nav.dashboard', 'Dashboard')}</span>
        </Link>

        {/* 108 SOS Hotline Link */}
        <a
          href="tel:108"
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-lg text-[11px] sm:text-xs font-extrabold shadow-sm transition-all shrink-0 focus-ring"
          title="Emergency 108 Ambulance Hotline"
          aria-label="Call 108 Emergency SOS"
        >
          <PhoneCall className="w-3 h-3 shrink-0 animate-pulse" />
          <span className="tracking-wide">108 SOS</span>
        </a>
      </div>
    </div>
  );
}
