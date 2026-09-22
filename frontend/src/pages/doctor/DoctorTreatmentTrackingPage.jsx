import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  TrendingUp,
  Activity,
  Heart,
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  Pill,
  User,
  ArrowRight,
  ShieldCheck,
  Video
} from 'lucide-react';

export default function DoctorTreatmentTrackingPage() {
  const { t } = useTranslation();
  const { treatmentTracking, patientsList } = MOCK_DOCTOR_DATA;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const filteredPatients = treatmentTracking.filter((item) => {
    const matchesRisk = filterRisk === 'ALL' || item.riskTier === filterRisk;
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedAsha.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

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
            <span className="text-slate-700 font-semibold">{t('doctor.treatmentTracking', 'Treatment Tracking')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            Chronic Disease & Treatment Tracking
          </h1>
          <p className="text-slate-600 mt-1">
            Longitudinal management for Hypertension, Diabetes, High-Risk ANC, and TB DOTS patients with medication adherence auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            ICMR NCD Guidelines
          </span>
        </div>
      </div>

      {/* 2. Search & Risk Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, condition, ASHA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterRisk('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterRisk === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Chronic Cohort ({treatmentTracking.length})
          </button>
          <button
            onClick={() => setFilterRisk('CRITICAL_RED')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterRisk === 'CRITICAL_RED'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            Critical Red ({treatmentTracking.filter((i) => i.riskTier === 'CRITICAL_RED').length})
          </button>
          <button
            onClick={() => setFilterRisk('MODERATE_YELLOW')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterRisk === 'MODERATE_YELLOW'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            Moderate Yellow ({treatmentTracking.filter((i) => i.riskTier === 'MODERATE_YELLOW').length})
          </button>
        </div>
      </div>

      {/* 3. Chronic Patients Tracking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPatients.map((item) => {
          const isCritical = item.riskTier === 'CRITICAL_RED';

          return (
            <div
              key={item.patientId}
              className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                isCritical
                  ? 'bg-rose-50/30 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      isCritical ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {isCritical ? 'CRITICAL RISK' : 'MODERATE RISK'}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Adherence: {item.adherenceRate}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{item.patientName}</h3>
                <p className="text-xs font-semibold text-primary-700 mb-3">{item.condition}</p>

                {/* Vitals & Target Parameters Strip */}
                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Last Recorded Parameters:</span>
                    <span className="font-bold text-slate-900">{item.lastVitalsRecorded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Target Clinical Parameters:</span>
                    <span className="font-semibold text-emerald-700">{item.targetParameters}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                    <span className="text-slate-500">Trajectory Assessment:</span>
                    <span className="font-bold text-slate-800">{item.trajectory}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  Assigned Frontline Worker: <strong>{item.assignedAsha}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <Link
                  to={`/doctor/consult/${item.patientId}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold min-h-[42px]"
                >
                  <Video className="w-3.5 h-3.5" />
                  Teleconsult
                </Link>

                <Link
                  to={`/doctor/history?patientId=${item.patientId}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold min-h-[42px]"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-500" />
                  Timeline
                </Link>

                <Link
                  to={`/doctor/prescriptions?patientId=${item.patientId}`}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold min-h-[42px]"
                  title="Adjust Medication"
                >
                  <Pill className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
