import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  ChevronLeft,
  Calendar,
  User,
  MapPin,
  X,
  Send,
  Building2
} from 'lucide-react';

export default function DoctorFollowupsPage() {
  const { t } = useTranslation();
  const [followups, setFollowups] = useState(MOCK_DOCTOR_DATA.followupsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Add form state
  const [newFollowup, setNewFollowup] = useState({
    patientName: '',
    dueDate: 'Tomorrow Morning',
    task: '',
    notes: '',
    priority: 'HIGH',
    assignedAsha: 'Sunita Tai'
  });

  const filteredFollowups = followups.filter((f) => {
    const matchesPriority =
      filterPriority === 'ALL' || f.priority === filterPriority;
    const matchesSearch =
      f.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const toggleStatus = (id) => {
    setFollowups(
      followups.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : f
      )
    );
  };

  const handleCreateFollowup = (e) => {
    e.preventDefault();
    if (!newFollowup.patientName || !newFollowup.task) return;

    const item = {
      id: `fup-doc-${Date.now()}`,
      patientName: newFollowup.patientName,
      dueDate: newFollowup.dueDate,
      task: newFollowup.task,
      notes: newFollowup.notes,
      priority: newFollowup.priority,
      status: 'PENDING',
      assignedAsha: newFollowup.assignedAsha
    };

    setFollowups([item, ...followups]);
    setShowAddModal(false);
    setFeedback(`Follow-up task assigned to ${newFollowup.assignedAsha} and synced!`);
    setTimeout(() => setFeedback(''), 4000);

    setNewFollowup({
      patientName: '',
      dueDate: 'Tomorrow Morning',
      task: '',
      notes: '',
      priority: 'HIGH',
      assignedAsha: 'Sunita Tai'
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
            <span className="text-slate-700 font-semibold">{t('doctor.followups', 'Follow-ups')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary-600" />
            Clinical Follow-up & ASHA Coordination
          </h1>
          <p className="text-slate-600 mt-1">
            Monitor chronic patient progression, maternal vitals re-checks, and assign doorstep verification tasks.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-700 text-white font-bold shadow-lg shadow-primary-600/20 hover:from-primary-700 hover:to-teal-800 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          Schedule Follow-up
        </button>
      </div>

      {/* Success notification */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{feedback}</p>
        </div>
      )}

      {/* 2. Search & Priority Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, task, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterPriority('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterPriority === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({followups.length})
          </button>
          <button
            onClick={() => setFilterPriority('RED')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterPriority === 'RED'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            Red Urgent ({followups.filter((f) => f.priority === 'RED').length})
          </button>
          <button
            onClick={() => setFilterPriority('HIGH')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterPriority === 'HIGH'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            High Orange ({followups.filter((f) => f.priority === 'HIGH').length})
          </button>
          <button
            onClick={() => setFilterPriority('MODERATE')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterPriority === 'MODERATE'
                ? 'bg-yellow-500 text-slate-900 shadow-sm'
                : 'text-yellow-800 hover:bg-yellow-50'
            }`}
          >
            Moderate ({followups.filter((f) => f.priority === 'MODERATE').length})
          </button>
        </div>
      </div>

      {/* 3. Follow-up Cards */}
      <div className="space-y-4">
        {filteredFollowups.map((f) => {
          const isCompleted = f.status === 'COMPLETED';
          const isRed = f.priority === 'RED';
          const isHigh = f.priority === 'HIGH';

          return (
            <div
              key={f.id}
              className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-slate-50/60 border-slate-200 opacity-80'
                  : isRed
                  ? 'bg-rose-50/30 border-rose-200'
                  : isHigh
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      isRed
                        ? 'bg-red-600 text-white'
                        : isHigh
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-600 text-white'
                    }`}
                  >
                    {f.priority}
                  </span>

                  <h3 className={`text-base font-bold text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                    {f.patientName}
                  </h3>

                  <span className="text-xs text-slate-500">• Due: <strong>{f.dueDate}</strong></span>
                </div>

                <p className="text-sm font-bold text-slate-800">{f.task}</p>
                <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                  {f.notes}
                </p>

                <p className="text-[11px] text-slate-500">
                  Assigned Frontline Worker: <strong>{f.assignedAsha}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => toggleStatus(f.id)}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                    isCompleted
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCompleted ? 'Mark Pending' : 'Mark Completed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Add Follow-up Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  New Patient Care Directive
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">Schedule Follow-up Task</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tukaram Patil"
                  value={newFollowup.patientName}
                  onChange={(e) => setNewFollowup({ ...newFollowup, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={newFollowup.priority}
                    onChange={(e) => setNewFollowup({ ...newFollowup, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="RED">RED - Urgent 24h</option>
                    <option value="HIGH">HIGH - 48h Follow-up</option>
                    <option value="MODERATE">MODERATE - Weekly</option>
                    <option value="ROUTINE">ROUTINE - Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Due Date / Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 19 Sep 2026, 10:00 AM"
                    value={newFollowup.dueDate}
                    onChange={(e) => setNewFollowup({ ...newFollowup, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Follow-up Clinical Task *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Repeat blood pressure check and inspect foot ulcer"
                  value={newFollowup.task}
                  onChange={(e) => setNewFollowup({ ...newFollowup, task: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Instructions & Target Parameters
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Notify MO if Systolic BP remains > 140 mmHg."
                  value={newFollowup.notes}
                  onChange={(e) => setNewFollowup({ ...newFollowup, notes: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Frontline ASHA Worker
                </label>
                <input
                  type="text"
                  value={newFollowup.assignedAsha}
                  onChange={(e) => setNewFollowup({ ...newFollowup, assignedAsha: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-lg shadow-primary-600/20 min-h-[48px]"
                >
                  Assign & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
