import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export function ErrorState({
  icon,
  title = 'Something went wrong',
  message = 'We encountered an error while loading healthcare records. Please check your connectivity and try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) {
  const displayIcon = icon || <AlertCircle className="w-10 h-10 text-rose-500" />;

  return (
    <div className={`rural-card p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto border-rose-200 bg-rose-50/20 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600">
        {displayIcon}
      </div>

      <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-sm leading-relaxed text-balance">
        {message}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4 text-slate-500" />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
