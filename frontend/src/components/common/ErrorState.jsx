import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function ErrorState({
  title,
  error,
  onRetry = null,
  compact = false,
  className = ''
}) {
  const { t } = useTranslation();

  const displayTitle = title || t('errors.defaultTitle', 'Unable to Load Healthcare Data');
  const displayError = error !== undefined ? error : t('errors.defaultDesc', 'A network or server communication error occurred.');

  if (compact) {
    return (
      <div className={`flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 ${className}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{displayError}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('common.retry', 'Retry')}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`rural-card p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4 border-rose-200 bg-rose-50/40 animate-in fade-in duration-200 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-700 shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-md">
        <h4 className="text-base font-bold text-slate-900 tracking-tight">{displayTitle}</h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{displayError}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('errors.retryBtn', 'Retry Request')}</span>
        </button>
      )}
    </div>
  );
}
