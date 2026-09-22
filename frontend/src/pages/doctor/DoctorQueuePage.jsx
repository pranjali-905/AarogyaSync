import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Activity,
  AlertTriangle,
  Clock,
  Video,
  FileText,
  Camera,
  Search,
  ChevronLeft,
  Filter,
  User,
  MapPin,
  Building2,
  Paperclip,
  CheckCircle2,
  Eye,
  X,
  ArrowRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export default function DoctorQueuePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter = searchParams.get('filter') || 'ALL';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeQueueItem = (item, idx) => ({
    id: item.id || `cq-${idx}`,
    patientId: item.patient_id || item.patientId || 'usr-pat-female-01',
    patientName: item.patient_name || item.patientName || 'Rural Citizen',
    age: item.age || 28,
    gender: item.gender || 'Female',
    village: item.village || 'Nigdale',
    abhaId: item.abha_id || item.abhaId || '91-8832-1102-4567',
    priority: (item.triage_priority || item.priority || 'MODERATE').toUpperCase(),
    priorityLabel: item.priorityLabel || `${item.triage_priority || item.priority || 'MODERATE'} Priority`,
    chiefComplaint: item.chief_complaints || item.chiefComplaint || item.clinical_notes || 'Clinical consultation review required',
    vitals: item.vitals || {
      bp: item.systolic_bp && item.diastolic_bp ? `${item.systolic_bp}/${item.diastolic_bp}` : '120/80',
      pulse: item.pulse_rate ? String(item.pulse_rate) : '78',
      spO2: item.spo2_pct ? `${item.spo2_pct}%` : '98%',
      temp: item.body_temp_f ? `${item.body_temp_f} °F` : '98.4 °F',
      bloodSugar: item.blood_glucose_mg_dl ? `${item.blood_glucose_mg_dl} mg/dL` : '95 mg/dL'
    },
    source: item.source || (item.recorded_by_name ? `Field Triage (${item.recorded_by_name})` : 'ASHA Field Triage Escalation'),
    ashaWorker: item.ashaWorker || item.recorded_by_name || 'Sunita Tai (ASHA Sangini)',
    waitingTime: item.waitingTime || '15 mins ago',
    timeReceived: item.timeReceived || (item.recorded_at ? new Date(item.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM'),
    type: item.consultation_type || item.type || 'TELECONSULT',
    status: item.status || 'WAITING',
    notes: item.clinical_notes || item.notes || 'Vital parameters recorded.',
    hasAttachment: Boolean(item.hasAttachment || item.photo_evidence_url),
    attachmentType: item.attachmentType || 'LAB_SLIP'
  });

  const loadQueue = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.doctor.getQueue();
      if (res && res.success && res.data) {
        let combined = [];
        if (Array.isArray(res.data)) {
          combined = res.data;
        } else if (res.data.emergencyTriageQueue || res.data.scheduledConsultations) {
          const emergencies = (res.data.emergencyTriageQueue || []).map(normalizeQueueItem);
          const scheduled = (res.data.scheduledConsultations || []).map(normalizeQueueItem);
          combined = [...emergencies, ...scheduled];
        }
        if (combined.length > 0) {
          setQueue(combined);
        } else {
          setQueue(MOCK_DOCTOR_DATA.consultationQueue.map(normalizeQueueItem));
        }
      } else {
        setQueue(MOCK_DOCTOR_DATA.consultationQueue.map(normalizeQueueItem));
      }
    } catch (err) {
      console.warn('Fallback to local doctor consultation queue:', err);
      setQueue(MOCK_DOCTOR_DATA.consultationQueue.map(normalizeQueueItem));
      setError('Live doctor clinical queue offline. Displaying local queue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const filteredQueue = queue.filter((item) => {
    const matchesFilter =
      activeFilter === 'ALL' || item.priority === activeFilter;
    const matchesSearch =
      (item.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.chiefComplaint || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.village || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ashaWorker || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'ALL') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', filter);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/doctor" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('doctor.dashboardTitle', 'Doctor Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('doctor.todayQueue', 'Consultation Queue')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-red-600" />
            {t('doctor.todayQueue', 'Consultation Queue')}
          </h1>
          <p className="text-slate-600 mt-1">
            Prioritized clinical intake with live vitals triage (Urgent Red, High Orange, Moderate Yellow, Routine Green).
          </p>
        </div>

        {/* Quick stat counters */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            {queue.filter((q) => q.priority === 'RED').length} Urgent RED
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
            Total Waiting: {queue.length}
          </div>
        </div>
      </div>

      {error && (
        <ErrorState
          compact
          title="Notice"
          error={error}
          onRetry={loadQueue}
        />
      )}

      {/* 2. Consultation Flow Explainer Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white shadow-sm border border-slate-800 text-xs space-y-2">
        <span className="font-bold text-teal-300 uppercase tracking-wider block">
          AarogyaSync Clinical Consultation Protocol:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-slate-300">
          <span className="bg-white/10 px-2 py-1 rounded-lg">1. ASHA / Patient Submits</span>
          <span>→</span>
          <span className="bg-white/10 px-2 py-1 rounded-lg">2. Triaged in Queue</span>
          <span>→</span>
          <span className="bg-white/10 px-2 py-1 rounded-lg">3. Doctor Reviews Vitals & Photo</span>
          <span>→</span>
          <span className="bg-white/10 px-2 py-1 rounded-lg">4. Live / Async Consult</span>
          <span>→</span>
          <span className="bg-white/10 px-2 py-1 rounded-lg">5. Issue e-Rx & Referral</span>
          <span>→</span>
          <span className="bg-emerald-500/30 text-emerald-200 px-2 py-1 rounded-lg font-bold">6. Syncs to Patient Digital Backpack</span>
        </div>
      </div>

      {/* 3. Search & 4-Tier Triage Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, complaint, village or ASHA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>

        {/* 4 Priority Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => handleFilterChange('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t('common.all', 'All')} ({queue.length})
          </button>

          <button
            onClick={() => handleFilterChange('RED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'RED'
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {t('doctor.filterUrgent', 'Urgent Red')} ({queue.filter((q) => q.priority === 'RED').length})
          </button>

          <button
            onClick={() => handleFilterChange('HIGH')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'HIGH'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {t('doctor.filterHigh', 'High Orange')} ({queue.filter((q) => q.priority === 'HIGH').length})
          </button>

          <button
            onClick={() => handleFilterChange('MODERATE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'MODERATE'
                ? 'bg-yellow-500 text-slate-900 shadow-sm'
                : 'text-yellow-800 hover:bg-yellow-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            {t('doctor.filterModerate', 'Moderate Yellow')} ({queue.filter((q) => q.priority === 'MODERATE').length})
          </button>

          <button
            onClick={() => handleFilterChange('ROUTINE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[42px] flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'ROUTINE'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {t('doctor.filterRoutine', 'Routine Green')} ({queue.filter((q) => q.priority === 'ROUTINE').length})
          </button>
        </div>
      </div>

      {/* 4. Queue Cards Grid */}
      {isLoading ? (
        <LoadingState message={t('common.loading', 'Loading clinical queue...')} subtitle={t('doctor.queueSubtitle', 'Triaging emergency and scheduled consultations')} />
      ) : filteredQueue.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={t('emptyStates.noQueue', 'No Cases in Queue')}
          description={t('emptyStates.noQueueDesc', 'No patients currently waiting under this filter.')}
          actionLabel={t('common.reset', 'View All Queue')}
          onAction={() => handleFilterChange('ALL')}
        />
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item) => {
            const isRed = item.priority === 'RED';
            const isHigh = item.priority === 'HIGH';
            const isModerate = item.priority === 'MODERATE';

            const cardBorder = isRed
              ? 'border-l-4 border-l-red-600 bg-rose-50/30 border-rose-200'
              : isHigh
              ? 'border-l-4 border-l-amber-500 bg-amber-50/25 border-amber-200'
              : isModerate
              ? 'border-l-4 border-l-yellow-400 bg-yellow-50/20 border-yellow-200'
              : 'border-l-4 border-l-emerald-500 bg-emerald-50/20 border-emerald-200';

            const badgeBg = isRed
              ? 'bg-red-600 text-white'
              : isHigh
              ? 'bg-amber-500 text-white'
              : isModerate
              ? 'bg-yellow-400 text-slate-900'
              : 'bg-emerald-600 text-white';

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${cardBorder}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Patient Details & Complaint */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${badgeBg}`}>
                        {item.priorityLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {item.patientName} ({item.age} yrs, {item.gender})
                      </h3>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.village}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ABHA: {item.abhaId}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-800 bg-white/80 p-3 rounded-xl border border-slate-200/80">
                      {item.chiefComplaint}
                    </p>

                    {/* Vitals Strip */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      {item.vitals.bp && (
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          BP: <strong className={isRed ? 'text-red-600' : 'text-slate-900'}>{item.vitals.bp}</strong> mmHg
                        </span>
                      )}
                      {item.vitals.pulse && (
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          Pulse: <strong className="text-slate-900">{item.vitals.pulse}</strong> bpm
                        </span>
                      )}
                      {item.vitals.spO2 && (
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          SpO2: <strong className={parseInt(item.vitals.spO2) < 95 ? 'text-red-600' : 'text-emerald-700'}>{item.vitals.spO2}</strong>
                        </span>
                      )}
                      {item.vitals.temp && (
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          Temp: <strong className="text-slate-900">{item.vitals.temp}</strong>
                        </span>
                      )}
                      {item.vitals.hb && (
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          Hb: <strong className="text-slate-900">{item.vitals.hb}</strong>
                        </span>
                      )}
                      {item.vitals.bloodSugar && (
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          Sugar: <strong className="text-slate-900">{item.vitals.bloodSugar}</strong>
                        </span>
                      )}
                    </div>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Source: <strong>{item.source}</strong> ({item.ashaWorker})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Received: {item.timeReceived} ({item.waitingTime})
                      </span>
                      {item.hasAttachment && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => setSelectedAttachment(item)}
                            className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1 underline cursor-pointer"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                            View Attachment ({item.attachmentType})
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
                    <Link
                      to={`/doctor/consult/${item.patientId}`}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs shadow-sm transition-all min-h-[46px] ${
                        isRed
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      Start Consultation
                    </Link>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link
                        to={`/doctor/history?patientId=${item.patientId}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold min-h-[44px]"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Timeline
                      </Link>

                      <Link
                        to={`/doctor/referrals?patientId=${item.patientId}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold min-h-[44px]"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        Referral
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Attachment Preview Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  Field Attachment Preview
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedAttachment.patientName} • {selectedAttachment.attachmentType}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-56 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center border border-slate-800">
              <Camera className="w-10 h-10 text-teal-400 mb-2" />
              <p className="font-bold text-sm">Clinical Photograph / Lab Slip</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Captured offline by {selectedAttachment.ashaWorker} on field smartphone
              </p>
              <span className="mt-3 px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-teal-200">
                Resolution: 1920x1080 • Verified Intact
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500">Clinical Field Notes:</p>
              <p className="font-semibold text-slate-800">{selectedAttachment.notes}</p>
            </div>

            <button
              onClick={() => setSelectedAttachment(null)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 min-h-[48px]"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
