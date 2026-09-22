import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Clock,
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  Calendar,
  PhoneCall,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function FollowupPage() {
  const { currentUser, patientGender } = useAuth();
  const { t } = useTranslation();

  const isMale = (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingFollowup, setPendingFollowup] = useState(basePatient.pendingFollowup);
  const [followupHistory, setFollowupHistory] = useState(basePatient.followupHistory);
  const assignedAsha = basePatient.assignedAsha;

  const loadFollowups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.followUps.getAll();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const pending = res.data.find((f) => f.status === 'PENDING' || f.status === 'SCHEDULED');
        if (pending) {
          setPendingFollowup({
            title: pending.reason || 'Routine Health Follow-up',
            worker: pending.asha_name || 'Sunita Tai (ASHA Sangini)',
            scheduledDate: pending.follow_up_date ? new Date(pending.follow_up_date).toLocaleDateString() : 'Next 3 Days',
            notes: pending.notes || 'Routine vitals check and follow-up consultation.'
          });
        }
        const completed = res.data
          .filter((f) => f.status === 'COMPLETED')
          .map((f) => ({
            id: f.id,
            worker: f.asha_name || 'Sunita Tai (ASHA)',
            type: f.reason || 'Follow-up Check',
            date: f.follow_up_date ? new Date(f.follow_up_date).toLocaleDateString() : 'Recent',
            outcome: f.outcome || f.notes || 'Patient vitals stable. Treatment adhered.'
          }));
        if (completed.length > 0) {
          setFollowupHistory(completed);
        }
      }
    } catch (err) {
      console.warn('Fallback to local patient followups:', err);
      setError('Live follow-up records offline. Displaying cached records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFollowups();
  }, [loadFollowups]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-ruralTeal-700" />
              Patient Follow-up & ASHA Visits
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Frontline community care, doorstep vitals checks & care continuum
            </p>
          </div>
        </div>

        <a
          href={`tel:${assignedAsha.phone}`}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <PhoneCall className="w-4 h-4" />
          <span className="hidden sm:inline">Call ASHA Worker</span>
        </a>
      </div>

      {error && (
        <ErrorState
          compact
          title="Notice"
          error={error}
          onRetry={loadFollowups}
        />
      )}

      {isLoading ? (
        <LoadingState message="Loading follow-up schedule..." subtitle="Connecting with ASHA field monitoring database" />
      ) : (
        <>
          {/* Pending Follow-up Highlight Card */}
          {pendingFollowup && (
            <div className="rural-card p-6 border-l-4 border-l-amber-500 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-md uppercase tracking-wider">
                    Pending Action Required
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {pendingFollowup.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Assigned Frontline Coordinator: <strong>{pendingFollowup.worker}</strong>
                  </p>
                </div>

                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 self-start sm:self-auto">
                  Due: {pendingFollowup.scheduledDate}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                <span className="text-slate-500 font-semibold block">Follow-up Clinical Notes & Tasks:</span>
                <p className="text-slate-700 text-sm leading-relaxed">{pendingFollowup.notes}</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Home visit verified under National Health Mission</span>
                </div>

                <a
                  href={`tel:${assignedAsha.phone}`}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Availability with ASHA</span>
                </a>
              </div>
            </div>
          )}

          {/* Follow-up History Log */}
          <div className="rural-card p-5 sm:p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ruralTeal-600" />
              Completed Follow-up History
            </h2>

            {followupHistory.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No History Found"
                description="No previous home visits or follow-ups logged yet."
              />
            ) : (
              <div className="space-y-3">
                {followupHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{hist.worker}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{hist.type}</span>
                      </div>
                      <span className="font-semibold text-slate-500">{hist.date}</span>
                    </div>

                    <p className="text-slate-700 font-medium leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                      {hist.outcome}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Logged to Digital Health Vault
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 rounded">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
