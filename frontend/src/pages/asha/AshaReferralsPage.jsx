import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { apiService } from '../../services/apiService';
import { MOCK_ASHA_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Building2,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  PhoneCall,
  Ambulance,
  FileText,
  User,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  X,
  Printer
} from 'lucide-react';

export default function AshaReferralsPage() {
  const { t } = useTranslation();
  const { isOnline, queueRecord } = useOffline();

  const [referrals, setReferrals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for new referral
  const [formData, setFormData] = useState({
    patientName: '',
    referralTo: 'Dr. Sunita Deshmukh (MCH Officer)',
    facility: 'Bhimashankar PHC',
    reason: '',
    priority: 'RED',
    transport: '102 Janani Shishu Vahan Dispatched',
    notes: ''
  });
  const [submittedMessage, setSubmittedMessage] = useState('');

  const normalizeReferral = (r) => ({
    id: r.id,
    patientName: r.patient_name || r.patientName || 'Rural Citizen',
    referralTo: r.referral_to || r.referralTo || 'Dr. Sunita Deshmukh (MCH Officer)',
    facility: r.to_facility_name || r.facility || 'Bhimashankar PHC',
    reason: r.reason_for_referral || r.reason || 'Urgent specialist assessment required',
    priority: (r.priority || 'RED').toUpperCase(),
    transport: r.transport || (r.transport_required ? '108 Ambulance Dispatched' : 'Self / Family Transit'),
    date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : (r.date || new Date().toISOString().split('T')[0]),
    status: r.status || 'IN_TRANSIT',
    notes: r.clinical_notes || r.notes || ''
  });

  const loadReferrals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.referrals.getAll();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setReferrals(res.data.map(normalizeReferral));
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        setReferrals(res.data.map(normalizeReferral));
      } else {
        setReferrals((MOCK_ASHA_DATA.referralsList || []).map(normalizeReferral));
      }
    } catch (err) {
      console.warn('Fallback to local referrals list:', err);
      setReferrals((MOCK_ASHA_DATA.referralsList || []).map(normalizeReferral));
      setError('Live referral system offline. Showing offline cached referrals.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferrals();
  }, [loadReferrals]);

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.reason) return;

    const newRef = {
      id: `ref-${Date.now()}`,
      patientName: formData.patientName,
      referralTo: formData.referralTo,
      facility: formData.facility,
      reason: formData.reason,
      priority: formData.priority,
      transport: formData.transport,
      date: new Date().toISOString().split('T')[0],
      status: 'IN_TRANSIT',
      notes: formData.notes
    };

    // Attempt live API creation
    try {
      await apiService.referrals.create({
        patientName: formData.patientName,
        facility: formData.facility,
        reason: formData.reason,
        priority: formData.priority,
        transport: formData.transport,
        notes: formData.notes
      });
    } catch (err) {
      console.warn('Fallback to local queue for referral:', err);
    }

    // Queue in offline storage
    await queueRecord('DOCTOR_REFERRAL', newRef);

    setReferrals([newRef, ...referrals]);
    setShowModal(false);
    setSubmittedMessage('Referral created and queued for emergency medical coordination!');
    setTimeout(() => setSubmittedMessage(''), 4000);

    // Reset
    setFormData({
      patientName: '',
      referralTo: 'Dr. Sunita Deshmukh (MCH Officer)',
      facility: 'Bhimashankar PHC',
      reason: '',
      priority: 'RED',
      transport: '102 Janani Shishu Vahan Dispatched',
      notes: ''
    });
  };

  const filteredReferrals = referrals.filter((r) => {
    if (filterPriority === 'ALL') return true;
    return r.priority === filterPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/asha" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('asha.dashboardTitle', 'ASHA Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('asha.referralsTitle', 'Doctor Referrals')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary-600" />
            {t('asha.referralsTitle', 'Doctor Referral Management')}
          </h1>
          <p className="text-slate-600 mt-1">
            Facilitate rapid hospital transfers, track 102/108 ambulance dispatch, and notify PHC Medical Officers.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold shadow-lg shadow-red-600/20 hover:from-red-700 hover:to-rose-800 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          Create Doctor Referral
        </button>
      </div>

      {/* Success Notification */}
      {submittedMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <p className="font-medium text-sm">{submittedMessage}</p>
        </div>
      )}

      {error && (
        <ErrorState
          compact
          title="Notice"
          error={error}
          onRetry={loadReferrals}
        />
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgent Red Cases</p>
            <p className="text-2xl font-black text-red-600">
              {referrals.filter((r) => r.priority === 'RED').length}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Transit / Transport</p>
            <p className="text-2xl font-black text-amber-600">
              {referrals.filter((r) => r.status === 'IN_TRANSIT').length}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reviewed / Transferred</p>
            <p className="text-2xl font-black text-emerald-700">
              {referrals.filter((r) => r.status === 'REVIEWED' || r.status === 'TRANSFERRED').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterPriority('ALL')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            filterPriority === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Referrals ({referrals.length})
        </button>
        <button
          onClick={() => setFilterPriority('RED')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all min-h-[44px] flex items-center gap-1.5 ${
            filterPriority === 'RED'
              ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
              : 'text-red-700 hover:bg-red-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-400" />
          Urgent Red ({referrals.filter((r) => r.priority === 'RED').length})
        </button>
        <button
          onClick={() => setFilterPriority('YELLOW')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all min-h-[44px] flex items-center gap-1.5 ${
            filterPriority === 'YELLOW'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          High Yellow ({referrals.filter((r) => r.priority === 'YELLOW').length})
        </button>
      </div>

      {/* Referrals Cards Grid */}
      {isLoading ? (
        <LoadingState message="Loading inter-facility referrals..." subtitle="Connecting with district emergency network" />
      ) : filteredReferrals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Referrals Found"
          description="There are currently no active patient hospital referrals in this category."
          actionLabel="Create Doctor Referral"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReferrals.map((referral) => {
            const isRed = referral.priority === 'RED';
            return (
              <div
                key={referral.id}
                className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                  isRed
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-amber-50/30 border-amber-200'
                }`}
              >
                {/* Header: Priority & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isRed
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {isRed ? 'URGENT RED TRANSFER' : 'YELLOW SPECIALIST REFERRAL'}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      referral.status === 'IN_TRANSIT'
                        ? 'bg-blue-100 text-blue-800'
                        : referral.status === 'TRANSFERRED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {referral.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Patient Name */}
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-slate-500" />
                  <h3 className="text-lg font-bold text-slate-900">{referral.patientName}</h3>
                  <span className="text-xs text-slate-500">• {referral.date}</span>
                </div>

                {/* Reason */}
                <p className="text-sm font-semibold text-slate-800 bg-white/80 p-2.5 rounded-xl border border-slate-200 mb-3">
                  {referral.reason}
                </p>

                {/* Facility & Doctor Info */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-white/60 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span>
                      <strong>Referred To:</strong> {referral.referralTo} ({referral.facility})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ambulance className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      <strong>Transport Mode:</strong> {referral.transport}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setSelectedReferral(referral)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[44px] cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    Referral Slip
                  </button>
                  <a
                    href="tel:108"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 min-h-[44px]"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call 108 / 102
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slip Preview Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  Emergency Medical Referral Slip
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedReferral.patientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReferral(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Referral ID:</span>
                <span className="font-mono font-bold">{selectedReferral.id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Target Facility:</span>
                <span className="font-semibold text-slate-800">{selectedReferral.facility}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Attending MO:</span>
                <span className="font-semibold text-slate-800">{selectedReferral.referralTo}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Urgency Level:</span>
                <span className="font-bold text-red-600">{selectedReferral.priority}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Clinical Indication:</span>
                <p className="font-medium text-slate-800 bg-white p-2.5 rounded-lg border">
                  {selectedReferral.reason}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold min-h-[48px]"
              >
                <Printer className="w-4 h-4" />
                Print / Share Slip
              </button>
              <button
                onClick={() => setSelectedReferral(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 min-h-[48px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Referral Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">New Doctor Referral</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Escalate high-risk patient to Medical Officer with ambulance arrangement
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Meena Waghmare"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Urgency Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                  >
                    <option value="RED">RED - Immediate Hospitalization</option>
                    <option value="YELLOW">YELLOW - Specialist Consult (24h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Facility *
                  </label>
                  <select
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                  >
                    <option value="Bhimashankar PHC">Bhimashankar PHC (Primary)</option>
                    <option value="Khed CHC">Khed CHC (Community Centre)</option>
                    <option value="Manchar Sub-District Hospital">Manchar SDH (Trauma/Specialist)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Attending Medical Officer
                </label>
                <input
                  type="text"
                  value={formData.referralTo}
                  onChange={(e) => setFormData({ ...formData, referralTo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Clinical Indication / Reason for Referral *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g., Severe pre-eclampsia warning signs, BP 145/95, persistent headache."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Transport Vehicle / Dispatch Status
                </label>
                <select
                  value={formData.transport}
                  onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                >
                  <option value="102 Janani Shishu Vahan Dispatched">102 Janani Shishu Vahan (Maternal Free Transit)</option>
                  <option value="108 Emergency Ambulance Dispatched">108 Emergency Ambulance (Critical / Trauma)</option>
                  <option value="PHC Jeep / Local Transport Arranged">PHC Jeep / Village Shared Transport</option>
                  <option value="Patient Family Accompanying OPD">Self / Family Transport to OPD</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-sm font-bold shadow-md shadow-red-600/20 hover:from-red-700 hover:to-rose-800 min-h-[48px]"
                >
                  Submit & Queue Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
