import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ChevronDown, Sparkles } from 'lucide-react';

export default function RoleSwitcher() {
  const { currentUser, activeRole, patientGender, quickSwitchRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    {
      key: 'PATIENT_FEMALE',
      label: t('roles.PATIENT_FEMALE'),
      role: 'PATIENT',
      badge: t('roles.maternalBadge', 'Maternal & Child Care'),
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      route: '/patient'
    },
    {
      key: 'PATIENT_MALE',
      label: t('roles.PATIENT_MALE'),
      role: 'PATIENT',
      badge: t('roles.generalBadge', 'General & Chronic'),
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      route: '/patient'
    },
    {
      key: 'ASHA',
      label: t('roles.ASHA'),
      role: 'ASHA',
      badge: t('roles.ashaBadge', 'Offline Field Worker'),
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      route: '/asha'
    },
    {
      key: 'DOCTOR',
      label: t('roles.DOCTOR'),
      role: 'DOCTOR',
      badge: t('roles.doctorBadge', 'Telemedicine Console'),
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      route: '/doctor'
    },
    {
      key: 'ADMIN',
      label: t('roles.ADMIN'),
      role: 'ADMIN',
      badge: t('roles.adminBadge', 'District Public Health'),
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      route: '/admin'
    }
  ];

  const handleSelectRole = (roleOption) => {
    quickSwitchRole(roleOption.key);
    setIsOpen(false);
    navigate(roleOption.route);
  };

  // Compute current display label
  let currentLabel = currentUser?.fullName || 'Select Role';
  if (activeRole === 'PATIENT') {
    currentLabel = patientGender === 'female' ? t('roles.PATIENT_FEMALE') : t('roles.PATIENT_MALE');
  } else if (activeRole === 'ASHA') {
    currentLabel = t('roles.ASHA');
  } else if (activeRole === 'DOCTOR') {
    currentLabel = t('roles.DOCTOR');
  } else if (activeRole === 'ADMIN') {
    currentLabel = t('roles.ADMIN');
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-900 border border-ruralTeal-200/80 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm"
        title="Switch active persona"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="max-w-[120px] sm:max-w-[180px] truncate">{currentLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-ruralTeal-700 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('common.switchRole')}
            </span>
            <span className="px-1.5 py-0.5 bg-ruralTeal-100 text-ruralTeal-800 text-[10px] font-bold rounded">
              Roles
            </span>
          </div>

          <div className="space-y-1">
            {roles.map((r) => {
              const isSelected =
                (r.key === 'PATIENT_FEMALE' && activeRole === 'PATIENT' && patientGender === 'female') ||
                (r.key === 'PATIENT_MALE' && activeRole === 'PATIENT' && patientGender === 'male') ||
                (r.key === activeRole);

              return (
                <button
                  key={r.key}
                  onClick={() => handleSelectRole(r)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-ruralTeal-50/80 border border-ruralTeal-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      {r.label}
                    </div>
                    <div className="text-[11px] text-slate-500">{r.badge}</div>
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 bg-ruralTeal-600 text-white rounded-md text-[10px] font-bold">
                      {t('common.active')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
