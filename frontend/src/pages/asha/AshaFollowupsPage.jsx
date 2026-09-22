import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { apiService } from '../../services/apiService';
import { saveCachedFollowup, getCachedFollowups } from '../../services/offlineStorage';
import { MOCK_ASHA_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Phone,
  UserCheck,
  ChevronRight,
  Plus,
  X,
  ShieldCheck,
  WifiOff
} from 'lucide-react';

export default function AshaFollowupsPage() {
  const { t } = useTranslation();
  const { isOnline, queueRecord } = useOffline();
  const [followups, setFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    priority: 'YELLOW',
    dueDate: 'Tomorrow',
    task: 'Doorstep Vitals & Medication Check',
    notes: ''
  });

  const normalizeFollowup = (f) => ({
    id: f.id,
    patientName: f.patient_name || f.patientName || 'Rural Citizen',
    priority: f.priority || 'YELLOW',
    dueDate: f.follow_up_date ? new Date(f.follow_up_date).toLocaleDateString() : (f.dueDate || 'Today'),
    task: f.reason || f.task || 'Doorstep Vitals & Medication Follow-up',
    notes: f.notes || 'Routine vitals check and follow-up consultation.',
    status: f.status || 'PENDING',
    isOfflineCached: Boolean(f.isOfflineCached)
  });

  const loadFollowups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let baseList = [];
      try {
        const res = await apiService.followUps.getAll();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          baseList = res.data.map(normalizeFollowup);
        } else if (res && Array.isArray(res.data) && res.data.length > 0) {
          baseList = res.data.map(normalizeFollowup);
        } else {
          baseList = (MOCK_ASHA_DATA.followupsList || []).map(normalizeFollowup);
        }
      } catch (err) {
        console.warn('Fallback to local followups list:', err);
        baseList = (MOCK_ASHA_DATA.followupsList || []).map(normalizeFollowup);
        setError('Live follow-ups offline. Showing offline cached follow-ups.');
      }

      // Merge cached followups from IndexedDB
      try {
        const cached = await getCachedFollowups();
        if (cached && cached.length > 0) {
          const cachedNormalized = cached.map((f) => ({
            ...normalizeFollowup(f),
            isOfflineCached: true
          }));

          const existingIds = new Set(baseList.map((f) => f.id));
          const newCached = cachedNormalized.filter((c) => !existingIds.has(c.id));
          setFollowups([...newCached, ...baseList]);
        } else {
          setFollowups(baseList);
        }
      } catch (idbErr) {
        console.warn('Could not read cached follow-ups from IDB:', idbErr);
        setFollowups(baseList);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFollowups();
  }, [loadFollowups]);

  const handleCreateFollowup = async (e) => {
    e.preventDefault();
    if (!formData.patientName.trim()) return;

    setFormSubmitting(true);
    const payload = {
      id: `fup-off-${Date.now()}`,
      patientName: formData.patientName.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate,
      task: formData.task,
      notes: formData.notes || 'Routine field vitals check.',
      status: 'PENDING',
      isOfflineCached: true,
      recordedAt: new Date().toISOString()
    };

    try {
      // 1. Save locally to IndexedDB
      await saveCachedFollowup(payload);
      // 2. Queue for background sync
      await queueRecord('FOLLOW_UP', payload);

      // 3. Prepend to state immediately
      setFollowups((prev) => [payload, ...prev]);
      setIsModalOpen(false);
      setFormData({
        patientName: '',
        priority: 'YELLOW',
        dueDate: 'Tomorrow',
        task: 'Doorstep Vitals & Medication Check',
        notes: ''
      });
    } catch (err) {
      console.error('Failed creating offline follow-up:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const markCompleted = async (id) => {
    try {
      await apiService.followUps.updateStatus(id, 'COMPLETED');
    } catch (err) {
      console.warn('Local follow-up completion:', err);
    }
    setFollowups((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'COMPLETED' } : f))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
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
              <Clock className="w-6 h-6 text-ruralTeal-700" />
              {t('asha.followupsTitle', 'ASHA Doorstep Follow-up Tasks')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('asha.followupsDesc', 'Assigned clinical follow-ups, medication checks & vaccine recalls')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ {t('asha.scheduleFollowup', 'Schedule Follow-up')}</span>
          </button>
          <Link
            to="/asha/workflow"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            {t('asha.newCheckup', 'New Checkup')}
          </Link>
        </div>
      </div>

      {error && (
        <ErrorState
          compact
          title={t('common.notice', 'Notice')}
          error={error}
          onRetry={loadFollowups}
        />
      )}

      {/* Follow-up Tasks List */}
      <div className="space-y-3">
        {isLoading ? (
          <LoadingState message={t('asha.loadingFollowups', 'Loading follow-up tasks...')} subtitle={t('asha.queryingFieldService', 'Querying ASHA Field Service database')} />
        ) : followups.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={t('emptyStates.defaultTitle', 'No Follow-up Tasks')}
            description={t('emptyStates.defaultDesc', 'You have no outstanding patient follow-ups or doorstep visits due.')}
            actionLabel={t('asha.scheduleFollowup', 'Schedule Follow-up')}
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          followups.map((f) => {
            const isRed = f.priority === 'RED';
            const isCompleted = f.status === 'COMPLETED';

            return (
              <div
                key={f.id}
                className={`rural-card p-5 space-y-3 transition-all border ${
                  isCompleted
                    ? 'bg-slate-50 opacity-75 border-slate-200'
                    : isRed
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        isRed
                          ? 'bg-rose-600 text-white'
                          : f.priority === 'YELLOW'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {f.priority === 'RED' ? t('triage.urgentRed', 'Urgent / Red') : f.priority === 'YELLOW' ? t('triage.monitoringYellow', 'Monitoring / Yellow') : t('triage.stableGreen', 'Stable / Green')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{f.patientName}</h3>
                    {f.isOfflineCached && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {t('sync.storedLocally', 'Stored Locally (Pending Sync)')}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-slate-500">
                    {t('common.due', 'Due')}: <strong>{f.dueDate}</strong>
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">{f.task}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.notes}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {t('common.status', 'Status')}: <strong>{isCompleted ? t('common.completed', 'Completed') : t('common.pending', 'Pending')}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button
                        onClick={() => markCompleted(f.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('asha.markCompleted', 'Mark Completed')}
                      </button>
                    )}
                    <Link
                      to={`/asha/workflow?patient=${encodeURIComponent(f.patientName)}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      {t('common.examine', 'Examine')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Follow-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-ruralTeal-100 text-ruralTeal-800 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Schedule Patient Follow-up</h3>
                  <p className="text-xs text-slate-500">Works 100% offline in rural field areas</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Citizen / Patient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhabai Shinde"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-ruralTeal-600 focus:outline-none bg-white"
                  >
                    <option value="GREEN">GREEN (Routine / Stable)</option>
                    <option value="YELLOW">YELLOW (Moderate / Watch)</option>
                    <option value="RED">RED (High-Risk / Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Due Timeline
                  </label>
                  <select
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-ruralTeal-600 focus:outline-none bg-white"
                  >
                    <option value="Today">Today (Immediate)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="In 3 Days">In 3 Days</option>
                    <option value="In 1 Week">In 1 Week</option>
                    <option value="In 2 Weeks">In 2 Weeks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Follow-up Action / Clinical Task *
                </label>
                <input
                  type="text"
                  required
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  placeholder="e.g. Check BP, Verify IFA tablet compliance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Instructions / Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Verify patient takes prescribed antihypertensives after morning meal. Alert PHC if BP > 140/90."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-ruralTeal-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>{formSubmitting ? 'Saving...' : 'Save & Queue Follow-up'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
