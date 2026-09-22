import React from 'react';
import { Inbox, FileQuestion } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  icon,
  title = 'No records found',
  description = 'There are currently no items available in this view.',
  action,
  actionLabel,
  onAction,
  className = '',
}) {
  const displayIcon = icon || <FileQuestion className="w-10 h-10 text-slate-300" />;

  return (
    <div className={`rural-card p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-4 text-slate-400">
        {displayIcon}
      </div>

      <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm leading-relaxed text-balance">
        {description}
      </p>

      {action ? (
        <div className="mt-5">{action}</div>
      ) : actionLabel && onAction ? (
        <div className="mt-5">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
