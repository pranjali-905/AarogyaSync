import React from 'react';

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  className = '',
  ...props
}) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-300',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    maternal: 'bg-rose-100 text-rose-900 border-rose-300',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    teal: 'bg-ruralTeal-50 text-ruralTeal-800 border-ruralTeal-200'
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    maternal: 'bg-rose-600',
    neutral: 'bg-slate-400',
    teal: 'bg-ruralTeal-600'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 font-semibold'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border transition-colors select-none
        ${variants[variant] || variants.neutral}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant] || dotColors.neutral}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant] || dotColors.neutral}`}></span>
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
