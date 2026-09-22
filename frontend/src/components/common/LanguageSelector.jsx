import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { Languages, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage, supportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const currentLangObj = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  // Compute dropdown position relative to viewport (for fixed positioning)
  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  const handleOpen = () => {
    updatePosition();
    setIsOpen((v) => !v);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => {
      updatePosition();
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  const dropdown = isOpen && (
    <div
      ref={dropdownRef}
      role="listbox"
      style={{
        position: 'fixed',
        top: dropdownPos.top,
        right: dropdownPos.right,
        zIndex: 9999,
        minWidth: '192px',
        maxWidth: 'calc(100vw - 2rem)',
      }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="px-3.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
        Language / भाषा
      </div>
      {supportedLanguages.map((lang) => (
        <button
          key={lang.code}
          role="option"
          aria-selected={language === lang.code}
          onClick={() => {
            setLanguage(lang.code);
            setIsOpen(false);
          }}
          className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
            language === lang.code
              ? 'font-bold text-ruralTeal-800 bg-ruralTeal-50/80 border-l-4 border-ruralTeal-700'
              : 'text-slate-700 hover:bg-slate-100/80 font-medium'
          }`}
        >
          <div className="flex flex-col">
            <span className="font-semibold">{lang.native}</span>
            <span className="text-[10px] text-slate-400 font-normal">{lang.label}</span>
          </div>
          {language === lang.code && <Check className="w-4 h-4 text-ruralTeal-700 shrink-0" />}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-all border border-slate-200/80 shadow-2xs hover:shadow-xs shrink-0 cursor-pointer select-none"
        title="Change Language (भाषा बदला)"
        aria-label="Change Language"
      >
        <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ruralTeal-700 shrink-0" />
        <span className="font-semibold text-xs sm:text-sm">{currentLangObj.native}</span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-ruralTeal-700' : ''}`} />
      </button>

      {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  );
}
