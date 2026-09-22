import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  Home, 
  Stethoscope, 
  Briefcase, 
  Pill, 
  User, 
  UserPlus, 
  Users, 
  ClipboardCheck, 
  RefreshCw, 
  Activity, 
  Building2, 
  BarChart3,
  Video,
  Camera,
  HeartPulse,
  AlertTriangle
} from 'lucide-react';

export default function BottomNav() {
  const { activeRole } = useAuth();
  const { t } = useTranslation();

  // Role-tailored navigation items
  const getNavItems = () => {
    switch (activeRole) {
      case 'ASHA':
        return [
          { to: '/asha', icon: <Home className="w-5 h-5" />, label: t('nav.home') },
          { to: '/asha/workflow', icon: <ClipboardCheck className="w-5 h-5" />, label: t('asha.quickHealthCheck') },
          { to: '/asha/patients', icon: <Users className="w-5 h-5" />, label: t('asha.quickMyPatients') },
          { to: '/asha/visits', icon: <Users className="w-5 h-5" />, label: t('asha.quickTodayVisits') },
          { to: '/asha/sync', icon: <RefreshCw className="w-5 h-5" />, label: t('nav.syncQueue') }
        ];

      case 'DOCTOR':
        return [
          { to: '/doctor', icon: <Home className="w-5 h-5" />, label: t('nav.home') },
          { to: '/doctor/queue', icon: <Activity className="w-5 h-5 text-red-600" />, label: t('doctor.todayQueue') },
          { to: '/doctor/consult', icon: <Video className="w-5 h-5 text-primary-600" />, label: t('doctor.liveConsultation') },
          { to: '/doctor/photo-cases', icon: <Camera className="w-5 h-5 text-purple-600" />, label: t('doctor.photoCases') },
          { to: '/doctor/prescriptions', icon: <Pill className="w-5 h-5 text-emerald-600" />, label: t('doctor.prescriptions') }
        ];

      case 'ADMIN':
        return [
          { to: '/admin', icon: <Home className="w-5 h-5" />, label: t('nav.home') },
          { to: '/admin/patients', icon: <Users className="w-5 h-5 text-teal-600" />, label: t('admin.citizenRegistry') },
          { to: '/admin/workforce', icon: <Users className="w-5 h-5 text-emerald-600" />, label: t('admin.workforce') },
          { to: '/admin/facilities', icon: <Building2 className="w-5 h-5 text-blue-600" />, label: t('nav.facilities') },
          { to: '/admin/surveillance', icon: <Activity className="w-5 h-5 text-amber-600" />, label: t('nav.surveillance') }
        ];

      case 'PATIENT':
      default:
        return [
          { to: '/patient', icon: <Home className="w-5 h-5" />, label: t('nav.home', 'Home') },
          { to: '/patient/doctor', icon: <Stethoscope className="w-5 h-5" />, label: t('nav.doctor', 'Doctor') },
          { to: '/patient/health', icon: <HeartPulse className="w-5 h-5" />, label: t('nav.myHealth', 'My Health') },
          { to: '/patient/medicines-followup', icon: <Pill className="w-5 h-5" />, label: t('nav.medicinesFollowup', 'Medicines') },
          { to: '/patient/emergency', icon: <AlertTriangle className="w-5 h-5 text-rose-600" />, label: t('nav.emergencyHelp', 'Emergency') }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg w-full max-w-full overflow-hidden safe-bottom">
      {/* Thumb-friendly mobile navigation bar */}
      <nav className="px-1 pt-1 pb-0.5 flex items-center justify-around w-full max-w-full">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end={item.to === '/patient' || item.to === '/asha' || item.to === '/doctor' || item.to === '/admin'}
            className={({ isActive }) =>
              `flex-1 min-w-0 max-w-[72px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all ${
                isActive
                  ? 'text-ruralTeal-700 font-bold bg-ruralTeal-50/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] tracking-tight mt-0.5 w-full text-center truncate">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Powered by Netlify element docked cleanly at the bottom */}
      <div className="w-full text-center py-0.5 border-t border-slate-100 bg-slate-50/90 text-[10px] text-slate-400 font-medium">
        Powered by <span className="font-bold text-slate-600">Netlify</span>
      </div>
    </div>
  );
}
