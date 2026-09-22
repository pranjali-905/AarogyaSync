import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import TopStatusBar from '../components/common/TopStatusBar';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Sidebar from '../components/common/Sidebar';
import OfflineBanner from '../components/common/OfflineBanner';
import OfflineSyncCenterModal from '../components/common/OfflineSyncCenterModal';
import RoleSwitcher from '../components/common/RoleSwitcher';
import LanguageSelector from '../components/common/LanguageSelector';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { useNavLinks } from '../hooks/useNavLinks';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallAppModal from '../components/common/InstallAppModal';
import { X, PhoneCall, HeartPulse, Download, Smartphone, LogOut, ExternalLink } from 'lucide-react';

export default function AppLayout() {
  const { activeRole, patientGender, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { navLinks } = useNavLinks();
  const { canInstall, isIOS, hasNativePrompt, isModalOpen, setIsModalOpen, triggerInstall } = usePWAInstall();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900">
      {/* 0. Top Status Bar (100% width, Time, Signal, 108 SOS, Dashboard Link) */}
      <TopStatusBar />

      {/* 1. Global Reusable Header */}
      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {/* 2. Offline Connectivity & Sync Banner & Vault Modal */}
      <OfflineBanner />
      <OfflineSyncCenterModal />

      {/* 3. Main Workspace Shell: Sidebar + Content */}
      <div className="flex-1 flex w-full max-w-full overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Mobile / Tablet Slide-out Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-out Panel */}
            <div className="relative z-10 w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
              {/* Drawer Top Header: Brand + Close + Switchers */}
              <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/70">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-ruralTeal-700 flex items-center justify-center text-white shadow-xs">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {t('common.appName')}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Persona Switcher */}
                <div className="py-0.5">
                  <RoleSwitcher />
                </div>

                {/* Mobile Language Selector */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('common.language', 'Language')}
                  </span>
                  <LanguageSelector />
                </div>

                {/* Mobile PWA Install Banner */}
                {canInstall && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      triggerInstall();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-ruralTeal-700 to-emerald-700 text-white font-bold text-xs shadow-sm hover:from-ruralTeal-800 hover:to-emerald-800 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Install App on Phone</span>
                    </div>
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Drawer Middle: Full Scrollable Navigation Links */}
              <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
                <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {activeRole} Navigation Menu
                </div>
                {navLinks.map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.to}
                    end={item.exact}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-ruralTeal-50 text-ruralTeal-800 shadow-xs border border-ruralTeal-200/70 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1 truncate tracking-tight">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Drawer Bottom: Logout & Emergency Shortcut */}
              <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 safe-bottom space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate('/login', { replace: true });
                  }}
                  className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200/90 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{t('common.logout', 'Logout')}</span>
                </button>

                <a
                  href="tel:108"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t('common.call108')}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Drawer PWA Install Modal Dialog */}
        <InstallAppModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hasNativePrompt={hasNativePrompt}
          onNativeInstall={triggerInstall}
          isIOS={isIOS}
        />

        {/* Scrollable Main Viewport - centered, 100% responsive width with generous bottom padding for fixed bottom bar */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-28 sm:pb-32 lg:pb-12 flex flex-col items-center">
          <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Desktop / Tablet Fixed Bottom Footer with Powered by Netlify */}
      <footer className="hidden sm:flex items-center justify-between px-6 py-2 bg-white/95 border-t border-slate-200/80 text-xs text-slate-500 w-full shrink-0 z-30">
        <span className="font-medium text-slate-600">
          {t('common.appName')} • {t('common.appTagline')}
        </span>
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          Powered by <span className="font-bold text-slate-700">Netlify</span>
        </span>
      </footer>

      {/* 4. Mobile Bottom Nav Bar (Thumb-friendly for rural smartphone users with docked Netlify element) */}
      <BottomNav />
    </div>
  );
}
