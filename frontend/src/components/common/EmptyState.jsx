import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel = null,
  onAction = null,
  compact = false,
  className = ''
}) {
  const { t } = useTranslation();

  const displayTitle = title || t('emptyStates.defaultTitle', 'No Records Found');
  const displayDesc = description !== undefined ? description : t('emptyStates.defaultDesc', 'There are no active records in this category currently.');

  if (compact) {
    return (
      <div className={`p-4 text-center text-xs text-slate-500 font-medium ${className}`}>
        <Icon className="w-5 h-5 mx-auto text-slate-400 mb-1" />
        <p>{displayDesc || displayTitle}</p>
      </div>
    );
  }

  return (
    <div className={`rural-card p-8 text-center flex flex-col items-center justify-center space-y-3 border-dashed border-slate-300 bg-slate-50/50 animate-in fade-in duration-200 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">{displayTitle}</h4>
        {displayDesc && <p className="text-xs text-slate-500 leading-relaxed">{displayDesc}</p>}
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-800 border border-ruralTeal-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
