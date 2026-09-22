import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_ASHA_DATA } from '../../services/mockData';
import {
  Calendar,
  ArrowLeft,
  Check,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function AshaVisitsPage() {
  const { t } = useTranslation();
  const [visits, setVisits] = useState(MOCK_ASHA_DATA.villageVisitsToday);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVisit, setNewVisit] = useState({
    household: '',
    person: '',
    reason: '',
    time: '02:00 PM',
    notes: ''
  });

  const toggleStatus = (id) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: v.status === 'Completed' ? 'Pending' : 'Completed' } : v
      )
    );
  };

  const handleAddVisit = (e) => {
    e.preventDefault();
    if (!newVisit.household || !newVisit.reason) return;

    setVisits([
      ...visits,
      {
        id: `v-${Date.now()}`,
        household: newVisit.household,
        person: newVisit.person || 'Household Head',
        reason: newVisit.reason,
        time: newVisit.time,
        notes: newVisit.notes,
        status: 'Pending'
      }
    ]);

    setNewVisit({ household: '', person: '', reason: '', time: '02:00 PM', notes: '' });
    setShowAddModal(false);
  };

  const filteredVisits = visits.filter((v) => {
    if (filterStatus === 'ALL') return true;
    return v.status === filterStatus;
  });

  const completedCount = visits.filter((v) => v.status === 'Completed').length;

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
              <Calendar className="w-6 h-6 text-ruralTeal-700" />
              {t('asha.scheduledVisits', "Today's Village Visits")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('asha.todayVisitsDesc', 'Household survey plan & doorstep health visits')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ {t('asha.addVisit', 'Add Visit')}</span>
        </button>
      </div>

      {/* Progress overview */}
      <div className="bg-gradient-to-r from-ruralTeal-800 to-teal-900 text-white p-5 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-200 uppercase tracking-wider block">
            {t('asha.todaysProgress', "Today's Progress")}
          </span>
          <h2 className="text-xl font-bold mt-0.5">
            {t('asha.householdsSurveyed', '{completed} of {total} Households Surveyed', { completed: completedCount, total: visits.length })}
          </h2>
          <p className="text-xs text-teal-100/90 mt-0.5">
            {visits.length - completedCount === 0
              ? t('asha.allVisitsCompleted', 'All daily doorstep visits completed!')
              : t('asha.visitsRemaining', '{count} visits remaining today.', { count: visits.length - completedCount })}
          </p>
        </div>

        <div className="w-full sm:w-48 bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-emerald-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${visits.length > 0 ? (completedCount / visits.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'Pending', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === st
                ? 'bg-ruralTeal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL'
              ? t('asha.allVisitsCount', 'All Visits ({count})', { count: visits.length })
              : st === 'Completed'
              ? t('common.completed', 'Completed')
              : t('common.pending', 'Pending')}
          </button>
        ))}
      </div>

      {/* Visits Checklist List */}
      <div className="space-y-3">
        {filteredVisits.map((v) => {
          const isDone = v.status === 'Completed';
          return (
            <div
              key={v.id}
              onClick={() => toggleStatus(v.id)}
              className={`rural-card p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all border ${
                isDone
                  ? 'bg-slate-50/80 border-slate-200 opacity-80'
                  : 'bg-white border-slate-200 hover:border-ruralTeal-500 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 transition-colors ${
                    isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isDone && <Check className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {v.household}
                    </h3>
                    {v.person && (
                      <span className="text-xs text-slate-500">({v.person})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{v.reason}</p>
                  {v.notes && <p className="text-[11px] text-slate-400">{t('common.note', 'Note:')} {v.notes}</p>}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isDone ? t('common.completed', 'Completed') : t('common.pending', 'Pending')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">{v.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Visit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add Household Survey Visit</h3>
            <form onSubmit={handleAddVisit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Household / Family Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House #72 (Shinde Family)"
                  value={newVisit.household}
                  onChange={(e) => setNewVisit({ ...newVisit, household: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Anandi Shinde"
                  value={newVisit.person}
                  onChange={(e) => setNewVisit({ ...newVisit, person: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Newborn immunization check & breastfeeding advice"
                  value={newVisit.reason}
                  onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Scheduled Time</label>
                <input
                  type="text"
                  value={newVisit.time}
                  onChange={(e) => setNewVisit({ ...newVisit, time: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold"
                >
                  Add Visit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
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
