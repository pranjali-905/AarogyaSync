import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_ADMIN_DATA } from '../../services/mockData';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Users, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  FileSpreadsheet,
  Award
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { t } = useTranslation();
  const analytics = MOCK_ADMIN_DATA.analyticsData || {};
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
              National Health Mission • Epidemiological & Operational Analytics
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5">
              {t('admin.analytics')} & Surveillance Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-1">
              Cross-cutting health trends, triage priority distributions, follow-up adherence, facility utilization, and clinical quality monitoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['1M', '3M', '6M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  timeRange === range
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top Executive Scorecard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Follow-up Adherence</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">{analytics.followupStatistics?.adherenceRate || '88.4%'}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">742 completed on time</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Quality Score</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{analytics.qualityMonitoring?.patientSatisfactionScore || '4.8 / 5.0'}</div>
          <span className="text-[11px] text-teal-600 font-semibold mt-0.5 block">Prescription compliance 94.2%</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Emergency Transit Time</span>
          <div className="text-xl font-extrabold text-blue-600 mt-1">{analytics.qualityMonitoring?.emergencyReferralTransitMins || 14.5} Mins</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">108 Fleet dispatch avg</span>
        </div>

        <div className="rural-card p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workforce Sync Delay</span>
          <div className="text-xl font-extrabold text-teal-700 mt-1">{analytics.workforceActivity?.avgSyncDelayMins || 4.8} Mins</div>
          <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">Offline vault auto-sync</span>
        </div>
      </div>

      {/* 3. Section 1 & 2: Health Trends and Priority Cases Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trends */}
        <div className="rural-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>{t('admin.healthTrends')} (Monthly Growth)</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Consultations & Screenings</span>
          </div>

          <div className="space-y-3">
            {analytics.healthTrends?.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>{item.month}</span>
                  <span className="text-slate-900 font-bold">{item.consultations} Consults • {item.maternalCheckups} ANC</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-indigo-600 h-full"
                    style={{ width: `${(item.consultations / 1500) * 100}%` }}
                    title={`Consultations: ${item.consultations}`}
                  />
                  <div
                    className="bg-teal-500 h-full"
                    style={{ width: `${(item.maternalCheckups / 1500) * 100}%` }}
                    title={`Maternal ANC: ${item.maternalCheckups}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600"></span>
              <span>Teleconsultations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-500"></span>
              <span>Maternal ANC Checkups</span>
            </div>
          </div>
        </div>

        {/* Priority Cases Distribution */}
        <div className="rural-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              <span>{t('admin.priorityCases')} (ICMR Triage Engine)</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Total 1,390 Assessed</span>
          </div>

          {/* Stacked visually responsive bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner">
            {analytics.priorityDistribution?.map((p, idx) => (
              <div
                key={idx}
                className={`${p.color} h-full`}
                style={{ width: `${p.percentage}%` }}
                title={`${p.level}: ${p.percentage}%`}
              />
            ))}
          </div>

          <div className="space-y-2.5 pt-1">
            {analytics.priorityDistribution?.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${p.color}`}></span>
                  <span className="font-bold text-slate-800">{p.level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900">{p.count} Cases</span>
                  <span className="font-semibold text-slate-500">({p.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Section 3: Follow-Up Statistics & Workforce Field Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follow-up Statistics */}
        <div className="rural-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{t('admin.followupStatistics')}</span>
            </h2>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
              High Compliance
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold">Total Follow-ups Scheduled</span>
              <span className="text-lg font-extrabold text-slate-900 mt-1 block">
                {analytics.followupStatistics?.scheduledTotal}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-700 block font-semibold">Completed On-Time</span>
              <span className="text-lg font-extrabold text-emerald-900 mt-1 block">
                {analytics.followupStatistics?.completedOnTime}
              </span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-amber-700 block font-semibold">Overdue Follow-ups</span>
              <span className="text-lg font-extrabold text-amber-900 mt-1 block">
                {analytics.followupStatistics?.overdueCases} Cases
              </span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-blue-700 block font-semibold">Average Days to Follow-up</span>
              <span className="text-lg font-extrabold text-blue-900 mt-1 block">
                {analytics.followupStatistics?.avgDaysToFollowup} Days
              </span>
            </div>
          </div>
        </div>

        {/* Workforce Field Activity */}
        <div className="rural-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-ruralTeal-700" />
              <span>{t('admin.workforceActivity')}</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Doorstep Field Operations</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold">Home Visits Logged</span>
              <span className="text-lg font-extrabold text-slate-900 mt-1 block">
                {analytics.workforceActivity?.totalHomeVisitsLogged?.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
              <span className="text-teal-700 block font-semibold">Digital Triage Assessments</span>
              <span className="text-lg font-extrabold text-teal-900 mt-1 block">
                {analytics.workforceActivity?.digitalAssessmentsCompleted?.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-purple-700 block font-semibold">Doorstep Immunizations</span>
              <span className="text-lg font-extrabold text-purple-900 mt-1 block">
                {analytics.workforceActivity?.doorstepImmunizationsRecorded}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-700 block font-semibold">Active Reporting Rate</span>
              <span className="text-lg font-extrabold text-emerald-900 mt-1 block">
                {analytics.workforceActivity?.activeAshaReportingPercent}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Section 4 & 5: Facility Bed Utilization & Clinical Quality Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facility Activity Table */}
        <div className="rural-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{t('admin.facilityActivity')}</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Bed & Consult Throughput</span>
          </div>

          <div className="divide-y divide-slate-100">
            {analytics.facilityActivity?.map((fac, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{fac.name}</h4>
                  <span className="text-slate-500 text-[11px]">Bed Occupancy: {fac.bedOccupancy}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">{fac.teleconsultations} Consults</div>
                  <div className="text-slate-500 text-[11px]">Avg Response: {fac.avgResponseMins}m</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Monitoring */}
        <div className="rural-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('admin.qualityMonitoring')}</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">ICMR & ABDM Standards</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
              <span className="font-medium text-slate-700">Prescription Standard Compliance</span>
              <span className="font-bold text-emerald-700">{analytics.qualityMonitoring?.prescriptionCompliance}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
              <span className="font-medium text-slate-700">Emergency Referral Transit Time</span>
              <span className="font-bold text-blue-700">{analytics.qualityMonitoring?.emergencyReferralTransitMins} Minutes</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
              <span className="font-medium text-slate-700">ABHA Linkage Coverage Rate</span>
              <span className="font-bold text-teal-700">{analytics.qualityMonitoring?.abhaLinkageCoverage}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
              <span className="font-medium text-slate-700">Antibiotic Stewardship Adherence</span>
              <span className="font-bold text-purple-700">{analytics.qualityMonitoring?.antibioticStewardshipRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
