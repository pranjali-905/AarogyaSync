import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-extrabold text-ruralTeal-800">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-2">
        {t('errors.pageNotFound', 'Page Not Found')}
      </h2>
      <p className="text-sm text-slate-500 mt-1 max-w-sm leading-relaxed">
        {t('errors.pageNotFoundDesc', 'The requested healthcare portal resource could not be found or has moved.')}
      </p>
      <Link
        to="/"
        className="mt-5 px-5 py-2.5 bg-ruralTeal-700 text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-ruralTeal-800 transition-colors"
      >
        <Home className="w-4 h-4" />
        {t('common.backToHome', 'Return to Home')}
      </Link>
    </div>
  );
}
