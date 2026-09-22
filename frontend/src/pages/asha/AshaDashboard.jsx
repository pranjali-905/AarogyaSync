import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { MOCK_ASHA_DATA } from '../../services/mockData';
import {
  UserPlus,
  ClipboardCheck,
  RefreshCw,
  Users,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Check,
  Building2,
  Calendar,
  PhoneCall,
  Video,
  Pill,
  Briefcase,
  TrendingUp,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  WifiOff,
  Wifi,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function AshaDashboard() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOnline, syncStatus, pendingCount, syncNow } = useOffline();

  const [visits, setVisits] = useState(MOCK_ASHA_DATA.villageVisitsToday);
  const [priorityTab, setPriorityTab] = useState('ALL');
  const [patientSearch, setPatientSearch] = useState('');

  const toggleVisitStatus = (index) => {
    const updated = [...visits];
    updated[index].status = updated[index].status === 'Completed' ? 'Pending' : 'Completed';
    setVisits(updated);
  };

  const worker = {
    ...MOCK_ASHA_DATA.worker,
    fullName: currentUser?.fullName || MOCK_ASHA_DATA.worker.fullName,
    village: currentUser?.village || MOCK_ASHA_DATA.worker.village
  };

  // Quick search redirection
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (patientSearch.trim()) {
      navigate(`/asha/patients?search=${encodeURIComponent(patientSearch.trim())}`);
    } else {
      navigate('/asha/patients');
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 animate-in fade-in duration-300 pb-8">
      {/* 1. ASHA IDENTITY & OFFLINE VAULT HEADER */}
      <div className="w-full bg-gradient-to-r from-ruralTeal-800 via-ruralTeal-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t('asha.consoleBadge', 'ASHA Sangini Frontline Console')}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isOnline
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-amber-400 text-amber-950'
              }`}>
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {isOnline ? t('asha.onlinePhcLinked', 'Online (PHC Linked)') : t('asha.offlineActive', '100% Offline Active')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {worker.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-ruralTeal-100/90 flex items-center gap-1.5">
              <span>{t('asha.coverage', 'Coverage')}: <strong>{worker.village}</strong></span>
              <span>•</span>
              <span>{t('asha.householdsAssigned', '{count} Households Assigned', { count: 142 })}</span>
              <span>•</span>
              <span>{t('asha.monthlyIncentiveEstimated', 'Monthly Incentive: {amount}', { amount: worker.monthlyIncentiveEstimated })}</span>
            </p>
          </div>

          {/* Sync status card with instant sync button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-ruralTeal-200 font-semibold uppercase block">{t('nav.syncQueue', 'Sync Status')}</span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  syncStatus === 'Synced' ? 'bg-emerald-400' : syncStatus === 'Syncing' ? 'bg-blue-400 animate-ping' : 'bg-amber-400'
                }`} />
                {syncStatus === 'Syncing' ? t('sync.syncing', 'Syncing...') : syncStatus === 'Synced' ? t('sync.allSynced', 'All Synced') : t('sync.pendingQueue', '{count} in queue', { count: pendingCount })}
              </span>
            </div>

            <button
              onClick={syncNow}
              disabled={syncStatus === 'Syncing' || !isOnline}
              className="px-4 py-2 bg-white text-ruralTeal-950 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 text-ruralTeal-700 ${syncStatus === 'Syncing' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'Syncing' ? t('sync.syncing', 'Syncing...') : t('sync.syncNow', 'Sync Now')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK PATIENT SEARCH & START WORKFLOW BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('asha.searchPlaceholder', 'Quick search patient by name, phone, or ABHA ID...')}
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-ruralTeal-600"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            {t('common.search', 'Search')}
          </button>
          <Link
            to="/asha/workflow"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('asha.quickHealthCheck', 'Start Health Check')}</span>
          </Link>
        </div>
      </div>

      {/* 2. TODAY'S PRIORITY AREA */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              {t('asha.todaysPriority')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('asha.prioritySubtitle', 'Urgent red flags, high-risk pregnancies, due follow-ups & scheduled visits')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            {['ALL', 'URGENT', 'HIGH_PRIORITY', 'FOLLOWUPS', 'VISITS'].map((tab) => (
              <button
                key={tab}
                onClick={() => setPriorityTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                  priorityTab === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' ? t('common.all', 'All Priority') : tab === 'URGENT' ? t('asha.urgentCases', 'Urgent (Red)') : tab === 'HIGH_PRIORITY' ? t('asha.highPriorityCases', 'High (Yellow)') : tab === 'FOLLOWUPS' ? t('asha.followups', 'Follow-ups') : t('asha.todaysVisits', 'Visits')}
              </button>
            ))}
          </div>
        </div>

        {/* Priority 4-Block Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Urgent Cases (Red) */}
          {(priorityTab === 'ALL' || priorityTab === 'URGENT') && (
            <div className="rural-card p-4 border-l-4 border-l-rose-600 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded uppercase tracking-wider">
                    {t('asha.urgentRed', 'Urgent / Red')}
                  </span>
                  <span className="text-xs font-bold text-rose-600">{t('asha.casesCount', '{count} Cases', { count: 2 })}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">Meena Waghmare (34w)</h3>
                <p className="text-xs text-rose-900 font-medium">BP 145/95 • Severe headache</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Pre-eclampsia danger sign</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link to="/asha/priority" className="font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1">
                  {t('asha.escalate', 'Escalate')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a href="tel:102" className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-[11px]">
                  {t('asha.call102', 'Call 102')}
                </a>
              </div>
            </div>
          )}

          {/* High Priority Cases (Yellow) */}
          {(priorityTab === 'ALL' || priorityTab === 'HIGH_PRIORITY') && (
            <div className="rural-card p-4 border-l-4 border-l-amber-500 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded uppercase tracking-wider">
                    {t('asha.monitoringYellow', 'Monitoring / Yellow')}
                  </span>
                  <span className="text-xs font-bold text-amber-700">{t('asha.casesCount', '{count} Cases', { count: 2 })}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">Aarav Gawli (8mo Infant)</h3>
                <p className="text-xs text-amber-900 font-medium">Missed MR-1 Vaccine Dose</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Scheduled for doorstep recall</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link to="/asha/priority" className="font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1">
                  {t('asha.viewBoard', 'View Board')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/asha/followups" className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg text-[11px]">
                  {t('asha.schedule', 'Schedule')}
                </Link>
              </div>
            </div>
          )}

          {/* Follow-ups Due */}
          {(priorityTab === 'ALL' || priorityTab === 'FOLLOWUPS') && (
            <div className="rural-card p-4 border-l-4 border-l-blue-500 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded uppercase tracking-wider">
                    {t('asha.followups', 'Follow-ups')}
                  </span>
                  <span className="text-xs font-bold text-blue-700">{t('asha.dueCount', '{count} Due', { count: 4 })}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">IFA & Vitals Follow-up</h3>
                <p className="text-xs text-slate-700 font-medium">Radhika Shinde & Tukaram Patil</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Due today before 5:00 PM</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link to="/asha/followups" className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                  {t('asha.manageFollowups', 'Manage Follow-ups')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Today's Visits */}
          {(priorityTab === 'ALL' || priorityTab === 'VISITS') && (
            <div className="rural-card p-4 border-l-4 border-l-emerald-600 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded uppercase tracking-wider">
                    {t('asha.todaysVisits', "Today's Visits")}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {t('asha.doneFraction', '{done}/{total} Done', { done: visits.filter((v) => v.status === 'Completed').length, total: visits.length })}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">Village Survey Plan</h3>
                <p className="text-xs text-slate-700 font-medium">Nigdale & Bhimashankar Hamlets</p>
                <p className="text-[11px] text-slate-500 mt-0.5">ANC, nutrition & water checks</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link to="/asha/visits" className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                  {t('asha.checklist', 'Checklist')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. NINE QUICK FIELD ACTIONS */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ruralTeal-700" />
          {t('asha.quickActions')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
          {/* 1. Register Patient */}
          <Link
            to="/asha/register"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-ruralTeal-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-ruralTeal-50 text-ruralTeal-700 flex items-center justify-center mb-2.5 group-hover:bg-ruralTeal-600 group-hover:text-white transition-colors shadow-inner">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickRegister', 'Register Patient')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickRegisterDesc', '100% offline new registration')}</p>
            </div>
            <span className="text-[11px] font-bold text-ruralTeal-700 mt-3 flex items-center gap-1">
              {t('asha.addPatient', 'Add Patient')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 2. Health Check Workflow */}
          <Link
            to="/asha/workflow"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickHealthCheck', 'Health Check')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickHealthCheckDesc', '10-Step symptom & vitals triage')}</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 mt-3 flex items-center gap-1">
              {t('asha.startCheckup', 'Start Checkup')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 3. My Patients */}
          <Link
            to="/asha/patients"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickMyPatients', 'My Patients')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickMyPatientsDesc', 'Village registry & medical records')}</p>
            </div>
            <span className="text-[11px] font-bold text-blue-700 mt-3 flex items-center gap-1">
              {t('common.viewAll', 'View All')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 4. Today's Visits */}
          <Link
            to="/asha/visits"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-teal-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-inner">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickTodayVisits', "Today's Visits")}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickTodayVisitsDesc', 'Daily survey household roster')}</p>
            </div>
            <span className="text-[11px] font-bold text-teal-700 mt-3 flex items-center gap-1">
              {t('asha.houseVisits', 'House Visits')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 5. Doctor Follow-up & Referrals */}
          <Link
            to="/asha/followups"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickDoctorFollowup', 'Doctor Follow-up')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickDoctorFollowupDesc', 'Pending clinical tasks & re-checks')}</p>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 mt-3 flex items-center gap-1">
              {t('asha.followups', 'Follow-ups')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 6. Telemedicine */}
          <Link
            to="/asha/telemedicine"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-purple-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-inner">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickTelemedicine', 'Telemedicine')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickTelemedicineDesc', 'Connect patient to PHC doctor')}</p>
            </div>
            <span className="text-[11px] font-bold text-purple-700 mt-3 flex items-center gap-1">
              {t('asha.teleconsult', 'Teleconsult')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 7. Medicine & Tests */}
          <Link
            to="/asha/medicines"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickMedicineTests', 'Medicine & Tests')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickMedicineTestsDesc', 'PHC & CHC stock availability')}</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 mt-3 flex items-center gap-1">
              {t('asha.checkStock', 'Check Stock')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 8. Priority Cases */}
          <Link
            to="/asha/priority"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-rose-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5 group-hover:bg-rose-600 group-hover:text-white transition-colors shadow-inner">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickPriorityCases', 'Priority Cases')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickPriorityCasesDesc', 'Red & Yellow high-risk board')}</p>
            </div>
            <span className="text-[11px] font-bold text-rose-700 mt-3 flex items-center gap-1">
              {t('asha.priorityBoard', 'Priority Board')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* 9. Offline Records & Sync Vault */}
          <Link
            to="/asha/offline"
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-slate-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5 group-hover:bg-slate-700 group-hover:text-white transition-colors shadow-inner">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('asha.quickOfflineRecords', 'Offline Records')}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t('asha.quickOfflineRecordsDesc', 'Saved device vault & sync queue')}</p>
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-3 flex items-center gap-1">
              {t('asha.vaultView', 'Vault View')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </div>

      {/* 4. TODAY'S VISITS CHECKLIST WITH INSTANT TOGGLE */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ruralTeal-700" />
              {t('asha.scheduledVisitsChecklist', "Today's Visits Checklist")}
            </h2>
            <p className="text-xs text-slate-500">{t('asha.tapVisitHint', 'Tap any household to mark visit as completed')}</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {t('asha.doneOfTotal', '{done} of {total} Done', { done: visits.filter((v) => v.status === 'Completed').length, total: visits.length })}
          </span>
        </div>

        <div className="space-y-2.5">
          {visits.map((v, idx) => {
            const isDone = v.status === 'Completed';
            return (
              <div
                key={v.id || idx}
                onClick={() => toggleVisitStatus(idx)}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isDone ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-ruralTeal-400 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-colors ${
                    isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isDone && <Check className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {v.household} ({v.person})
                    </h4>
                    <p className="text-xs text-slate-600">{v.reason}</p>
                    {v.notes && <p className="text-[11px] text-slate-400 mt-0.5">{t('common.note', 'Note:')} {v.notes}</p>}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isDone ? t('common.completed', 'Completed') : t('common.pending', 'Pending')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{v.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
