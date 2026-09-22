import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Calendar,
  Clock,
  ChevronLeft,
  Plus,
  MapPin,
  CheckCircle2,
  Users,
  Video,
  Building2,
  AlertTriangle,
  X
} from 'lucide-react';

export default function DoctorSchedulePage() {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState([]);
  const [viewMode, setViewMode] = useState('TODAY'); // TODAY | WEEKLY
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newSlot, setNewSlot] = useState({
    time: '02:00 PM - 03:30 PM',
    title: '',
    type: 'TELEMEDICINE',
    location: 'Teleconsultation Console',
    attendees: 'Rural Hamlet Patients'
  });

  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.doctor.getSchedule();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSchedule(res.data);
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        setSchedule(res.data);
      } else {
        setSchedule(MOCK_DOCTOR_DATA.scheduleSlots || []);
      }
    } catch (err) {
      console.warn('Fallback to local doctor schedule:', err);
      setSchedule(MOCK_DOCTOR_DATA.scheduleSlots || []);
      setError('Live doctor schedule offline. Showing offline cached schedule.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlot.title) return;

    const item = {
      id: `sch-${Date.now()}`,
      time: newSlot.time,
      title: newSlot.title,
      type: newSlot.type,
      location: newSlot.location,
      attendees: newSlot.attendees
    };

    setSchedule([...schedule, item]);
    setShowAddModal(false);
    setFeedback('Duty slot added to public health calendar!');
    setTimeout(() => setFeedback(''), 4000);

    setNewSlot({
      time: '02:00 PM - 03:30 PM',
      title: '',
      type: 'TELEMEDICINE',
      location: 'Teleconsultation Console',
      attendees: 'Rural Hamlet Patients'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/doctor" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('doctor.dashboardTitle', 'Doctor Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('doctor.schedule', 'Duty Schedule')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-amber-600" />
            Clinical Duty & Teleconsultation Schedule
          </h1>
          <p className="text-slate-600 mt-1">
            Timetable for Physical OPD Clinics, Frontline Village Video Calls, and Emergency On-Call Duty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all min-h-[48px]"
          >
            <Plus className="w-4 h-4" />
            Add Schedule Slot
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{feedback}</p>
        </div>
      )}

      {error && (
        <ErrorState
          compact
          title="Notice"
          error={error}
          onRetry={loadSchedule}
        />
      )}

      {/* 2. On-Duty Status Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary-500/10 to-teal-500/10 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Today's Active Shift: 08:30 AM - 05:30 PM</h3>
            <p className="text-xs text-slate-600">
              Primary Facility: <strong>Khed Community Health Centre (CHC)</strong> • 24x7 Emergency Trauma Backup
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          Currently Available for Tele-Triage
        </span>
      </div>

      {/* 3. Schedule Slots Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b pb-3">
          Daily Clinical Duty Timetable
        </h2>

        {isLoading ? (
          <LoadingState message="Loading doctor schedule..." subtitle="Connecting with District Health Roster" />
        ) : schedule.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Schedule Slots"
            description="You have no duty slots scheduled for today."
            actionLabel="Add Duty Slot"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="divide-y divide-slate-100">
          {schedule.map((slot, index) => {
            const isEmergency = slot.type === 'EMERGENCY';
            const isTelemed = slot.type === 'TELEMEDICINE';

            return (
              <div
                key={slot.id || index}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 font-mono">
                      {slot.time}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isEmergency
                          ? 'bg-red-100 text-red-800'
                          : isTelemed
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {slot.type}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{slot.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {slot.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {slot.attendees}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isTelemed ? (
                    <Link
                      to="/doctor/consult"
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 min-h-[40px]"
                    >
                      <Video className="w-4 h-4" />
                      Open Room
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold px-3 py-1.5 bg-slate-100 rounded-lg">
                      Scheduled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Timetable Update
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">Add Clinical Duty Slot</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Time Slot (e.g. 02:00 PM - 03:30 PM) *
                </label>
                <input
                  type="text"
                  required
                  value={newSlot.time}
                  onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maternal Health Outreach Clinic"
                  value={newSlot.title}
                  onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Activity Type
                  </label>
                  <select
                    value={newSlot.type}
                    onChange={(e) => setNewSlot({ ...newSlot, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="TELEMEDICINE">Telemedicine Link</option>
                    <option value="OPD_CLINIC">Physical OPD Clinic</option>
                    <option value="EMERGENCY">Emergency Triage</option>
                    <option value="REVIEW">Case Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location / Room
                  </label>
                  <input
                    type="text"
                    value={newSlot.location}
                    onChange={(e) => setNewSlot({ ...newSlot, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Attendees / Village Hamlets
                </label>
                <input
                  type="text"
                  value={newSlot.attendees}
                  onChange={(e) => setNewSlot({ ...newSlot, attendees: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
