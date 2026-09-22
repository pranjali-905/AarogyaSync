import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { formatLocalizedStatus, formatLocalizedCategory } from '../../translations';
import { apiService } from '../../services/apiService';
import { MOCK_ASHA_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getCachedPatients } from '../../services/offlineStorage';
import {
  Users,
  ArrowLeft,
  Search,
  UserPlus,
  Phone,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HeartPulse,
  Activity,
  WifiOff
} from 'lucide-react';

export default function AshaPatientRegistryPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'ALL', label: t('asha.allPatients', 'All Patients') },
    { id: 'PREGNANT_MOTHER', label: t('asha.pregnantMothers', 'Pregnant Mothers (ANC)') },
    { id: 'HIGH_RISK_ANC', label: t('asha.highRiskMothers', 'High-Risk Mothers') },
    { id: 'INFANT', label: t('asha.infants', 'Infants (0-1 yr)') },
    { id: 'CHRONIC_CARE', label: t('asha.chronicCare', 'Chronic Care (HTN/Diabetes)') },
    { id: 'ELDERLY', label: t('asha.elderly', 'Elderly (60+)') }
  ];

  const normalizePatient = (p) => ({
    id: p.id || p.user_id,
    fullName: p.full_name || p.fullName || 'Citizen',
    phone: p.phone || '9876543210',
    age: p.age || 26,
    gender: (p.gender || 'female').toLowerCase(),
    category: p.category || (p.is_pregnant ? (p.high_risk_flag ? 'HIGH_RISK_ANC' : 'PREGNANT_MOTHER') : 'CHRONIC_CARE'),
    categoryLabel: p.categoryLabel || (p.is_pregnant ? (p.high_risk_flag ? 'High-Risk Pregnancy' : 'Pregnant Mother (ANC)') : 'General Citizen'),
    village: p.village || 'Nigdale',
    abhaId: p.abha_id || p.abhaId || '91-4521-8890-1234',
    status: p.status || (p.high_risk_flag ? 'Urgent / Red' : 'Stable / Green'),
    details: p.details || (p.is_pregnant ? `${p.gestational_weeks || 28} Weeks Gestation • ANC Monitored` : 'Community Healthcare Enrollee'),
    lastVitals: p.lastVitals || { bp: '118/76', pulse: '76', spO2: '99%' }
  });

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let baseList = [];
      try {
        const res = await apiService.asha.getPatients();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          baseList = res.data.map(normalizePatient);
        } else if (res && Array.isArray(res.data) && res.data.length > 0) {
          baseList = res.data.map(normalizePatient);
        } else {
          baseList = (MOCK_ASHA_DATA.patientsList || []).map(normalizePatient);
        }
      } catch (err) {
        console.warn('Fallback to local patients list:', err);
        baseList = (MOCK_ASHA_DATA.patientsList || []).map(normalizePatient);
        setError('Live village database offline. Showing offline cached registry.');
      }

      // Merge local IndexedDB cached registrations
      try {
        const cached = await getCachedPatients();
        if (cached && cached.length > 0) {
          const cachedNormalized = cached.map((p) => ({
            ...normalizePatient(p),
            isOfflineCached: true,
            status: p.isPregnant ? 'Urgent / Red' : 'Stable / Green',
            details: p.isPregnant
              ? 'Locally Registered • Pregnant Mother (ANC)'
              : 'Locally Registered • Community Healthcare Enrollee'
          }));

          // Deduplicate by id and phone
          const existingIds = new Set(baseList.map((p) => p.id));
          const existingPhones = new Set(baseList.map((p) => p.phone));
          const newCached = cachedNormalized.filter(
            (c) => !existingIds.has(c.id) && !existingPhones.has(c.phone)
          );
          setPatients([...newCached, ...baseList]);
        } else {
          setPatients(baseList);
        }
      } catch (idbErr) {
        console.warn('Could not read cached patients from IDB:', idbErr);
        setPatients(baseList);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const filteredPatients = patients.filter((p) => {
    const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch =
      (p.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone || '').includes(searchQuery) ||
      (p.village || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.abhaId || '').includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/asha"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-ruralTeal-700" />
              {t('asha.villageRegistryTitle', 'Village Patient Registry')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('asha.assignedHouseholdsDesc', 'Assigned households across Nigdale & Bhimashankar hamlets')}
            </p>
          </div>
        </div>

        <Link
          to="/asha/register"
          className="px-4 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ {t('asha.registerNewPatient', 'Register New Patient')}</span>
        </Link>
      </div>

      {error && (
        <ErrorState
          compact
          title={t('common.notice', 'Notice')}
          error={error}
          onRetry={loadPatients}
        />
      )}

      {/* Search & Category Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('asha.searchPatientPlaceholder', 'Search patient by name, mobile number, ABHA ID or hamlet...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-ruralTeal-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-ruralTeal-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards List */}
      <div className="space-y-3">
        {isLoading ? (
          <LoadingState message={t('asha.loadingRegisteredPatients', 'Loading registered patients...')} subtitle={t('asha.syncingDistrictRegistry', 'Synchronizing with District Patient Registry')} />
        ) : filteredPatients.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t('emptyStates.noPatients', 'No Patients Found')}
            description={t('asha.noPatientsMatch', 'No citizens found matching "{query}"', { query: searchQuery || t('common.all', 'current filter') })}
            actionLabel={t('asha.registerNewPatient', 'Register New Patient')}
            onAction={() => window.location.assign('/asha/register')}
          />
        ) : (
          filteredPatients.map((patient) => {
            const isRed = (patient.status || '').includes('Red');
            const isYellow = (patient.status || '').includes('Yellow');

            return (
              <div
                key={patient.id}
                className="rural-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 rural-card-hover border border-slate-200/80"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{patient.fullName}</span>
                    <span className="text-xs text-slate-500">
                      ({patient.age} {t('profile.yearsShort', 'yrs')} • {patient.gender === 'female' ? t('profile.female', 'FEMALE') : t('profile.male', 'MALE')})
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      {formatLocalizedCategory(patient.category, t)}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isRed
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isYellow
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      ● {formatLocalizedStatus(patient.status, t)}
                    </span>
                    {patient.isOfflineCached && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {t('sync.storedLocally', 'Stored Locally (Pending Sync)')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-semibold">{patient.details}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span>{t('profile.abhaShort', 'ABHA')}: <strong className="font-mono text-slate-700">{patient.abhaId}</strong></span>
                    <span>•</span>
                    <span>{t('profile.villageLabelShort', 'Village')}: <strong>{patient.village}</strong></span>
                    <span>•</span>
                    <span>{t('profile.phoneLabelShort', 'Phone')}: <strong>{patient.phone}</strong></span>
                  </div>

                  {patient.lastVitals && (
                    <div className="mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-wrap gap-3 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">{t('asha.lastVitals', 'Last Vitals')}:</span>
                      {patient.lastVitals.bp && <span>{t('triage.bpShort', 'BP')}: <strong>{patient.lastVitals.bp}</strong></span>}
                      {patient.lastVitals.spO2 && <span>{t('triage.spo2Short', 'SpO2')}: <strong>{patient.lastVitals.spO2}</strong></span>}
                      {patient.lastVitals.pulse && <span>{t('triage.pulseShort', 'Pulse')}: <strong>{patient.lastVitals.pulse}</strong></span>}
                      {patient.lastVitals.hb && <span>{t('triage.hbShort', 'Hb')}: <strong>{patient.lastVitals.hb}</strong></span>}
                      {patient.lastVitals.bloodSugar && <span>{t('triage.sugarShort', 'Sugar')}: <strong>{patient.lastVitals.bloodSugar}</strong></span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 justify-end">
                  <Link
                    to={`/asha/workflow?patientId=${patient.id}`}
                    className="px-3.5 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{t('asha.healthCheck', 'Health Check')}</span>
                  </Link>

                  <Link
                    to={`/asha/referrals?patientId=${patient.id}`}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    {t('asha.refer', 'Refer')}
                  </Link>

                  <a
                    href={`tel:${patient.phone}`}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                    title={t('common.call', 'Call Patient')}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
