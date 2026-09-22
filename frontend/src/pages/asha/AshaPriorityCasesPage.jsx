import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { apiService } from '../../services/apiService';
import { MOCK_ASHA_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  AlertTriangle,
  PhoneCall,
  Ambulance,
  ArrowRight,
  ClipboardCheck,
  Building2,
  Filter,
  CheckCircle2,
  ChevronLeft,
  User,
  MapPin,
  Clock,
  ShieldAlert,
  Search
} from 'lucide-react';

export default function AshaPriorityCasesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { queueRecord } = useOffline();

  const [cases, setCases] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionAlert, setActionAlert] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeCases = (list) => {
    return (list || []).map((c, idx) => ({
      id: c.id || `case-${idx}`,
      patientName: c.patient_name || c.patientName || 'Rural Citizen',
      age: c.age || (c.is_pregnant ? '24' : '45'),
      motherName: c.motherName || (c.mother_name || ''),
      village: c.village || 'Nigdale',
      condition: c.condition || (Array.isArray(c.symptoms) ? c.symptoms.join(', ') : c.clinical_notes || 'Vital sign threshold crossed'),
      priority: (c.triage_priority || c.priority || 'YELLOW').toUpperCase(),
      action: c.action || (c.triage_priority === 'RED' ? 'Immediate PHC referral and ambulance transfer' : 'Doorstep vitals check and MO review'),
      phone: c.patient_phone || c.phone || '9876543200',
      token: c.token || (c.triage_priority === 'RED' ? `RED-0${idx + 1}` : `YEL-0${idx + 1}`)
    }));
  };

  const loadPriorityCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.asha.getPriorityCases();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCases(normalizeCases(res.data));
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        setCases(normalizeCases(res.data));
      } else {
        setCases(normalizeCases(MOCK_ASHA_DATA.priorityCases || []));
      }
    } catch (err) {
      console.warn('Fallback to local priority cases:', err);
      setCases(normalizeCases(MOCK_ASHA_DATA.priorityCases || []));
      setError('Live triage feed unavailable. Showing cached priority cases.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPriorityCases();
  }, [loadPriorityCases]);

  const filteredCases = cases.filter((item) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'RED' && item.priority === 'RED') ||
      (activeTab === 'YELLOW' && item.priority === 'YELLOW');
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleEscalateCase = async (c) => {
    await queueRecord('PRIORITY_ESCALATION', {
      caseId: c.id,
      patientName: c.patientName,
      priority: c.priority,
      timestamp: new Date().toISOString()
    });

    setActionAlert(`Escalated case for ${c.patientName} to Block Medical Officer.`);
    setTimeout(() => setActionAlert(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/asha" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('asha.dashboardTitle', 'ASHA Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('asha.todaysPriority', 'Priority Cases')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-600" />
            {t('asha.todaysPriority', "Today's Priority Cases")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('asha.prioritySubtitle', 'Red alert emergencies and yellow high-priority patients requiring immediate field follow-up or transfer.')}
          </p>
        </div>

        {/* Quick Triage CTA */}
        <Link
          to="/asha/workflow"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold shadow-lg shadow-red-600/20 hover:from-red-700 hover:to-rose-800 transition-all min-h-[48px]"
        >
          <ClipboardCheck className="w-5 h-5" />
          {t('asha.startTriageVitals', 'Start Triage & Vitals Check')}
        </Link>
      </div>

      {/* Action Notification */}
      {actionAlert && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0" />
          <p className="font-medium text-sm">{actionAlert}</p>
        </div>
      )}

      {error && (
        <ErrorState
          compact
          title={t('common.notice', 'Notice')}
          error={error}
          onRetry={loadPriorityCases}
        />
      )}

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('asha.searchCasesPlaceholder', 'Search patient, village or condition...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t('asha.allPriorityCasesCount', 'All Priority ({count})', { count: cases.length })}
          </button>
          <button
            onClick={() => setActiveTab('RED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'RED'
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {t('asha.urgentRedCount', 'Urgent Red ({count})', { count: cases.filter((c) => c.priority === 'RED').length })}
          </button>
          <button
            onClick={() => setActiveTab('YELLOW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'YELLOW'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {t('asha.highYellowCount', 'High Yellow ({count})', { count: cases.filter((c) => c.priority === 'YELLOW').length })}
          </button>
        </div>
      </div>

      {/* Cards List */}
      {isLoading ? (
        <LoadingState message={t('asha.retrievingPriorityCases', 'Retrieving high-priority cases...')} subtitle={t('asha.evaluatingDigitalTriage', 'Evaluating digital triage database')} />
      ) : filteredCases.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title={t('emptyStates.defaultTitle', 'No Priority Cases Found')}
          description={t('emptyStates.defaultDesc', 'There are currently no urgent Red or high Yellow triage cases matching your query.')}
          actionLabel={searchQuery || activeTab !== 'ALL' ? t('common.resetFilter', 'Reset Filter') : null}
          onAction={() => { setSearchQuery(''); setActiveTab('ALL'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCases.map((c) => {
          const isRed = c.priority === 'RED';
          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                isRed
                  ? 'bg-red-50/40 border-red-200'
                  : 'bg-amber-50/30 border-amber-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isRed
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {isRed ? t('asha.urgentRedDanger', 'URGENT RED DANGER') : t('asha.highPriorityYellow', 'HIGH PRIORITY YELLOW')}
                </span>

                <span className="font-mono text-xs font-bold text-slate-500 bg-white/80 px-2 py-1 rounded-lg border border-slate-200">
                  {c.token}
                </span>
              </div>

              {/* Patient details */}
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-slate-500" />
                <h3 className="text-lg font-bold text-slate-900">{c.patientName}</h3>
                {c.age && <span className="text-xs text-slate-500">• {c.age} {t('profile.yearsShort', 'yrs')}</span>}
                {c.motherName && <span className="text-xs text-slate-500">• {t('asha.motherLabel', 'Mother')}: {c.motherName}</span>}
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>Village: {c.village}</span>
              </div>

              {/* Condition box */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 mb-3 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Critical Finding / Symptom
                </span>
                <p className="text-sm font-bold text-slate-900">{c.condition}</p>
              </div>

              {/* Action Required */}
              <div className="p-2.5 rounded-xl bg-amber-100/60 border border-amber-200/80 mb-4 text-xs font-semibold text-amber-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  <strong>Recommended Action:</strong> {c.action}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                <a
                  href={`tel:${c.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4 text-primary-600" />
                  Call Patient
                </a>

                <button
                  onClick={() => navigate(`/asha/referrals`)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100 min-h-[44px]"
                >
                  <Ambulance className="w-4 h-4" />
                  Dispatch 102/108
                </button>

                <button
                  onClick={() => handleEscalateCase(c)}
                  className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 min-h-[44px]"
                >
                  Escalate MO
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
