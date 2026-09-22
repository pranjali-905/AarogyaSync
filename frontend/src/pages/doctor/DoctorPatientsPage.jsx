import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  Users,
  Search,
  ChevronLeft,
  Filter,
  User,
  MapPin,
  FileText,
  Video,
  Pill,
  Heart,
  Baby,
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function DoctorPatientsPage() {
  const { t } = useTranslation();
  const { patientsList } = MOCK_DOCTOR_DATA;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Patients' },
    { id: 'HIGH_RISK_ANC', label: 'High-Risk Pregnancy' },
    { id: 'PREGNANT_MOTHER', label: 'Antenatal Care (ANC)' },
    { id: 'CHRONIC_CARE', label: 'Chronic Care (HTN/DM)' },
    { id: 'ELDERLY', label: 'Senior Citizens (60+)' },
    { id: 'INFANT', label: 'Infants & Pediatric' }
  ];

  const filteredPatients = patientsList.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abhaId.includes(searchQuery) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
            <span className="text-slate-700 font-semibold">{t('doctor.patients', 'Registered Patients')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            {t('doctor.patients', 'Registered Rural Patients')}
          </h1>
          <p className="text-slate-600 mt-1">
            Comprehensive village cluster patient roster, ABHA health IDs, and clinical profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            ABDM Privacy Scoped
          </span>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ABHA, village, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPatients.map((p) => {
          const isUrgent = p.status.includes('Red') || p.status.includes('Urgent');
          const isMonitoring = p.status.includes('Yellow') || p.status.includes('Monitoring');

          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                isUrgent
                  ? 'bg-rose-50/30 border-rose-200'
                  : isMonitoring
                  ? 'bg-amber-50/20 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {p.categoryLabel}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isUrgent
                        ? 'bg-red-100 text-red-800'
                        : isMonitoring
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Patient identity */}
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-5 h-5 text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900">{p.fullName}</h3>
                  <span className="text-xs text-slate-500">• {p.age} yrs, {p.gender}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Village: {p.village}</span>
                  <span className="ml-2 font-mono text-[11px] text-slate-400">ABHA: {p.abhaId}</span>
                </div>

                {/* Diagnosis Box */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 mb-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Active Clinical Condition
                  </span>
                  <p className="text-xs font-bold text-slate-800">{p.diagnosis}</p>
                  <p className="text-[11px] text-slate-500">
                    Assigned ASHA: <strong>{p.assignedAsha}</strong> • Last Encounter: {p.lastVisit}
                  </p>
                </div>

                {/* Vitals Summary Strip */}
                {p.lastVitals && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 bg-slate-50/80 p-2.5 rounded-xl">
                    {p.lastVitals.bp && <span>BP: <strong>{p.lastVitals.bp}</strong></span>}
                    {p.lastVitals.pulse && <span>• Pulse: <strong>{p.lastVitals.pulse}</strong></span>}
                    {p.lastVitals.spO2 && <span>• SpO2: <strong>{p.lastVitals.spO2}</strong></span>}
                    {p.lastVitals.hb && <span>• Hb: <strong>{p.lastVitals.hb}</strong></span>}
                    {p.lastVitals.temp && <span>• Temp: <strong>{p.lastVitals.temp}</strong></span>}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200">
                <Link
                  to={`/doctor/history?patientId=${p.id}`}
                  className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold min-h-[42px]"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Timeline
                </Link>

                <Link
                  to={`/doctor/consult/${p.id}`}
                  className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold min-h-[42px]"
                >
                  <Video className="w-3.5 h-3.5" />
                  Consult
                </Link>

                <Link
                  to={`/doctor/prescriptions?patientId=${p.id}`}
                  className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold min-h-[42px]"
                >
                  <Pill className="w-3.5 h-3.5" />
                  Issue Rx
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
