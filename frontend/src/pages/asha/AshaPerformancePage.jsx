import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_ASHA_DATA } from '../../services/mockData';
import {
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  CheckCircle2,
  Users,
  Building2,
  Download,
  ChevronLeft,
  Percent,
  ShieldCheck,
  Heart,
  Baby,
  Activity,
  FileCheck
} from 'lucide-react';

export default function AshaPerformancePage() {
  const { t } = useTranslation();
  const { worker, performanceMetrics } = MOCK_ASHA_DATA;

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/asha" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('asha.dashboardTitle', 'ASHA Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('asha.performanceTitle', 'Performance & Incentives')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-primary-600" />
            {t('asha.performanceTitle', 'ASHA Monthly Performance & Incentives')}
          </h1>
          <p className="text-slate-600 mt-1">
            National Health Mission (NHM) activity tracking, institutional delivery incentives, and field coverage metrics.
          </p>
        </div>

        <button
          onClick={handlePrintVoucher}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all min-h-[48px]"
        >
          <Download className="w-4 h-4" />
          Download Monthly Voucher
        </button>
      </div>

      {/* Hero Incentive Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-primary-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              {worker.subCentre}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">{worker.fullName}</h2>
            <p className="text-teal-100 text-sm">
              Covering {worker.village} • {worker.totalHouseholdsCovered} Rural Families Assigned
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center md:text-right">
            <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider block">
              Estimated September 2026 Incentive
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 mt-1">
              {performanceMetrics.monthlyIncentiveEstimated}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approved by Block Medical Officer (DBT Ready)
            </span>
          </div>
        </div>
      </div>

      {/* Coverage Rates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">ANC Tracking</span>
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {performanceMetrics.coverageMetrics.ancTrackingRate}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Target: &gt; 90% (Achieved)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Immunization</span>
            <Baby className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {performanceMetrics.coverageMetrics.immunizationRate}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Full 0-1 yr coverage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Inst. Delivery</span>
            <Building2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {performanceMetrics.coverageMetrics.institutionalDeliveriesRate}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">100% Hospital Births</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">NCD Vitals</span>
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {performanceMetrics.coverageMetrics.ncdScreeningRate}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Doorstep BP/Sugar check</p>
        </div>
      </div>

      {/* NHM Activity Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary-600" />
            NHM Activity-Based Incentive Breakdown
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Month: September 2026
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {performanceMetrics.incentivesBreakdown.map((item, index) => (
            <div
              key={index}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.scheme}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified from Mobile Logs
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-slate-900">{item.amount}</span>
                <span className="text-xs text-slate-400 block">Direct Benefit Transfer</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-800 text-base">
            Total Verified Monthly Frontline Entitlement:
          </span>
          <span className="font-black text-2xl text-teal-800">
            {performanceMetrics.monthlyIncentiveEstimated}
          </span>
        </div>
      </div>
    </div>
  );
}
