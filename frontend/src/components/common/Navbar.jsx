import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import LanguageSelector from './LanguageSelector';
import SyncStatusBadge from './SyncStatusBadge';
import NotificationsPopover from './NotificationsPopover';
import ProfileMenu from './ProfileMenu';
import InstallAppModal from './InstallAppModal';
import { PhoneCall, HeartPulse, Menu, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ onToggleMobileMenu }) {
  const { t } = useTranslation();
  const { activeRole } = useAuth();
  const { canInstall, isIOS, hasNativePrompt, isModalOpen, setIsModalOpen, triggerInstall } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm w-full max-w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Hamburger (mobile) + Brand Logo & Name */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-ring shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 group min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-ruralTeal-700 flex items-center justify-center text-white shadow-sm group-hover:bg-ruralTeal-800 transition-colors shrink-0">
              <HeartPulse className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm sm:text-xl text-slate-900 tracking-tight truncate">
                  {t('common.appName')}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1 py-0.2 bg-ruralTeal-100 text-ruralTeal-800 rounded hidden xs:inline-block">
                  PWA
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden md:block leading-none mt-0.5">
                {t('common.appTagline')}
              </p>
            </div>
          </Link>
        </div>

        {/* Right Action Controls: Sync Badge + Notifications + Language + Profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Emergency 108 Quick Dial (Desktop view only, since mobile TopStatusBar already displays 108 SOS) */}
          {activeRole === 'PATIENT' && (
            <a
              href="tel:108"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0"
              title="Emergency Ambulance 108"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>{t('common.call108')}</span>
            </a>
          )}

          {/* Sync Status Badge */}
          <div className="shrink-0">
            <SyncStatusBadge />
          </div>

          {/* Notifications Popover */}
          <div className="shrink-0">
            <NotificationsPopover />
          </div>

          {/* Centralized Language Selector (Accessible on header) */}
          <div className="shrink-0">
            <LanguageSelector />
          </div>

          {/* Install / Download App Button */}
          {canInstall && (
            <button
              onClick={triggerInstall}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
              title={t('common.installApp', 'Install AarogyaSync App')}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('common.installApp', 'Install App')}</span>
            </button>
          )}

          {/* User Profile Menu (includes integrated persona switcher & logout) */}
          <div className="shrink-0">
            <ProfileMenu />
          </div>
        </div>
      </div>

      {/* PWA Install Modal Dialog */}
      <InstallAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hasNativePrompt={hasNativePrompt}
        onNativeInstall={triggerInstall}
        isIOS={isIOS}
      />
    </header>
  );
}
