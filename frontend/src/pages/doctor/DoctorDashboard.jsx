import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  Activity,
  Stethoscope,
  Video,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Users,
  Building2,
  Calendar,
  Pill,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Bell,
  PhoneCall,
  UserCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export default function DoctorDashboard() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { doctor, overviewStats, consultationQueue, scheduleSlots } = MOCK_DOCTOR_DATA;

  // Filter urgent queue cases for instant attention
  const urgentCases = consultationQueue.filter((c) => c.priority === 'RED');
  const highPriorityCases = consultationQueue.filter((c) => c.priority === 'HIGH');

  const quickActions = [
    {
      to: '/doctor/queue',
      title: t('doctor.todayQueue', 'Consultation Queue'),
      desc: 'Triage patient queue by Red, Orange, Yellow & Green',
      icon: <Activity className="w-6 h-6 text-red-600" />,
      bg: 'bg-red-50 hover:bg-red-100/80 border-red-200/80',
      badge: `${consultationQueue.length} Active`,
      badgeColor: 'bg-red-600 text-white'
    },
    {
      to: '/doctor/consult',
      title: t('doctor.liveConsultation', 'Live Teleconsultation'),
      desc: 'Encrypted audio/video consult with doorstep ASHA link',
      icon: <Video className="w-6 h-6 text-primary-600" />,
      bg: 'bg-primary-50 hover:bg-primary-100/80 border-primary-200/80',
      badge: 'e-Sanjeevani',
      badgeColor: 'bg-primary-700 text-white'
    },
    {
      to: '/doctor/photo-cases',
      title: t('doctor.photoCases', 'Photo Cases'),
      desc: 'Clinical photography review (dermatology, eye trauma, wounds)',
      icon: <Camera className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200/80',
      badge: '3 Awaiting',
      badgeColor: 'bg-purple-600 text-white'
    },
    {
      to: '/doctor/patients',
      title: t('doctor.patients', 'Patients Roster'),
      desc: 'Rural patient directory, ABHA IDs, and clinical profiles',
      icon: <Users className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-200/80'
    },
    {
      to: '/doctor/records',
      title: t('doctor.medicalRecords', 'Medical Records'),
      desc: 'Diagnostic lab tests, ECGs, and maternal ultrasound scans',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-200/80'
    },
    {
      to: '/doctor/prescriptions',
      title: t('doctor.prescriptions', 'Digital Prescriptions'),
      desc: 'Issue, print, and audit ABDM-compliant e-prescriptions',
      icon: <Pill className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80'
    },
    {
      to: '/doctor/referrals',
      title: t('doctor.referrals', 'Hospital Referrals'),
      desc: 'Secondary/tertiary hospital transfers with 108/102 dispatch',
      icon: <Building2 className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/80'
    },
    {
      to: '/doctor/schedule',
      title: t('doctor.schedule', 'Duty Schedule'),
      desc: 'OPD clinics, teleconsultation slots, and emergency on-call',
      icon: <Calendar className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200/80'
    },
    {
      to: '/doctor/treatment-tracking',
      title: t('doctor.treatmentTracking', 'Treatment Tracking'),
      desc: 'Chronic disease adherence tracking (HTN, Diabetes, High-Risk ANC)',
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200/80'
    }
  ];

  return (
    <div className="w-full max-w-full space-y-6 pb-8 animate-fade-in">
      {/* 1. Doctor Header Hero */}
      <div className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-teal-950 text-white p-5 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/30 text-teal-200 border border-teal-400/30 backdrop-blur-sm">
                {t('doctor.dashboardTitle', 'Medical Officer Telemedicine Console')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online & On-Duty
              </span>
              <span className="text-xs text-slate-300">
                HPR: {doctor.hprId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentUser?.fullName || doctor.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-300 shrink-0" />
              {doctor.designation} • {doctor.facility}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/doctor/queue"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold shadow-lg shadow-red-600/30 hover:from-red-700 hover:to-rose-800 transition-all min-h-[48px]"
            >
              <AlertTriangle className="w-5 h-5" />
              Open Urgent Queue ({urgentCases.length})
            </Link>
            <Link
              to="/doctor/consult"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/20 transition-all min-h-[48px]"
            >
              <Video className="w-5 h-5 text-teal-300" />
              Start Teleconsult
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Today's Overview (User Requirement) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            {t('doctor.overviewTitle', "Today's Clinical Overview")}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Cluster: {doctor.subCentreNetwork}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Priority Cases */}
          <Link
            to="/doctor/queue?filter=RED"
            className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-400">
                {t('doctor.priorityCases', 'Priority Cases')}
              </span>
              <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-rose-600">
              {overviewStats.priorityCases}
            </p>
            <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1 mt-1">
              {urgentCases.length} Critical RED • Immediate
            </span>
          </Link>

          {/* Appointments */}
          <Link
            to="/doctor/schedule"
            className="p-4 rounded-2xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-400">
                {t('doctor.appointments', 'Appointments')}
              </span>
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-blue-700">
              {overviewStats.appointmentsToday}
            </p>
            <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 mt-1">
              OPD + Tele-appointments
            </span>
          </Link>

          {/* Urgent Consultations */}
          <Link
            to="/doctor/queue?filter=RED"
            className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-400">
                {t('doctor.urgentCases', 'Urgent Consults')}
              </span>
              <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-amber-600">
              {overviewStats.urgentConsultations}
            </p>
            <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 mt-1">
              ASHA escalated live
            </span>
          </Link>

          {/* Pending Reviews */}
          <Link
            to="/doctor/photo-cases"
            className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-400">
                {t('doctor.pendingReviews', 'Pending Reviews')}
              </span>
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-purple-700">
              {overviewStats.pendingReviews}
            </p>
            <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 mt-1">
              Photo & diagnostic cases
            </span>
          </Link>

          {/* Follow-ups */}
          <Link
            to="/doctor/followups"
            className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm hover:shadow-md transition-all group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-400">
                {t('doctor.followups', 'Follow-ups')}
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black text-emerald-600">
              {overviewStats.followupsScheduled}
            </p>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-1">
              High-risk & chronic care
            </span>
          </Link>
        </div>
      </div>

      {/* 3. Urgent RED Emergency Action Banner */}
      {urgentCases.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/30 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                  ACTION REQUIRED NOW
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {urgentCases[0].patientName} ({urgentCases[0].age} yrs, {urgentCases[0].gender})
                </h3>
              </div>
              <p className="text-sm font-semibold text-rose-950 mt-0.5">
                {urgentCases[0].chiefComplaint}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                ASHA: <strong>{urgentCases[0].ashaWorker}</strong> • BP: <strong>{urgentCases[0].vitals.bp}</strong> • SpO2: <strong>{urgentCases[0].vitals.spO2}</strong> • Waiting: {urgentCases[0].waitingTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              to={`/doctor/consult/${urgentCases[0].patientId}`}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all flex items-center gap-2 min-h-[44px]"
            >
              <Video className="w-4 h-4" />
              Attend Urgent Case
            </Link>
          </div>
        </div>
      )}

      {/* 4. Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary-600" />
          Doctor Clinical Modules & Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.to}
              className={`p-4 rounded-2xl border transition-all hover:shadow-md flex items-start gap-3.5 ${action.bg}`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {action.title}
                  </h3>
                  {action.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${action.badgeColor}`}>
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Two Columns: Active Queue Highlights & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Queue Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                Active Consultation Queue Highlights
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by clinical urgency tier (Red → Orange → Yellow → Green)
              </p>
            </div>
            <Link
              to="/doctor/queue"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All ({consultationQueue.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {consultationQueue.slice(0, 4).map((item) => {
              const isRed = item.priority === 'RED';
              const isHigh = item.priority === 'HIGH';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isRed
                      ? 'bg-rose-50/40 border-rose-200'
                      : isHigh
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                          isRed
                            ? 'bg-red-600 text-white'
                            : isHigh
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-600 text-white'
                        }`}
                      >
                        {item.priorityLabel}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.patientName} ({item.age}y, {item.gender})
                      </h4>
                      <span className="text-xs text-slate-400">• {item.village}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {item.chiefComplaint}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Referred by: <strong>{item.ashaWorker}</strong> • BP: {item.vitals.bp || 'N/A'} • SpO2: {item.vitals.spO2 || 'N/A'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/doctor/consult/${item.patientId}`}
                      className="px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[40px]"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Consult
                    </Link>
                    <Link
                      to={`/doctor/history?patientId=${item.patientId}`}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors min-h-[40px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      Timeline
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Today's Clinical Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Today's Schedule
            </h3>
            <Link
              to="/doctor/schedule"
              className="text-xs font-bold text-amber-600 hover:text-amber-700"
            >
              Full Calendar
            </Link>
          </div>

          <div className="space-y-3">
            {scheduleSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{slot.time}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {slot.type}
                  </span>
                </div>
                <p className="font-semibold text-xs text-slate-900">{slot.title}</p>
                <p className="text-[11px] text-slate-500">{slot.attendees}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
