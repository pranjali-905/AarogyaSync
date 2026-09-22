import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  FileText,
  Clock,
  User,
  ChevronLeft,
  Calendar,
  Activity,
  AlertTriangle,
  Stethoscope,
  Video,
  Pill,
  Ambulance,
  Building2,
  CheckCircle2,
  Filter,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function DoctorHistoryPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { patientsList, patientTimelines } = MOCK_DOCTOR_DATA;

  // Selected patient from query or default to Meena Waghmare
  const patientIdParam = searchParams.get('patientId') || 'p-02';
  const [selectedPatientId, setSelectedPatientId] = useState(patientIdParam);

  useEffect(() => {
    if (patientIdParam !== selectedPatientId) {
      setSelectedPatientId(patientIdParam);
    }
  }, [patientIdParam]);

  const currentPatient =
    patientsList.find((p) => p.id === selectedPatientId) || patientsList[0];

  // Retrieve timeline for patient or generate fallback
  const timelineEvents = patientTimelines[selectedPatientId] || [
    {
      id: 'tl-def-01',
      date: '2026-09-14 11:00 AM',
      type: 'OPD_CHECKUP',
      title: 'Routine General Health Consultation',
      details: 'Vitals stable. Patient counseled on hydration and diet.',
      actor: 'Dr. Ramesh Kulkarni',
      priority: 'GREEN'
    }
  ];

  const handlePatientChange = (e) => {
    const newId = e.target.value;
    setSelectedPatientId(newId);
    searchParams.set('patientId', newId);
    setSearchParams(searchParams);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'EMERGENCY_TRIAGE':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'DOCTOR_TELECONSULT':
        return <Video className="w-5 h-5 text-primary-600" />;
      case 'REFERRAL_DISPATCH':
        return <Ambulance className="w-5 h-5 text-amber-600" />;
      case 'LAB_TEST':
        return <Activity className="w-5 h-5 text-teal-600" />;
      case 'PRESCRIPTION_ISSUED':
        return <Pill className="w-5 h-5 text-emerald-600" />;
      case 'ASHA_VISIT':
        return <User className="w-5 h-5 text-blue-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-slate-600" />;
    }
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
            <span className="text-slate-700 font-semibold">{t('doctor.medicalHistory', 'Medical History')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary-600" />
            {t('doctor.medicalHistory', 'Patient Medical History & Timeline')}
          </h1>
          <p className="text-slate-600 mt-1">
            Chronological encounter history linking doorstep ASHA visits, teleconsultations, and hospital admissions.
          </p>
        </div>

        {/* Patient Switcher Dropdown */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-500 uppercase pl-2">Select Patient:</label>
          <select
            value={selectedPatientId}
            onChange={handlePatientChange}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[40px]"
          >
            {patientsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.age}y - {p.village})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Current Patient Clinical Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center font-black text-lg">
              {currentPatient.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{currentPatient.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {currentPatient.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentPatient.age} yrs • {currentPatient.gender} • Village: <strong>{currentPatient.village}</strong> • ABHA: <span className="font-mono">{currentPatient.abhaId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/doctor/consult/${currentPatient.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm min-h-[42px]"
            >
              <Video className="w-4 h-4" />
              Start Consult
            </Link>
            <Link
              to={`/doctor/prescriptions?patientId=${currentPatient.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold min-h-[42px]"
            >
              <Pill className="w-4 h-4" />
              New Prescription
            </Link>
          </div>
        </div>

        {/* Clinical diagnosis & vitals bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Diagnosis:</span>
            <span className="font-bold text-slate-900">{currentPatient.diagnosis}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Frontline ASHA:</span>
            <span className="font-bold text-slate-900">{currentPatient.assignedAsha}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Latest Vitals:</span>
            <span className="font-bold text-slate-900">
              BP: {currentPatient.lastVitals?.bp || 'N/A'} • SpO2: {currentPatient.lastVitals?.spO2 || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Chronological Patient Care Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            Care Continuum Timeline ({timelineEvents.length} Recorded Encounters)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Chronologically Ordered (Newest First)
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 ml-3">
          {timelineEvents.map((evt, idx) => {
            const isRed = evt.priority === 'RED';
            const isYellow = evt.priority === 'YELLOW';

            return (
              <div key={evt.id || idx} className="relative group">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                    isRed
                      ? 'bg-rose-100 text-rose-700'
                      : isYellow
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {getEventIcon(evt.type)}
                </div>

                {/* Event Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 hover:bg-slate-50 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isRed
                            ? 'bg-red-600 text-white'
                            : isYellow
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-600 text-white'
                        }`}
                      >
                        {evt.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{evt.title}</h4>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">{evt.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100 font-medium leading-relaxed">
                    {evt.details}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                    <span>
                      Attending / Documenting Actor: <strong>{evt.actor}</strong>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">ID: {evt.id}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
