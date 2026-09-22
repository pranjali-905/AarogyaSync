import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  Building2,
  Ambulance,
  PhoneCall,
  Search,
  ChevronLeft,
  Printer,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  X,
  FileText
} from 'lucide-react';

export default function DoctorReferralsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const patientIdQuery = searchParams.get('patientId');

  const { referralsList, patientsList, doctor } = MOCK_DOCTOR_DATA;
  const [referrals, setReferrals] = useState(referralsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedRef, setSelectedRef] = useState(null);
  const [feedback, setFeedback] = useState('');

  const initialPatient = patientsList.find((p) => p.id === patientIdQuery);

  // New referral form state
  const [formData, setFormData] = useState({
    patientName: initialPatient?.fullName || '',
    referredToFacility: 'Manchar Sub-District Hospital (Specialist Obs/Gyn Unit)',
    attendingSpecialist: 'Dr. S. Deshmukh (MCH Specialist)',
    reason: '',
    priority: 'RED',
    transport: '102 Janani Shishu Vahan Dispatched with Oxygen & Suction kit'
  });

  const filteredReferrals = referrals.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.referredToFacility.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      r.transport.toLowerCase().includes(q)
    );
  });

  const handleCreateReferral = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.reason) return;

    const newRef = {
      id: `ref-doc-${Date.now()}`,
      patientName: formData.patientName,
      patientId: 'p-custom',
      age: 25,
      referredToFacility: formData.referredToFacility,
      referringDoctor: doctor.fullName,
      attendingSpecialist: formData.attendingSpecialist,
      reason: formData.reason,
      priority: formData.priority,
      transport: formData.transport,
      date: new Date().toISOString().split('T')[0],
      status: 'IN_TRANSIT',
      dispatchTime: 'Just Now'
    };

    setReferrals([newRef, ...referrals]);
    setShowNewModal(false);
    setFeedback(`Hospital referral created and emergency transport alerted!`);
    setTimeout(() => setFeedback(''), 4000);

    setFormData({
      patientName: '',
      referredToFacility: 'Manchar Sub-District Hospital (Specialist Obs/Gyn Unit)',
      attendingSpecialist: 'Dr. S. Deshmukh (MCH Specialist)',
      reason: '',
      priority: 'RED',
      transport: '102 Janani Shishu Vahan Dispatched with Oxygen & Suction kit'
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
            <span className="text-slate-700 font-semibold">{t('doctor.referrals', 'Hospital Referrals')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-rose-600" />
            Hospital Referrals & Emergency Dispatch
          </h1>
          <p className="text-slate-600 mt-1">
            Coordinate secondary/tertiary hospital transfers, 108 ambulance dispatch, and generate emergency transfer slips.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold shadow-lg shadow-red-600/20 hover:from-red-700 hover:to-rose-800 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          Create Hospital Referral
        </button>
      </div>

      {/* Success Notification */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{feedback}</p>
        </div>
      )}

      {/* 2. Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Urgent Red Transfers</p>
            <p className="text-2xl font-black text-red-600">
              {referrals.filter((r) => r.priority === 'RED').length}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Ambulances Dispatched</p>
            <p className="text-2xl font-black text-amber-600">
              {referrals.filter((r) => r.status.includes('TRANSIT') || r.status.includes('DISPATCHED')).length}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Facility Transfers</p>
            <p className="text-2xl font-black text-slate-900">
              {referrals.length}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search referrals by patient, hospital, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>
      </div>

      {/* 4. Referrals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReferrals.map((r) => {
          const isRed = r.priority === 'RED';

          return (
            <div
              key={r.id}
              className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                isRed
                  ? 'bg-rose-50/30 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      isRed ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {r.priority} PRIORITY
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {r.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{r.patientName}</h3>
                <p className="text-xs text-slate-500 mb-2">
                  Referred To: <strong>{r.referredToFacility}</strong>
                </p>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-semibold mb-3">
                  {r.reason}
                </p>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Ambulance className="w-3.5 h-3.5 text-amber-600" />
                    <span>Transport: <strong>{r.transport}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dispatch Time: {r.dispatchTime} ({r.date})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedRef(r)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold min-h-[40px]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Referral Slip
                </button>

                <a
                  href="tel:108"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold min-h-[40px]"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call 108 / 102
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slip Modal */}
      {selectedRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Emergency Medical Referral Slip
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{selectedRef.patientName}</h3>
              </div>
              <button
                onClick={() => setSelectedRef(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Destination Hospital:</span>
                <span className="font-bold text-slate-900">{selectedRef.referredToFacility}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Referring Medical Officer:</span>
                <span className="font-bold text-slate-900">{selectedRef.referringDoctor}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Transport:</span>
                <span className="font-semibold text-slate-800">{selectedRef.transport}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Clinical Indication:</span>
                <p className="p-2 bg-white rounded-lg border font-medium text-slate-800">
                  {selectedRef.reason}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 min-h-[48px] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Transfer Slip
              </button>
              <button
                onClick={() => setSelectedRef(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 min-h-[48px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Referral Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Emergency Medical Dispatch
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">Create Hospital Referral</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meena Waghmare"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="RED">RED - Immediate Emergency</option>
                    <option value="HIGH">HIGH - Urgent Specialist Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Destination Facility *
                  </label>
                  <select
                    value={formData.referredToFacility}
                    onChange={(e) => setFormData({ ...formData, referredToFacility: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Manchar Sub-District Hospital (Specialist Obs/Gyn Unit)">Manchar SDH (Obs/Gyn & NICU)</option>
                    <option value="Khed Community Health Centre (Emergency Trauma)">Khed CHC (Trauma & Surgery)</option>
                    <option value="Sassoon General Hospital, Pune (Tertiary Care)">Sassoon Hospital Pune (Tertiary)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Clinical Indication / Diagnosis *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Severe Pre-eclampsia in 34th Week with BP 150/98 mmHg. Requires operative delivery & NICU."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ambulance Transport Mode
                </label>
                <select
                  value={formData.transport}
                  onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="102 Janani Shishu Vahan Dispatched with Oxygen & Suction kit">102 Janani Shishu Vahan (Maternal Free)</option>
                  <option value="108 Emergency Ambulance Dispatched">108 Emergency Ambulance (ALS/BLS)</option>
                  <option value="Hospital Ambulance / Shared Vehicle">Hospital Shared Vehicle</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-3 rounded-xl border text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
                >
                  Dispatch Emergency Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
