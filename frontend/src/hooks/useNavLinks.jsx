import React from 'react';
import { useAuth } from './useAuth';
import { useTranslation } from './useTranslation';
import { useOffline } from './useOffline';
import { 
  Home, 
  Stethoscope, 
  Briefcase, 
  Pill, 
  HeartHandshake, 
  HeartPulse,
  Baby, 
  Activity, 
  UserPlus, 
  Users, 
  ClipboardCheck, 
  RefreshCw, 
  Building2, 
  BarChart3, 
  PhoneCall, 
  ShieldCheck, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  Bell, 
  Camera, 
  HardDrive, 
  Award, 
  Video, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  Truck, 
  FileSpreadsheet, 
  UserCheck 
} from 'lucide-react';

export function useNavLinks() {
  const { activeRole, patientGender, currentUser } = useAuth();
  const { t } = useTranslation();
  const { pendingCount } = useOffline();

  const isFemale = patientGender === 'female' || currentUser?.gender === 'female';

  const getNavLinks = () => {
    switch (activeRole) {
      case 'ASHA':
        return [
          // Primary 5
          { to: '/asha', icon: <Home className="w-5 h-5" />, label: t('nav.home', 'Home'), exact: true },
          { to: '/asha/patients', icon: <Users className="w-5 h-5" />, label: t('nav.patients', 'Patients') },
          { to: '/asha/workflow', icon: <ClipboardCheck className="w-5 h-5 text-teal-600" />, label: t('nav.healthCheck', 'Health Check') },
          { to: '/asha/visits', icon: <Calendar className="w-5 h-5" />, label: t('nav.visits', 'Visits') },
          { to: '/asha/followups', icon: <Clock className="w-5 h-5" />, label: t('nav.followup', 'Follow-up') },
          // More
          { to: '/asha/telemedicine', icon: <PhoneCall className="w-5 h-5 text-purple-600" />, label: t('nav.telemedicine', 'Telemedicine') },
          { to: '/asha/medicines', icon: <Pill className="w-5 h-5 text-emerald-600" />, label: t('nav.medicineTests', 'Medicine & Tests') },
          { 
            to: '/asha/priority', 
            icon: <AlertTriangle className="w-5 h-5 text-red-600" />, 
            label: t('nav.priorityCases', 'Priority Cases'),
            badge: t('common.urgent', 'RED'),
            badgeColor: 'bg-red-100 text-red-800'
          },
          { to: '/asha/performance', icon: <Award className="w-5 h-5 text-amber-600" />, label: t('nav.myPerformance', 'My Performance') }
        ];

      case 'DOCTOR':
        return [
          // Primary 5
          { to: '/doctor', icon: <Home className="w-5 h-5" />, label: t('nav.home', 'Home'), exact: true },
          { 
            to: '/doctor/queue', 
            icon: <Activity className="w-5 h-5 text-red-600" />, 
            label: t('doctor.todayQueue', 'Queue'),
            badge: t('common.urgent', 'RED'),
            badgeColor: 'bg-red-600 text-white'
          },
          { to: '/doctor/patients', icon: <Users className="w-5 h-5 text-teal-600" />, label: t('nav.patients', 'Patients') },
          { to: '/doctor/consult', icon: <Video className="w-5 h-5 text-primary-600" />, label: t('doctor.liveConsultation', 'Consultations') },
          { to: '/doctor/followups', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, label: t('nav.followup', 'Follow-up') },
          // More
          { to: '/doctor/prescriptions', icon: <Pill className="w-5 h-5 text-emerald-600" />, label: t('doctor.prescriptions', 'Prescriptions') },
          { to: '/doctor/referrals', icon: <Building2 className="w-5 h-5 text-rose-600" />, label: t('doctor.referrals', 'Referrals') },
          { to: '/doctor/schedule', icon: <Calendar className="w-5 h-5 text-amber-600" />, label: t('doctor.schedule', 'Schedule & Availability') },
          { 
            to: '/doctor/photo-cases', 
            icon: <Camera className="w-5 h-5 text-purple-600" />, 
            label: t('doctor.photoCases', 'Photo Cases'),
            badge: '3 New',
            badgeColor: 'bg-purple-100 text-purple-800'
          }
        ];

      case 'ADMIN':
        return [
          // Primary 5
          { to: '/admin', icon: <Home className="w-5 h-5 text-slate-800" />, label: t('nav.home', 'Home'), exact: true },
          { to: '/admin/patients', icon: <Users className="w-5 h-5 text-teal-600" />, label: t('admin.citizenRegistry', 'Patients') },
          { to: '/admin/workforce', icon: <UserCheck className="w-5 h-5 text-emerald-600" />, label: t('admin.workforce', 'Workforce') },
          { to: '/admin/facilities', icon: <Building2 className="w-5 h-5 text-blue-600" />, label: t('nav.facilities', 'Facilities') },
          { to: '/admin/analytics', icon: <BarChart3 className="w-5 h-5 text-indigo-600" />, label: t('admin.analytics', 'Analytics') },
          // More
          { to: '/admin/referrals', icon: <Truck className="w-5 h-5 text-orange-600" />, label: t('admin.referrals', 'Referrals') },
          { to: '/admin/surveillance', icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, label: t('admin.surveillance', 'Public Health Surveillance') },
          { to: '/admin/reports', icon: <FileSpreadsheet className="w-5 h-5 text-purple-600" />, label: t('nav.reportsExport', 'Reports / Export') }
        ];

      case 'PATIENT':
      default: {
        return [
          { to: '/patient', icon: <Home className="w-5 h-5 text-ruralTeal-700" />, label: t('nav.home', 'Home'), exact: true },
          { to: '/patient/doctor', icon: <Stethoscope className="w-5 h-5 text-blue-600" />, label: t('nav.doctor', 'Doctor') },
          { to: '/patient/health', icon: <HeartPulse className="w-5 h-5 text-rose-600" />, label: t('nav.myHealth', 'My Health') },
          { to: '/patient/medicines-followup', icon: <Pill className="w-5 h-5 text-emerald-600" />, label: t('nav.medicinesFollowup', 'Medicines & Follow-up') },
          { to: '/patient/emergency', icon: <AlertTriangle className="w-5 h-5 text-rose-600" />, label: t('nav.emergencyHelp', 'Emergency Help') }
        ];
      }
    }
  };

  return {
    navLinks: getNavLinks(),
    activeRole
  };
}
