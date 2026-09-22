import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop click handler */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Box */}
      <div
        className={`
          relative z-10 w-full ${maxWidthMap[maxWidth] || maxWidthMap.md} bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200
          max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200
          ${className}
        `}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-ring"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 sm:p-6 pt-3 border-t border-slate-100 bg-slate-50/70 rounded-b-3xl sm:rounded-b-2xl flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
