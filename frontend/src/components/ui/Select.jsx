import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const Select = React.forwardRef(({
  label,
  options = [],
  children,
  helperText,
  error,
  required = false,
  className = '',
  id,
  disabled = false,
  ...props
}, ref) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider select-none"
        >
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`
            w-full pl-3.5 pr-10 py-2.5 rounded-xl border bg-white text-sm text-slate-900 transition-all appearance-none min-h-[44px]
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-ruralTeal-600 focus:ring-2 focus:ring-ruralTeal-100'}
            focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
