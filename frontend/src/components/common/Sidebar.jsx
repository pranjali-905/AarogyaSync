import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { useNavLinks } from '../../hooks/useNavLinks';
import { useAuth } from '../../hooks/useAuth';
import { 
  PhoneCall, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';


export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const { t } = useTranslation();
  const { isOnline } = useOffline();
  const { navLinks } = useNavLinks();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };


  return (
    <aside
      className={`
        hidden lg:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 select-none
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navLinks.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-ruralTeal-50 text-ruralTeal-800 shadow-sm border border-ruralTeal-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!isCollapsed && (
              <span className="flex-1 truncate tracking-tight">{item.label}</span>
            )}
            {!isCollapsed && item.badge && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Quick Action Footer: Logout + Emergency SOS */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          onClick={handleLogout}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/90 transition-all flex items-center cursor-pointer ${
            isCollapsed ? 'justify-center' : 'justify-center gap-2'
          }`}
          title={t('common.logout', 'Logout')}
        >
          <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
          {!isCollapsed && <span>{t('common.logout', 'Logout')}</span>}
        </button>

        <a
          href="tel:108"
          className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
          title={t('common.call108', 'Emergency 108 Ambulance')}
        >
          <PhoneCall className="w-4 h-4" />
          {!isCollapsed && <span>{t('common.call108', 'Call 108 SOS')}</span>}
        </a>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="text-xs font-medium text-slate-500">
              {isOnline ? t('common.online') : t('common.offline')}
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mx-auto lg:mx-0 cursor-pointer"
          title={isCollapsed ? (t('common.expand', 'Expand')) : (t('common.collapse', 'Collapse'))}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
