import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, SUPPORTED_LANGUAGES } from '../translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('aarogyasync_lang');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Unable to read language preference:', e);
    }
    return 'en';
  });

  const setLanguage = (langCode) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === langCode)) {
      console.warn(`Unsupported language code: ${langCode}`);
      return;
    }
    setLanguageState(langCode);
    try {
      localStorage.setItem('aarogyasync_lang', langCode);
    } catch (e) {
      console.warn('Unable to save language preference:', e);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = langCode;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (path, ...args) => {
    return getTranslation(language, path, ...args);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
