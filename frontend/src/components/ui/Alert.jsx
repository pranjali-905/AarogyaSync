import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  action,
  onClose,
  className = '',
  ...props
}) {
  const configs = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
      titleColor: 'text-blue-950',
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      titleColor: 'text-emerald-950',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      titleColor: 'text-amber-950',
    },
    danger: {
      container: 'bg-rose-50 border-rose-200 text-rose-950',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      titleColor: 'text-rose-950',
    }
  };

  const currentConfig = configs[variant] || configs.info;
  const displayIcon = icon !== undefined ? icon : currentConfig.icon;

  return (
    <div
      role="alert"
      className={`rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 transition-all ${currentConfig.container} ${className}`}
      {...props}
    >
      {displayIcon && <div className="mt-0.5">{displayIcon}</div>}

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`text-sm sm:text-base font-bold ${currentConfig.titleColor} tracking-tight`}>
            {title}
          </h4>
        )}
        {children && (
          <div className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
            {children}
          </div>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Close alert"
          className="p-1 -mr-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
