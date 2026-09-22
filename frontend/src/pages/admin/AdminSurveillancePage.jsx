import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_ADMIN_DATA } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { 
  AlertTriangle, 
  Radio, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Droplet, 
  Bug, 
  Truck, 
  Send, 
  Bell, 
  MapPin, 
  FileText,
  Search,
  ArrowRight
} from 'lucide-react';

const normalizeSurveillanceItem = (item) => ({
  id: item.id || `surv-${Date.now()}`,
  condition: item.condition || item.disease || 'Epidemiological Alert',
  block: item.block || item.village || 'Ambegaon District Block',
  clusterCases: item.clusterCases ?? item.casesReported ?? 5,
  alertLevel: item.alertLevel || (item.thresholdBreached ? 'ELEVATED' : 'MONITORING'),
  levelBadgeClass: item.levelBadgeClass || (item.alertLevel === 'ORANGE_SURVEILLANCE' || item.alertLevel === 'ELEVATED' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-100 text-blue-900 border-blue-300'),
  detectionSource: item.detectionSource || 'ASHA Syndromic Reporting & Doorstep Triage',
  responseStatus: item.responseStatus || 'Field Inspection Dispatched',
  actionTaken: item.actionTaken || 'Super-chlorination and vector control initiated.',
  dispatchActive: item.dispatchActive || false
});

export default function AdminSurveillancePage() {
  const { t } = useTranslation();
  const [surveillanceList, setSurveillanceList] = useState((MOCK_ADMIN_DATA.diseaseSurveillance || []).map(normalizeSurveillanceItem));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertBroadcast, setAlertBroadcast] = useState(null);

  const fetchSurveillance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.admin.getSurveillance();
      if (res && res.success && res.data) {
        if (Array.isArray(res.data.activeOutbreakAlerts) && res.data.activeOutbreakAlerts.length > 0) {
          setSurveillanceList(res.data.activeOutbreakAlerts.map(normalizeSurveillanceItem));
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setSurveillanceList(res.data.map(normalizeSurveillanceItem));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch surveillance, using fallback:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurveillance();
  }, [fetchSurveillance]);

  const handleDispatch = (item) => {
    const updated = surveillanceList.map((s) =>
      s.id === item.id ? { ...s, responseStatus: 'Mobile Unit On-Site', dispatchActive: true } : s
    );
    setSurveillanceList(updated);
    setAlertBroadcast(`Mobile Epidemic Response Team & rapid diagnostic kits deployed to ${item.block}. Larvicide & chlorination initiated.`);
    setTimeout(() => setAlertBroadcast(null), 5000);
  };

  const handleBroadcastAlert = () => {
    setAlertBroadcast('High-Priority IDSP Epidemic Alert broadcasted to all 14 PHC Medical Officers and 42 ASHA WhatsApp/SMS channels.');
    setTimeout(() => setAlertBroadcast(null), 5000);
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-red-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                <Radio className="w-3 h-3 animate-pulse text-red-400" />
                Integrated Disease Surveillance Programme (IDSP)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-emerald-950">
                Weekly Form P & L Live
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {t('admin.surveillance')} & Outbreak Early Warning
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-1">
              Syndromic fever clusters, vector-borne disease detection, water source chlorination audits, and rapid medical unit deployment.
            </p>
          </div>

          <button
            onClick={handleBroadcastAlert}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast District Alert</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {alertBroadcast && (
        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{alertBroadcast}</span>
        </div>
      )}

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rural-card p-4 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Outbreak Clusters</span>
          <div className="text-xl font-extrabold text-amber-600 mt-1">2 Clusters</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Ambegaon & Khed Sub-divisions</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fever Cases Logged</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">29 Cases</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">Via ASHA doorstep triage</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Water Sources Chlorinated</span>
          <div className="text-xl font-extrabold text-teal-700 mt-1">94.2%</div>
          <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">48 Open wells treated</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile Response Unit</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">Standby Ready</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Rapid antigen testing kits onboard</span>
        </div>
      </div>

      {/* 3. Outbreak Surveillance Cluster Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Active Epidemiological Disease Clusters ({surveillanceList.length})</span>
          </h2>
          <span className="text-xs text-slate-500">ASHA Syndromic Reporting Feed</span>
        </div>

        {loading ? (
          <div className="rural-card p-8">
            <LoadingState message="Fetching Real-Time Outbreak Surveillance Data..." />
          </div>
        ) : error ? (
          <div className="rural-card p-6">
            <ErrorState message={error} onRetry={fetchSurveillance} />
          </div>
        ) : surveillanceList.length === 0 ? (
          <div className="rural-card p-8">
            <EmptyState
              icon={AlertTriangle}
              title="No Active Outbreaks"
              description="Zero epidemiological disease clusters currently reported by field ASHA workers."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {surveillanceList.map((ob) => (
              <div
                key={ob.id}
                className="rural-card p-5 hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase border ${ob.levelBadgeClass}`}>
                      Alert Level: {ob.alertLevel}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{ob.condition}</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                      {ob.clusterCases} Reported Cases
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">Block / Location:</span> {ob.block}
                  </p>

                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">Detection Source:</span> {ob.detectionSource}
                  </p>

                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs text-slate-700">
                    <span className="font-bold text-amber-950 block mb-0.5">Control Measures Initiated:</span>
                    <p>{ob.actionTaken}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleDispatch(ob)}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{ob.dispatchActive ? 'Re-deploy Unit' : t('admin.dispatchMobileUnit')}</span>
                  </button>
                  <button
                    onClick={() => alert(`Vector control and pesticide spraying protocol triggered for ${ob.block}.`)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Bug className="w-4 h-4 text-slate-600" />
                    <span>Vector Control</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Drinking Water Quality & Vector Surveillance Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rural-card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blue-600" />
            <span>Drinking Water Quality & Chlorination Testing</span>
          </h3>
          <p className="text-xs text-slate-500">
            Weekly OT test (Orthotolidine) logs submitted by Sub-Centre Health Workers.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Nigdale Village Well #1</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Residual Chlorine 0.5 ppm (Safe)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Thakarwadi Community Borewell</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Residual Chlorine 0.4 ppm (Safe)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Bhimashankar Koliwada Stream</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Re-chlorination Scheduled Today</span>
            </div>
          </div>
        </div>

        <div className="rural-card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bug className="w-4 h-4 text-emerald-600" />
            <span>Entomological Vector Surveillance Index</span>
          </h3>
          <p className="text-xs text-slate-500">
            Aedes aegypti and Anopheles larvae larval surveys across hamlets.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">House Index (HI)</span>
              <span className="font-bold text-emerald-700">2.1% (Safe Threshold &lt; 5%)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Breteau Index (BI)</span>
              <span className="font-bold text-emerald-700">4.5 (Safe Threshold &lt; 20)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Larvicide (Temephos) Stock</span>
              <span className="font-bold text-slate-800">42 Liters at Khed CHC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
