import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_PATIENT_FEMALE } from '../../services/mockData';
import {
  HeartPulse,
  Stethoscope,
  PhoneCall,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Clock,
  Activity,
  ArrowRight,
  Sparkles,
  MapPin,
  BellRing,
  UserCheck
} from 'lucide-react';

export default function FemalePatientDashboard() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  // Merge live user profile with realistic female patient record
  const patient = {
    ...MOCK_PATIENT_FEMALE,
    fullName: currentUser?.fullName || currentUser?.full_name || MOCK_PATIENT_FEMALE.fullName,
    abhaId: currentUser?.abhaId || currentUser?.abha_id || MOCK_PATIENT_FEMALE.abhaId,
    village: currentUser?.village || MOCK_PATIENT_FEMALE.village,
    isPregnant: currentUser?.isPregnant !== undefined ? currentUser.isPregnant : MOCK_PATIENT_FEMALE.isPregnant
  };

  const isPregnant = Boolean(patient.isPregnant);
  const { nextAction, upcomingAppointment, healthStatus } = patient;

  return (
    <div className="w-full max-w-full space-y-6 animate-in fade-in duration-300 pb-8 font-sans">
      {/* 1. GREETING & ABHA ID HEADER */}
      <div className="w-full bg-gradient-to-r from-ruralTeal-800 via-ruralTeal-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-56 h-56 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-ruralTeal-700/80 text-ruralTeal-100 border border-ruralTeal-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ABHA ID: {patient.abhaId}
            </span>

            {/* Pregnancy Care Badge: Displayed ONLY if female patient is pregnant */}
            {isPregnant && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/25 text-rose-200 border border-rose-400/40">
                <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
                <span>Pregnancy Care • Week {patient.gestationalWeeks || 28}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('patient.welcome', { name: patient.fullName })}
          </h1>

          <p className="text-xs sm:text-sm text-ruralTeal-100/90 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {patient.village} Village • Sub-Centre Nigdale
            </span>
            <span className="hidden sm:inline text-ruralTeal-400">•</span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              Assigned ASHA: {patient.assignedAsha.name}
            </span>
          </p>
        </div>
      </div>

      {/* 2. YOUR NEXT ACTION */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-ruralTeal-800 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded text-emerald-100">
                {t('patient.nextActionTitle', 'Your Next Action')}
              </span>
              <span className="text-xs text-emerald-100 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> Due {nextAction.date} at {nextAction.time}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white">
              {isPregnant ? (
                <span>Next ANC Visit: {nextAction.title}</span>
              ) : (
                nextAction.title
              )}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-50/90 max-w-xl leading-relaxed">
              {nextAction.instructions}
            </p>
          </div>
        </div>

        <Link
          to="/patient/doctor"
          className="self-start sm:self-auto px-4 py-2.5 bg-white text-teal-900 hover:bg-emerald-50 active:scale-95 rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3. UPCOMING DOCTOR APPOINTMENT */}
      <div className="rural-card p-5 sm:p-6 border-l-4 border-l-ruralTeal-600 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ruralTeal-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Upcoming Doctor Appointment
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg uppercase tracking-wider">
            Token #{upcomingAppointment.tokenNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">Doctor</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {upcomingAppointment.doctorName}
            </span>
            <span className="text-[11px] text-ruralTeal-700 font-medium">
              {upcomingAppointment.doctorSpecialty}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">Date & Time</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {upcomingAppointment.date}
            </span>
            <span className="text-[11px] text-slate-600">{upcomingAppointment.time}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">Health Centre</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {upcomingAppointment.facility}
            </span>
            <span className="text-[11px] text-slate-600">{upcomingAppointment.type}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block">Appointment Status</span>
            <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
              {upcomingAppointment.status}
            </span>
            <span className="text-[11px] text-slate-500">Confirmed OPD Slot</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/patient/doctor"
            className="px-4 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Stethoscope className="w-4 h-4" />
            <span>View Appointment & Consult</span>
          </Link>

          <span className="text-xs text-slate-500">
            Present your token number at the OPD registration desk.
          </span>
        </div>
      </div>

      {/* 4. HEALTH SUMMARY */}
      <div className="rural-card p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Current Health Summary
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            {healthStatus.label}
          </span>
        </div>

        <div className={`grid grid-cols-2 ${isPregnant ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block font-medium">Blood Pressure</span>
            <span className="text-lg font-extrabold text-slate-900 mt-1 block">
              {healthStatus.vitals.bp}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">Optimal Range</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block font-medium">Pulse Rate</span>
            <span className="text-lg font-extrabold text-slate-900 mt-1 block">
              {healthStatus.vitals.pulse}
            </span>
            <span className="text-[11px] text-slate-600 font-medium">Normal rhythm</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block font-medium">Hemoglobin (Hb)</span>
            <span className="text-lg font-extrabold text-slate-900 mt-1 block">
              {healthStatus.vitals.hemoglobin}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">Healthy (Non-anemic)</span>
          </div>

          {/* Fetal Heart Rate: ONLY if female patient is pregnant */}
          {isPregnant && (
            <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100">
              <span className="text-xs text-rose-700 block font-medium">Fetal Heart Rate</span>
              <span className="text-lg font-extrabold text-rose-950 mt-1 block">
                {healthStatus.vitals.fetalHeartRate}
              </span>
              <span className="text-[11px] text-rose-700 font-bold">Strong & regular</span>
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>Logged by Frontline ASHA worker at doorstep health check.</span>
          <Link
            to="/patient/health"
            className="font-bold text-ruralTeal-700 hover:text-ruralTeal-800 flex items-center gap-1"
          >
            <span>View Full Health Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 5. IMPORTANT REMINDER */}
      <div className="p-4 sm:p-5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start gap-3.5 shadow-2xs">
        <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
          <BellRing className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-950">
            Important Health Reminder
          </h3>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            {isPregnant
              ? 'Take 1 Iron & Folic Acid (IFA) tablet after dinner with clean drinking water. Avoid taking iron tablets with tea or milk to ensure complete absorption.'
              : 'Remember to take your prescribed daily medicines on time after meals and stay well-hydrated throughout the day.'}
          </p>
        </div>
      </div>

      {/* 6. EMERGENCY HELP */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Emergency Help (24x7)
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-rose-950 mt-1">
              Medical Danger or Sudden Pain? Immediate Assistance
            </h2>
            <p className="text-xs text-rose-800 mt-0.5">
              Direct connection to 108 Ambulance dispatch and village ASHA worker.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="tel:108"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center gap-2 transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108 Ambulance</span>
          </a>
          <Link
            to="/patient/emergency"
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>Emergency Help Page</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
