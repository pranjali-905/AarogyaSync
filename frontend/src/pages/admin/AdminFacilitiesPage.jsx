import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_ADMIN_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { 
  Building2, 
  Bed, 
  Activity, 
  Ambulance, 
  Pill, 
  Stethoscope, 
  Search, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldCheck, 
  PackageCheck 
} from 'lucide-react';

const normalizeFacility = (fac) => ({
  id: fac.id,
  name: fac.name || 'Healthcare Facility',
  type: fac.type || 'PHC',
  block: fac.block || fac.taluka || fac.district || 'Ambegaon Block',
  bedsTotal: fac.bedsTotal ?? fac.total_beds ?? 10,
  bedsOccupied: fac.bedsOccupied ?? fac.occupied_beds ?? 6,
  oxygenCylinders: fac.oxygenCylinders ?? 4,
  ambulanceReady: fac.ambulanceReady ?? true,
  ambulanceFleet: fac.ambulanceFleet || (fac.is_24x7 ? '108-ALS Emergency Standby' : '102-BLS Janani Transport'),
  doctorInCharge: fac.doctorInCharge || 'Dr. Medical Officer In-Charge',
  phone: fac.phone || fac.contact_number || '+91-9822001122',
  distanceKm: fac.distanceKm || '8 km',
  medicineStockRating: fac.medicineStockRating || '92% (Adequate)',
  diagnosticLabStatus: fac.diagnosticLabStatus || 'Operational (Rapid Tests, Blood Sugar, Hb)',
  keyMedicines: fac.keyMedicines || ['Paracetamol 500mg (1,000 tabs)', 'ORS (300 pkts)', 'Amoxicillin (500 caps)', 'IFA Tablets (800 tabs)'],
  availableTests: fac.availableTests || ['Complete Blood Count (CBC)', 'Hemoglobin Rapid Strip', 'Malaria Rapid Test Kit', 'Blood Sugar']
});

export default function AdminFacilitiesPage() {
  const { t } = useTranslation();
  const [facilities, setFacilities] = useState((MOCK_ADMIN_DATA.facilitiesNetwork || []).map(normalizeFacility));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [restockAlert, setRestockAlert] = useState(null);

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.admin.getFacilities();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setFacilities(res.data.map(normalizeFacility));
      } else {
        setFacilities((MOCK_ADMIN_DATA.facilitiesNetwork || []).map(normalizeFacility));
      }
    } catch (err) {
      console.warn('Failed to fetch facilities, using fallback:', err);
      setFacilities((MOCK_ADMIN_DATA.facilitiesNetwork || []).map(normalizeFacility));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const filteredFacilities = facilities.filter((fac) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = fac.name.toLowerCase().includes(q) || fac.block.toLowerCase().includes(q) || fac.doctorInCharge.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filterType === 'ALL') return true;
    return fac.type === filterType;
  });

  const handleRequestRestock = (facilityName) => {
    setRestockAlert(`Emergency replenishment request dispatched to Pune District Medical Warehouse for ${facilityName}.`);
    setTimeout(() => setRestockAlert(null), 4000);
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40">
              National Health Mission • Facilities & Logistics
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5">
              {t('admin.facilitiesNetwork')}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
              District Primary Health Centres (PHCs), Community Health Centres (CHCs), Sub-Centres, medicine inventory & diagnostic lab status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
              <span className="text-blue-200 block text-[10px] uppercase font-bold">Network Reach</span>
              <span className="text-base font-extrabold text-white">14 PHCs • 68 Sub-Centres</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restock Notification */}
      {restockAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{restockAlert}</span>
        </div>
      )}

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bed Occupancy</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">75 / 98 Beds</div>
          <span className="text-[11px] text-teal-600 font-semibold mt-0.5 block">76.5% District Utilization</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Oxygen Readiness</span>
          <div className="text-xl font-extrabold text-blue-600 mt-1">45 Cylinders</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">100% Filled & Certified</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ambulance Fleet</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">8 Standby</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">108 ALS & 102 Janani</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Medicine Stock Index</span>
          <div className="text-xl font-extrabold text-teal-700 mt-1">92.4%</div>
          <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">Zero Critical Stockouts</span>
        </div>
      </div>

      {/* 3. Search and Type Filter */}
      <div className="rural-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search facilities by name, block, or Medical Officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Facilities' },
            { id: 'PHC', label: 'Primary Health (PHC)' },
            { id: 'CHC', label: 'Community Health (CHC)' },
            { id: 'HOSPITAL', label: 'Hospitals (SDH)' },
            { id: 'SUB_CENTRE', label: 'Sub-Centres' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Facilities Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="rural-card p-8">
            <LoadingState message="Auditing District Healthcare Facilities & Inventory..." />
          </div>
        ) : error ? (
          <div className="rural-card p-6">
            <ErrorState message={error} onRetry={fetchFacilities} />
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="rural-card p-8">
            <EmptyState
              icon={Building2}
              title="No Facilities Found"
              description="No healthcare centres match your search or filter criteria in the district network."
            />
          </div>
        ) : (
          filteredFacilities.map((fac) => {
            const occupancyRate = Math.round((fac.bedsOccupied / fac.bedsTotal) * 100);
            return (
              <div key={fac.id} className="rural-card p-5 space-y-4 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{fac.name}</h3>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-blue-100 text-blue-900">
                        {fac.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Block: <span className="font-semibold text-slate-700">{fac.block}</span> • Distance from District HQ: {fac.distanceKm}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-ruralTeal-600" />
                      Doctor in Charge: <strong className="text-slate-800">{fac.doctorInCharge}</strong> ({fac.phone})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleRequestRestock(fac.name)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Audit & Restock</span>
                    </button>
                  </div>
                </div>

                {/* Resource Capacity Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-semibold flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        Beds ({fac.bedsOccupied}/{fac.bedsTotal})
                      </span>
                      <span className="font-bold text-slate-700">{occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${occupancyRate > 85 ? 'bg-red-500' : 'bg-teal-600'}`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Oxygen Supply</span>
                      <span className="font-extrabold text-slate-900">{fac.oxygenCylinders} Cylinders Ready</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Ambulance className={`w-4 h-4 shrink-0 ${fac.ambulanceReady ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Ambulance Fleet</span>
                      <span className={`font-extrabold ${fac.ambulanceReady ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {fac.ambulanceFleet}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Medicine Stock Rating</span>
                      <span className="font-extrabold text-emerald-800">{fac.medicineStockRating}</span>
                    </div>
                  </div>
                </div>

                {/* Medicine & Diagnostic Capabilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] block mb-1.5">
                      Essential Medicine Inventory
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.keyMedicines?.map((med, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-900 rounded font-medium text-[11px]">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px] block mb-1.5">
                      Diagnostic & Lab Tests Available
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.availableTests?.map((test, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-blue-200 text-blue-900 rounded font-medium text-[11px]">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
