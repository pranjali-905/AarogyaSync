import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_ADMIN_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { 
  Building2, 
  Users, 
  Activity, 
  AlertTriangle, 
  FileSpreadsheet, 
  Bed, 
  Ambulance, 
  ShieldCheck,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Truck,
  Eye,
  Radio,
  Pill,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const [metrics, setMetrics] = useState(MOCK_ADMIN_DATA.healthMetrics);
  const [facilities, setFacilities] = useState(MOCK_ADMIN_DATA.facilitiesNetwork || []);
  const [outbreaks, setOutbreaks] = useState(MOCK_ADMIN_DATA.diseaseSurveillance || []);
  const [dispatchNotice, setDispatchNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.admin.getOverview();
      if (res && res.success && res.data) {
        setMetrics((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn('Fallback to local admin overview metrics:', err);
      setError('Live administrative command feed offline. Showing local metrics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleDispatch = (block) => {
    setDispatchNotice(`Mobile Epidemic Response Unit & Rapid Antigen Diagnostic Van successfully dispatched to ${block}. PHC Medical Officer alerted.`);
    setTimeout(() => setDispatchNotice(null), 6000);
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-8 animate-in fade-in duration-300">
      {/* 1. Admin Header */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40">
                National Health Mission (NHM) • District Command
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-emerald-950 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse"></span>
                IDSP Surveillance Online
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {currentUser?.fullName || 'District Health Officer (Admin)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Pune Zilla Parishad • Monitoring 14 PHCs, 4 CHCs & 68 Sub-Centres
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/reports"
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('admin.exportReports')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dispatch confirmation toast */}
      {dispatchNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{dispatchNotice}</span>
        </div>
      )}

      {error && (
        <ErrorState
          compact
          title="Notice"
          error={error}
          onRetry={loadAdminData}
        />
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rural-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Registered Citizens</span>
            <Users className="w-4 h-4 text-ruralTeal-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{metrics.totalRegisteredCitizens?.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">↑ 124 verified this week</span>
        </div>

        <div className="rural-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Frontline ASHA</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{metrics.activeAshaWorkers}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">100% active field logs</span>
        </div>

        <div className="rural-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Teleconsultations</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{metrics.totalConsultationsCompleted?.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Avg response 8 mins</span>
        </div>

        <div className="rural-card p-4 sm:p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Maternal Risk Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-red-600">{metrics.maternalRiskAlertsActive}</div>
          <span className="text-[11px] text-red-600 font-semibold mt-0.5 block">Direct DHO monitoring</span>
        </div>
      </div>

      {/* Secondary Operational Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">ABHA Issuance</span>
            <span className="font-extrabold text-slate-900">{metrics.abhaCardIssuanceRate || '89.6%'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Medicine Stock Index</span>
            <span className="font-extrabold text-slate-900">{metrics.medicineAvailabilityRate || '92.4%'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">108 Fleet Referrals</span>
            <span className="font-extrabold text-slate-900">{metrics.districtReferralsThisMonth || 128} Transfers</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">PHC Compliance</span>
            <span className="font-extrabold text-slate-900">{metrics.phcReportingRate || '98.2%'}</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Hub to All 7 Sub-Modules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Administrative Command Modules</h2>
          <span className="text-xs text-slate-500">Quick Portal Access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/admin/patients"
            className="rural-card p-4 hover:border-ruralTeal-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-ruralTeal-700 flex items-center justify-center mb-2.5">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-ruralTeal-700 transition-colors">
                {t('admin.citizenRegistry')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage citizen profiles, ABHA linkage, and health status logs.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-ruralTeal-600 mt-3 group-hover:translate-x-1 transition-transform">
              <span>Access Registry</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            to="/admin/workforce"
            className="rural-card p-4 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-2.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {t('admin.workforceManagement')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify Medical Officers and ASHA workers credentials and incentives.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 mt-3 group-hover:translate-x-1 transition-transform">
              <span>Manage Workforce</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            to="/admin/facilities"
            className="rural-card p-4 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-2.5">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('admin.facilitiesNetwork')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Monitor PHCs, CHCs, beds, oxygen cylinders, and diagnostic capacity.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 mt-3 group-hover:translate-x-1 transition-transform">
              <span>View Facilities</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="rural-card p-4 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-2.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                {t('admin.analytics')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Epidemiological health trends, priority triage, and quality metrics.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-indigo-600 mt-3 group-hover:translate-x-1 transition-transform">
              <span>Explore Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            to="/admin/referrals"
            className="rural-card p-4 hover:border-orange-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center mb-2.5">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                {t('admin.referrals')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Track secondary and tertiary patient transfers and 108/102 ambulance fleet.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-orange-600 mt-3 group-hover:translate-x-1 transition-transform">
              <span>Track Referrals</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            to="/admin/surveillance"
            className="rural-card p-4 hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-2.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                {t('admin.surveillance')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Integrated Disease Surveillance Programme (IDSP) outbreak response.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-700 mt-3 group-hover:translate-x-1 transition-transform">
              <span>Open Surveillance</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="rural-card p-4 hover:border-purple-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-2.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                {t('admin.reportsExport')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Generate official NHM monthly bulletins and export CSV/JSON bundles.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-purple-600 mt-3 group-hover:translate-x-1 transition-transform">
              <span>Generate Reports</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            to="/patient/medicines"
            className="rural-card p-4 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-2.5">
                <Pill className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {t('nav.medicineAvailability')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                District-wide essential drug inventory tracking and buffer stock.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 mt-3 group-hover:translate-x-1 transition-transform">
              <span>Check Stock</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Disease Surveillance & Outbreak Alerts Banner */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {t('admin.outbreakAlerts')} (Integrated Disease Surveillance Programme)
          </h2>
          <Link
            to="/admin/surveillance"
            className="text-xs text-amber-800 font-bold bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            <span>Live Outbreak Console</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {outbreaks.slice(0, 2).map((ob, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] font-extrabold uppercase">
                  Alert Level: {ob.alertLevel}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{ob.condition}</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Block: <span className="font-semibold text-slate-800">{ob.block}</span> • Cluster of {ob.clusterCases} cases reported via ASHA offline triage logs.
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  Action: {ob.actionTaken}
                </p>
              </div>

              <button
                onClick={() => handleDispatch(ob.block)}
                className="self-start sm:self-auto px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shrink-0"
              >
                {t('admin.dispatchMobileUnit')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PHC Facility & Resource Network Overview */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-ruralTeal-700" />
            {t('admin.phcCoverage')}
          </h2>
          <Link
            to="/admin/facilities"
            className="text-xs text-ruralTeal-700 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {facilities.slice(0, 3).map((fac, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {fac.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Medical Officer: {fac.doctorInCharge}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Medicine Stock: <span className="font-semibold text-emerald-700">{fac.medicineStockRating}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Bed className="w-4 h-4 text-slate-400" />
                  <span>{fac.bedsOccupied}/{fac.bedsTotal} Beds</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>{fac.oxygenCylinders} O₂</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ambulance className={`w-4 h-4 ${fac.ambulanceReady ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={fac.ambulanceReady ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {fac.ambulanceReady ? '108 Standby' : 'Shared Fleet'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
