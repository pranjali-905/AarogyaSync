import React from 'react';
import { Search, X, AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(({
  label,
  helperText,
  error,
  required = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  type = 'text',
  disabled = false,
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider select-none"
        >
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={`
            w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 transition-all min-h-[44px]
            placeholder:text-slate-400
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || error ? 'pr-10' : ''}
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-slate-300 focus:border-ruralTeal-600 focus:ring-2 focus:ring-ruralTeal-100'}
            focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {rightIcon && !error && (
          <div className="absolute right-3.5 text-slate-400 flex items-center">
            {rightIcon}
          </div>
        )}

        {error && (
          <div className="absolute right-3.5 text-rose-500 flex items-center pointer-events-none">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
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

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  label,
  helperText,
  error,
  required = false,
  rows = 3,
  className = '',
  id,
  disabled = false,
  ...props
}, ref) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider select-none"
        >
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 transition-all
          placeholder:text-slate-400
          ${error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
            : 'border-slate-300 focus:border-ruralTeal-600 focus:ring-2 focus:ring-ruralTeal-100'}
          focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
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

Textarea.displayName = 'Textarea';

export function SearchInput({ value, onChange, onClear, placeholder = 'Search...', className = '', ...props }) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-ruralTeal-600 focus:ring-2 focus:ring-ruralTeal-100 min-h-[44px] transition-all"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Input;
