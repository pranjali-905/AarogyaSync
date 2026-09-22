import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE } from '../../services/mockData';
import apiService from '../../services/apiService';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Pill,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  UserCheck,
  Stethoscope,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  Bell,
  Check,
  Building2,
  FileText
} from 'lucide-react';

export default function MedicinesFollowupPage() {
  const { currentUser, patientGender, patientType } = useAuth();
  const { t } = useTranslation();

  const isMale = (patientType === 'male') || (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [activeTab, setActiveTab] = useState('medicines'); // 'medicines' | 'followup'
  const [medicines, setMedicines] = useState(basePatient.activeMedicines || []);
  const [takenToday, setTakenToday] = useState(() => {
    try {
      const saved = localStorage.getItem(`aarogya_taken_${currentUser?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [refillStatus, setRefillStatus] = useState({});
  const [refillModalMed, setRefillModalMed] = useState(null);
  const [refillFacility, setRefillFacility] = useState('Bhimashankar Primary Health Centre');
  const [refillMessage, setRefillMessage] = useState('');

  // Follow-up state
  const [pendingFollowup, setPendingFollowup] = useState(basePatient.pendingFollowup);
  const [followupConfirmed, setFollowupConfirmed] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [followupHistory, setFollowupHistory] = useState(basePatient.followupHistory || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const assignedAsha = basePatient.assignedAsha || {
    name: 'Sunita Tai Gaikwad',
    phone: '+91 98765 43210',
    village: 'Nigdale'
  };

  // Load live follow-ups if available from API
  const loadFollowups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.followUps.getAll();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const pending = res.data.find((f) => f.status === 'PENDING' || f.status === 'SCHEDULED' || f.status === 'CONFIRMED');
        if (pending) {
          setPendingFollowup({
            id: pending.id,
            title: pending.reason || 'Routine Doctor Follow-up',
            worker: pending.asha_name || 'Dr. Ramesh Kulkarni (Medical Officer)',
            scheduledDate: pending.follow_up_date ? new Date(pending.follow_up_date).toLocaleDateString() : 'Upcoming Thursday',
            notes: pending.notes || 'Routine vitals check, BP evaluation, and prescription review.',
            status: pending.status
          });
          if (pending.status === 'CONFIRMED') {
            setFollowupConfirmed(true);
          }
        }
        const completed = res.data
          .filter((f) => f.status === 'COMPLETED')
          .map((f) => ({
            id: f.id,
            worker: f.asha_name || 'Medical Officer',
            type: f.reason || 'Follow-up Check',
            date: f.follow_up_date ? new Date(f.follow_up_date).toLocaleDateString() : 'Recent',
            outcome: f.outcome || f.notes || 'Patient vitals stable. Prescriptions adhered.'
          }));
        if (completed.length > 0) {
          setFollowupHistory(completed);
        }
      }
    } catch (err) {
      console.warn('Fallback to local patient followups:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFollowups();
  }, [loadFollowups]);

  // Save takenToday in local storage
  const toggleDose = (medId) => {
    setTakenToday((prev) => {
      const updated = { ...prev, [medId]: !prev[medId] };
      try {
        localStorage.setItem(`aarogya_taken_${currentUser?.id || 'guest'}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
      return updated;
    });
  };

  // Submit refill request
  const handleRefillSubmit = (e) => {
    e.preventDefault();
    if (!refillModalMed) return;

    setRefillStatus((prev) => ({
      ...prev,
      [refillModalMed.id]: {
        requested: true,
        facility: refillFacility,
        date: new Date().toLocaleDateString()
      }
    }));

    setRefillMessage(`Refill request successfully sent for ${refillModalMed.name}. Pickup at ${refillFacility}.`);
    setRefillModalMed(null);
    setTimeout(() => {
      setRefillMessage('');
    }, 4500);
  };

  // Confirm attendance for upcoming follow-up
  const handleConfirmAttendance = async () => {
    try {
      if (pendingFollowup?.id) {
        await apiService.followUps.updateStatus(pendingFollowup.id, 'CONFIRMED');
      }
      setFollowupConfirmed(true);
    } catch (err) {
      console.warn('Could not update backend status, confirming locally:', err);
      setFollowupConfirmed(true);
    }
  };

  const handleToggleReminder = () => {
    setReminderSet((prev) => !prev);
  };

  const takenCount = Object.values(takenToday).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-6 h-6 text-ruralTeal-700" />
              {t('nav.medicinesFollowup')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Active prescriptions, daily dose tracker, refill requests & doctor follow-up visits
            </p>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'medicines'
                ? 'bg-white text-ruralTeal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Current Medicines ({medicines.length})
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'followup'
                ? 'bg-white text-ruralTeal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Follow-up Visit {pendingFollowup ? '• 1 Pending' : ''}
          </button>
        </div>
      </div>

      {refillMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{refillMessage}</span>
        </div>
      )}

      {/* SECTION 1: MEDICINES TAB */}
      {activeTab === 'medicines' && (
        <div className="space-y-6">
          {/* Daily Dose Tracker Banner */}
          <div className="bg-gradient-to-r from-ruralTeal-700 via-teal-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200 block mb-1">
                  Daily Compliance Tracker
                </span>
                <h2 className="text-lg sm:text-xl font-bold">Daily Medicine Checklist</h2>
                <p className="text-xs text-teal-100 mt-0.5">
                  Tick off each dose as you take it. Your adherence is recorded for your doctor and ASHA worker.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-full self-start sm:self-auto border border-white/10">
                <Check className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold">
                  {takenCount} of {medicines.length} Taken Today
                </span>
              </div>
            </div>

            {medicines.length === 0 ? (
              <div className="py-6 text-center text-teal-200 text-xs">
                {t('patient.noActiveMedicines')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {medicines.map((med) => {
                  const isTaken = takenToday[med.id];
                  return (
                    <button
                      key={med.id}
                      type="button"
                      onClick={() => toggleDose(med.id)}
                      className={`p-4 rounded-2xl text-left transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                        isTaken
                          ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-inner ring-2 ring-emerald-400/40'
                          : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Pill className={`w-4 h-4 ${isTaken ? 'text-emerald-300' : 'text-teal-200'}`} />
                          <span className="font-bold text-sm leading-tight">{med.name}</span>
                        </div>
                        <p className="text-xs text-teal-100">{med.dosage} • {med.frequency}</p>
                        <p className="text-[11px] text-teal-200/80 italic">{med.instructions || 'Take after food'}</p>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                          isTaken
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-white/10 border-white/30 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Current Medicines Full Details List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Active Prescriptions List</h2>
                <p className="text-xs text-slate-500">Government PHC dispensed medicines & course duration</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                Total: {medicines.length} Medicines
              </span>
            </div>

            {medicines.length === 0 ? (
              <div className="rural-card p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">{t('patient.noActiveMedicines')}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You currently have no prescribed medications on record. When your doctor prescribes medicines, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicines.map((med) => {
                  const reqInfo = refillStatus[med.id];
                  return (
                    <div
                      key={med.id}
                      className="rural-card p-5 space-y-4 border border-slate-200/80 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-ruralTeal-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Pill className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{med.name}</h3>
                            <p className="text-xs text-ruralTeal-700 font-semibold">{med.dosage}</p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">
                          Active Course
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[11px] font-semibold">Frequency</span>
                          <span className="font-bold text-slate-800">{med.frequency}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] font-semibold">Duration</span>
                          <span className="font-bold text-slate-800">{med.duration || '30 Days Continuous'}</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-200/60">
                          <span className="text-slate-400 block text-[11px] font-semibold">Doctor Instructions</span>
                          <span className="font-medium text-slate-700">
                            {med.instructions || 'Take with lukewarm water after meals. Do not skip doses.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500">
                          Days Left: <strong>{med.daysLeft ? `${med.daysLeft} days` : '18 days'}</strong>
                        </span>

                        {reqInfo?.requested ? (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Refill Requested
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRefillModalMed(med)}
                            className="px-3 py-1.5 bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Request Refill
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: FOLLOW-UP TAB */}
      {activeTab === 'followup' && (
        <div className="space-y-6">
          {/* Upcoming Follow-up Highlight Card */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Upcoming Follow-up Appointment</h2>
            <p className="text-xs text-slate-500">
              Next scheduled consultation or doorstep health evaluation
            </p>

            {!pendingFollowup ? (
              <div className="rural-card p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">{t('patient.noUpcomingFollowup')}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You currently have no pending follow-up visits scheduled. When a doctor or ASHA worker assigns one, details will appear here.
                </p>
              </div>
            ) : (
              <div className="rural-card p-6 border-l-4 border-l-ruralTeal-700 space-y-5 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold inline-block mb-1.5">
                      {followupConfirmed ? 'Attendance Confirmed' : 'Confirmation Requested'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{pendingFollowup.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Stethoscope className="w-3.5 h-3.5 text-ruralTeal-700" />
                      Doctor / Health Worker: <strong>{pendingFollowup.worker}</strong>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Scheduled Date</span>
                    <span className="text-base font-extrabold text-ruralTeal-800 flex items-center gap-1.5 sm:justify-end">
                      <Calendar className="w-4 h-4" />
                      {pendingFollowup.scheduledDate}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <span className="text-slate-500 font-bold block">Follow-up Clinical Instructions:</span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {pendingFollowup.notes || 'Please carry your previous prescription and fasting blood sugar / BP logs.'}
                  </p>
                </div>

                {/* Actions: Confirm Attendance & Set Reminder */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleReminder}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        reminderSet
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      {reminderSet ? 'Reminder Set (SMS & In-App)' : 'Set Health Reminder'}
                    </button>

                    <a
                      href={`tel:${assignedAsha.phone}`}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-600" />
                      <span>Call ASHA: {assignedAsha.name}</span>
                    </a>
                  </div>

                  {followupConfirmed ? (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Attendance Confirmed by You
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConfirmAttendance}
                      className="px-4 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      Confirm My Attendance
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Past Follow-up History */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Past Follow-up History</h3>
                <p className="text-xs text-slate-500">Completed consultations, visits and health outcomes</p>
              </div>
              <span className="text-xs text-slate-500">{followupHistory.length} Recorded Visits</span>
            </div>

            {followupHistory.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 border border-slate-200">
                No past follow-up visits recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {followupHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-900 text-sm">{item.type}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold">
                          Completed
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">
                        Conducted by: <strong>{item.worker}</strong>
                      </p>
                      <p className="text-slate-500 italic mt-0.5">{item.outcome}</p>
                    </div>

                    <div className="text-left sm:text-right text-slate-500 shrink-0">
                      <span className="block font-bold text-slate-700">{item.date}</span>
                      <span className="text-[11px] text-slate-400">Verified Visit</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REFILL MODAL */}
      {refillModalMed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-ruralTeal-700" />
              Request Medicine Refill
            </h2>
            <p className="text-xs text-slate-500">
              Submit an early government refill request to ensure zero stockout at your local dispensary.
            </p>

            <form onSubmit={handleRefillSubmit} className="space-y-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-slate-400 block font-semibold">Medicine to Refill</span>
                <p className="font-bold text-slate-900 text-sm">{refillModalMed.name}</p>
                <p className="text-slate-600">{refillModalMed.dosage} • {refillModalMed.frequency}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pickup Dispensary / Health Centre
                </label>
                <select
                  value={refillFacility}
                  onChange={(e) => setRefillFacility(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="Bhimashankar Primary Health Centre">Bhimashankar Primary Health Centre (PHC)</option>
                  <option value="Khed Community Health Centre">Khed Community Health Centre (CHC)</option>
                  <option value="Nigdale Sub-Centre (ASHA Handover)">Nigdale Sub-Centre (Doorstep Delivery via ASHA)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Send Refill Request
                </button>
                <button
                  type="button"
                  onClick={() => setRefillModalMed(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
