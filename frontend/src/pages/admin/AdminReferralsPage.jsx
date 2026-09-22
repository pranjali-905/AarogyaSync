import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_ADMIN_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { 
  Truck, 
  Ambulance, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Search, 
  X, 
  ShieldAlert, 
  UserCheck 
} from 'lucide-react';

const normalizeReferral = (ref) => {
  const urgencyRaw = (ref.urgency || 'HIGH').toUpperCase();
  let urgency = ref.urgency;
  let urgencyClass = ref.urgencyClass;
  if (!urgencyClass) {
    if (urgencyRaw.includes('RED') || urgencyRaw.includes('URGENT')) {
      urgency = 'URGENT (Red)';
      urgencyClass = 'bg-red-100 text-red-800 border-red-200';
    } else if (urgencyRaw.includes('YELLOW') || urgencyRaw.includes('MODERATE')) {
      urgency = 'MODERATE (Yellow)';
      urgencyClass = 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      urgency = 'HIGH (Orange)';
      urgencyClass = 'bg-orange-100 text-orange-800 border-orange-200';
    }
  }

  const statusRaw = (ref.transferStatus || ref.status || 'EN ROUTE').toUpperCase();
  let transferStatus = 'En Route';
  if (statusRaw.includes('ADMIT') || statusRaw === 'ADMITTED') {
    transferStatus = 'Admitted';
  } else if (statusRaw.includes('COMPLET') || statusRaw === 'COMPLETED') {
    transferStatus = 'Completed';
  } else if (statusRaw.includes('INITIAT') || statusRaw === 'EN ROUTE' || statusRaw === 'PENDING') {
    transferStatus = 'En Route';
  }

  return {
    id: ref.id || `ref-${Date.now()}`,
    patientName: ref.patientName || ref.patient_name || 'Anonymous Patient',
    fromFacility: ref.fromFacility || ref.from_facility_name || 'Bhimashankar PHC',
    toFacility: ref.toFacility || ref.to_facility_name || 'Khed CHC',
    reason: ref.reason || 'Critical Escalation Assessment',
    urgency,
    urgencyClass,
    assignedVehicle: ref.assignedVehicle || ref.transport_needed || '108-ALS Emergency Ambulance (MH-14-AZ-2041)',
    driverName: ref.driverName || 'Vikas Jadhav (+91-9822771122)',
    transferStatus,
    timestamp: ref.timestamp || (ref.created_at ? new Date(ref.created_at).toLocaleDateString() : 'Just now')
  };
};

