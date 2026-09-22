import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  Briefcase,
  Camera,
  Search,
  ChevronLeft,
  Filter,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  FileText,
  Send,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';

export default function DoctorStoreForwardPage() {
  const { t } = useTranslation();
  const [cases, setCases] = useState(MOCK_DOCTOR_DATA.storeAndForwardCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  const filteredCases = cases.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ashaName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenReview = (c) => {
    setSelectedCase(c);
    setFeedbackText(c.doctorNotesDraft || '');
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    setCases(
      cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, status: 'Doctor Reviewed', doctorNotesDraft: feedbackText }
          : c
      )
    );

    setAlertMsg(`Asynchronous review and e-prescription dispatched for ${selectedCase.patientName}!`);
    setTimeout(() => setAlertMsg(''), 4000);
    setSelectedCase(null);
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
            <span className="text-slate-700 font-semibold">{t('doctor.storeAndForward', 'Store-and-Forward')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-600" />
            Store-and-Forward Clinical Inbox
          </h1>
          <p className="text-slate-600 mt-1">
            Asynchronous triage cases submitted by field health workers from low-connectivity hamlets for doctor assessment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
            {cases.filter((c) => c.status !== 'Doctor Reviewed').length} Cases Awaiting Review
          </span>
        </div>
      </div>

      {/* Alert message */}
      {alertMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{alertMsg}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases by patient, symptom, condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCases.map((c) => {
          const isUrgent = c.urgency === 'RED';
          const isReviewed = c.status === 'Doctor Reviewed';

          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                isUrgent
                  ? 'bg-rose-50/30 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      isUrgent
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {c.urgency} PRIORITY
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isReviewed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{c.title}</h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 my-1.5">
                  <span className="font-semibold text-slate-800">Patient: {c.patientName} ({c.age}y)</span>
                  <span>•</span>
                  <span>{c.village}</span>
                  <span>•</span>
                  <span>{c.date}</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                  <strong>Clinical Symptoms:</strong> {c.symptoms}
                </p>

                {/* Doctor notes if already reviewed */}
                {c.doctorNotesDraft && (
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1">
                    <span className="font-bold text-teal-900 block">Doctor Advice & Guidance:</span>
                    <p className="text-teal-950 font-medium">{c.doctorNotesDraft}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Submitted by: <strong>{c.ashaName}</strong></span>

                <button
                  onClick={() => handleOpenReview(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 ${
                    isReviewed
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isReviewed ? 'Update Review' : 'Review & Respond'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  Store-and-Forward Case Review
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedCase.patientName} • {selectedCase.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Submitting Health Worker:</span>
                <span className="font-bold text-slate-900">{selectedCase.ashaName}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Village / Hamlet:</span>
                <span className="font-semibold text-slate-800">{selectedCase.village}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Reported Symptoms:</span>
                <p className="p-2.5 bg-white rounded-lg border font-medium text-slate-800">
                  {selectedCase.symptoms}
                </p>
              </div>
            </div>

            {/* Response Drafting */}
            <form onSubmit={handleSaveReview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Doctor Clinical Guidance, Management & e-Rx *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter diagnosis, prescribed medications, precautions, and whether hospital referral is advised."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-700 text-white text-xs font-bold shadow-lg shadow-primary-600/20 hover:from-primary-700 hover:to-teal-800 min-h-[48px] flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Guidance to ASHA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
