import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  LogOut, 
  ChevronDown,
  Check,
  Sparkles
} from 'lucide-react';

export default function ProfileMenu() {
  const { currentUser, activeRole, patientGender, quickSwitchRole, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeConfig = () => {
    switch (activeRole) {
      case 'ASHA':
        return { label: t('roles.ASHA', 'ASHA Sangini'), bg: 'bg-emerald-100 text-emerald-800' };
      case 'DOCTOR':
        return { label: t('roles.DOCTOR', 'Medical Officer'), bg: 'bg-indigo-100 text-indigo-800' };
      case 'ADMIN':
        return { label: t('roles.ADMIN', 'Health Admin'), bg: 'bg-amber-100 text-amber-800' };
      case 'PATIENT':
      default:
        return {
          label: patientGender === 'female' ? t('roles.PATIENT_FEMALE', 'Patient (Maternal)') : t('roles.PATIENT_MALE', 'Patient (General)'),
          bg: patientGender === 'female' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
        };
    }
  };

  const roleConfig = getRoleBadgeConfig();

  const demoRoles = [
    {
      key: 'PATIENT_FEMALE',
      name: 'Radhika Shinde',
      role: 'PATIENT',
      badge: t('roles.maternalBadge', 'Maternal ANC & Child Care'),
      route: '/patient'
    },
    {
      key: 'PATIENT_MALE',
      name: 'Tukaram Patil',
      role: 'PATIENT',
      badge: t('roles.generalBadge', 'General & Chronic Health'),
      route: '/patient'
    },
    {
      key: 'ASHA',
      name: 'Sunita Tai',
      role: 'ASHA',
      badge: t('roles.ashaBadge', 'Offline Field Worker'),
      route: '/asha'
    },
    {
      key: 'DOCTOR',
      name: 'Dr. Ramesh Kulkarni',
      role: 'DOCTOR',
      badge: t('roles.doctorBadge', 'Medical Officer Teleconsult'),
      route: '/doctor'
    },
    {
      key: 'ADMIN',
      name: 'District Health Officer',
      role: 'ADMIN',
      badge: t('roles.adminBadge', 'Health Surveillance & Facilities'),
      route: '/admin'
    }
  ];

  const handleSelectRole = (r) => {
    quickSwitchRole(r.key);
    setIsOpen(false);
    navigate(r.route);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pl-2.5 rounded-xl hover:bg-slate-100 transition-colors focus-ring border border-slate-200/80 bg-white shadow-sm shrink-0 cursor-pointer"
        title={t('common.profile', 'User Profile & Roles')}
        aria-label="User Profile and Account"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-ruralTeal-700 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
          {getInitials(currentUser?.fullName || 'User')}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-slate-900 max-w-[120px] truncate leading-tight">
            {currentUser?.fullName || 'Villager'}
          </div>
          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-sm inline-block mt-0.5 ${roleConfig.bg}`}>
            {roleConfig.label}
          </span>
        </div>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Details */}
          <div className="px-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ruralTeal-700 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                {getInitials(currentUser?.fullName || 'User')}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 text-sm truncate">
                  {currentUser?.fullName}
                </h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm inline-block mt-0.5 ${roleConfig.bg}`}>
                  {roleConfig.label}
                </span>
              </div>
            </div>

            {/* ABHA or Location Info */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">{t('profile.abhaNumber', 'ABHA ID')}:</span>
                <span className="font-mono font-bold text-slate-800">
                  {currentUser?.abhaId || '91-4521-8890-1234'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">{t('profile.village', 'Village / Centre')}:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                  {currentUser?.village || 'Nigdale PHC'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher (For Demo & Jury) */}
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('common.switchRole', 'Switch Role / Persona')}
              </span>
              <span className="text-[10px] font-bold text-ruralTeal-700 bg-ruralTeal-50 px-1.5 py-0.2 rounded">
                {t('common.demoMode', 'Demo')}
              </span>
            </div>

            <div className="space-y-1">
              {demoRoles.map((r) => {
                const isSelected =
                  (r.key === 'PATIENT_FEMALE' && activeRole === 'PATIENT' && patientGender === 'female') ||
                  (r.key === 'PATIENT_MALE' && activeRole === 'PATIENT' && patientGender === 'male') ||
                  (r.key === activeRole);

                return (
                  <button
                    key={r.key}
                    onClick={() => handleSelectRole(r)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-ruralTeal-50 text-ruralTeal-900 font-bold border border-ruralTeal-200'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div>
                      <div>{r.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{r.badge}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-ruralTeal-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