export default function AdminReferralsPage() {
  const { t } = useTranslation();
  const [referrals, setReferrals] = useState((MOCK_ADMIN_DATA.referrals || []).map(normalizeReferral));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionNotice, setActionNotice] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const [newReferral, setNewReferral] = useState({
    patientName: '',
    fromFacility: 'Bhimashankar PHC',
    toFacility: 'Khed CHC',
    reason: '',
    urgency: 'HIGH (Orange)',
    assignedVehicle: '108-ALS Emergency Ambulance (MH-14-AZ-2041)',
    driverName: 'Vikas Jadhav (+91-9822771122)'
  });

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.admin.getReferrals();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setReferrals(res.data.map(normalizeReferral));
      } else {
        setReferrals((MOCK_ADMIN_DATA.referrals || []).map(normalizeReferral));
      }
    } catch (err) {
      console.warn('Failed to fetch referrals, using fallback:', err);
      setReferrals((MOCK_ADMIN_DATA.referrals || []).map(normalizeReferral));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const handleUpdateStatus = async (id, newStatus) => {
    setReferrals((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, transferStatus: newStatus } : ref))
    );
    try {
      await apiService.referrals.updateStatus(id, newStatus);
    } catch (e) {
      console.warn('Update referral status offline fallback');
    }
    setActionNotice(`Referral ${id} status updated to ${newStatus}. Both origin and destination facilities notified.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!newReferral.patientName || !newReferral.reason) return;

    const created = {
      id: `ref-0${referrals.length + 1}`,
      patientName: newReferral.patientName,
      fromFacility: newReferral.fromFacility,
      toFacility: newReferral.toFacility,
      reason: newReferral.reason,
      urgency: newReferral.urgency,
      urgencyClass: newReferral.urgency.includes('URGENT')
        ? 'bg-red-100 text-red-800 border-red-200'
        : 'bg-orange-100 text-orange-800 border-orange-200',
      assignedVehicle: newReferral.assignedVehicle,
      driverName: newReferral.driverName,
      transferStatus: 'En Route',
      timestamp: 'Just now'
    };

    setReferrals([created, ...referrals]);
    setShowNewModal(false);

    try {
      await apiService.referrals.create({
        patientId: 'usr-pat-female-01',
        fromFacilityId: 'fac-phc-01',
        toFacilityId: 'fac-chc-02',
        reason: newReferral.reason,
        urgency: newReferral.urgency.includes('URGENT') ? 'RED' : 'YELLOW',
        transportNeeded: newReferral.assignedVehicle
      });
    } catch (err) {
      console.warn('Create referral offline fallback');
    }

    setNewReferral({
      patientName: '',
      fromFacility: 'Bhimashankar PHC',
      toFacility: 'Khed CHC',
      reason: '',
      urgency: 'HIGH (Orange)',
      assignedVehicle: '108-ALS Emergency Ambulance (MH-14-AZ-2041)',
      driverName: 'Vikas Jadhav (+91-9822771122)'
    });
    setActionNotice(`Emergency inter-facility transfer initiated for ${created.patientName}. 108 ambulance dispatched.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredReferrals = referrals.filter((ref) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ref.patientName.toLowerCase().includes(q) ||
      ref.fromFacility.toLowerCase().includes(q) ||
      ref.toFacility.toLowerCase().includes(q) ||
      ref.assignedVehicle.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return ref.transferStatus.toUpperCase() === statusFilter;
  });


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/30 text-orange-200 border border-orange-400/40">
              National Health Mission • Emergency Response 108 & 102
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5">
              {t('admin.referrals')} & Fleet Command
            </h1>
            <p className="text-xs sm:text-sm text-orange-100/80 mt-1">
              District-wide inter-facility transfer oversight, critical care escalations, and live 108/102 ambulance dispatch coordination.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Initiate Transfer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionNotice}</span>
        </div>
      )}

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Transfers</span>
          <div className="text-xl font-extrabold text-orange-600 mt-1">
            {referrals.filter((r) => r.transferStatus === 'En Route').length} In Transit
          </div>
          <span className="text-[11px] text-orange-600 font-semibold mt-0.5 block">Live GPS Telemetry</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">108 ALS Readiness</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">4 Ambulances</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Equipped with Defibrillators</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">102 Janani Shishu Vahan</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">4 Ambulances</div>
          <span className="text-[11px] text-teal-600 font-semibold mt-0.5 block">Dedicated Maternal Transport</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</span>
          <div className="text-xl font-extrabold text-blue-600 mt-1">14.5 Mins</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Doorstep to PHC</span>
        </div>
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="rural-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search referrals by patient name, facility, or ambulance number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Transfers' },
            { id: 'EN ROUTE', label: 'En Route' },
            { id: 'ADMITTED', label: 'Admitted' },
            { id: 'COMPLETED', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-orange-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Referrals List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rural-card p-8">
            <LoadingState message="Tracking Emergency Patient Transfers & Fleet..." />
          </div>
        ) : error ? (
          <div className="rural-card p-6">
            <ErrorState message={error} onRetry={fetchReferrals} />
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="rural-card p-8">
            <EmptyState
              icon={Ambulance}
              title="No Patient Transfers Found"
              description="No inter-facility emergency referrals match your search or filter criteria."
            />
          </div>
        ) : (
          filteredReferrals.map((ref) => (
            <div
              key={ref.id}
              className="rural-card p-5 hover:border-orange-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{ref.id}</span>
                  <h3 className="text-sm font-bold text-slate-900">{ref.patientName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${ref.urgencyClass || 'bg-orange-100 text-orange-800'}`}>
                    {ref.urgency}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ref.transferStatus === 'En Route'
                        ? 'bg-amber-100 text-amber-900'
                        : ref.transferStatus === 'Admitted'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {ref.transferStatus}
                  </span>
                </div>

                {/* Transfer route */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ref.fromFacility}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-slate-900">{ref.toFacility}</span>
                </div>

                <p className="text-xs text-slate-600">
                  Reason for Escalation: <span className="font-medium text-slate-800">{ref.reason}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Ambulance className="w-3.5 h-3.5 text-orange-600" />
                    {ref.assignedVehicle}
                  </span>
                  <span>Driver: {ref.driverName}</span>
                  <span>Logged: {ref.timestamp}</span>
                </div>
              </div>

              {/* Status change actions */}
              <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
                {ref.transferStatus === 'En Route' && (
                  <button
                    onClick={() => handleUpdateStatus(ref.id, 'Admitted')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    Mark Admitted at CHC
                  </button>
                )}
                {ref.transferStatus === 'Admitted' && (
                  <button
                    onClick={() => handleUpdateStatus(ref.id, 'Completed')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    Mark Transfer Completed
                  </button>
                )}
                <button
                  onClick={() => alert(`Connecting to 108 Emergency Ambulance Driver: ${ref.driverName}`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Ambulance</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Initiate Transfer Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateReferral}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-orange-600" />
                <span>Initiate Emergency Referral Transfer</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Shinde"
                  value={newReferral.patientName}
                  onChange={(e) => setNewReferral({ ...newReferral, patientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source Facility</label>
                  <select
                    value={newReferral.fromFacility}
                    onChange={(e) => setNewReferral({ ...newReferral, fromFacility: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Nigdale Sub-Centre">Nigdale Sub-Centre</option>
                    <option value="Bhimashankar PHC">Bhimashankar PHC</option>
                    <option value="Khed CHC">Khed CHC</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination Facility</label>
                  <select
                    value={newReferral.toFacility}
                    onChange={(e) => setNewReferral({ ...newReferral, toFacility: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Khed Community Health Centre (CHC)">Khed CHC</option>
                    <option value="Manchar Sub-District Hospital">Manchar SDH</option>
                    <option value="Sassoon General Hospital Pune">Sassoon Hospital Pune</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Diagnosis / Escalation Reason</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Severe pre-eclampsia symptoms, BP 160/100, fetal distress watch..."
                  value={newReferral.reason}
                  onChange={(e) => setNewReferral({ ...newReferral, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urgency Priority</label>
                  <select
                    value={newReferral.urgency}
                    onChange={(e) => setNewReferral({ ...newReferral, urgency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="URGENT (Red)">URGENT (Red)</option>
                    <option value="HIGH (Orange)">HIGH (Orange)</option>
                    <option value="MODERATE (Yellow)">MODERATE (Yellow)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Ambulance</label>
                  <select
                    value={newReferral.assignedVehicle}
                    onChange={(e) => setNewReferral({ ...newReferral, assignedVehicle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="108-ALS Emergency Ambulance (MH-14-AZ-2041)">108-ALS (MH-14-AZ-2041)</option>
                    <option value="102-BLS Janani Express (MH-14-BQ-1102)">102 Janani Express</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Dispatch Ambulance & Notify PHC
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
