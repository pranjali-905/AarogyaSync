import React from 'react';
import { Loader2, HeartPulse } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function LoadingState({
  message,
  subtitle,
  compact = false,
  className = ''
}) {
  const { t } = useTranslation();

  const displayMessage = message || t('common.loading', 'Loading healthcare data...');
  const displaySubtitle = subtitle !== undefined ? subtitle : t('common.connectingNetwork', 'Connecting with rural healthcare network');

  if (compact) {
    return (
      <div className={`flex items-center justify-center gap-2 p-4 text-xs text-slate-500 font-medium ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-ruralTeal-600 shrink-0" />
        <span>{displayMessage}</span>
      </div>
    );
  }

  return (
    <div className={`rural-card p-8 text-center flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-200 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-ruralTeal-50 border border-ruralTeal-200 flex items-center justify-center text-ruralTeal-700 shadow-2xs">
          <HeartPulse className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs">
          <Loader2 className="w-4 h-4 animate-spin text-ruralTeal-600" />
        </div>
      </div>
      <div className="space-y-0.5">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">{displayMessage}</h4>
        {displaySubtitle && <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{displaySubtitle}</p>}
      </div>
    </div>
  );
}
