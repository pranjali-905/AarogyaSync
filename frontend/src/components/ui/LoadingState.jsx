import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', className = '', label = 'Loading...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 p-6 ${className}`} role="status">
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-ruralTeal-700`} />
      {label && <span className="text-xs font-semibold text-slate-500">{label}</span>}
      <span className="sr-only">Loading content</span>
    </div>
  );
}

export function Skeleton({ className = '', rounded = 'rounded-xl', ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`rural-card p-5 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
}

export function TableSkeleton({ rows = 4, cols = 4, className = '' }) {
  return (
    <div className={`rural-card overflow-hidden ${className}`}>
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100 p-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="py-3 px-4 flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSpinner;
