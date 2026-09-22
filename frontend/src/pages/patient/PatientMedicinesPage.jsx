import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE } from '../../services/mockData';
import {
  Pill,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  RefreshCw,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';

export default function PatientMedicinesPage() {
  const { currentUser, patientGender } = useAuth();
  const { t } = useTranslation();

  const isMale = (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [takenToday, setTakenToday] = useState({});
  const [refillRequested, setRefillRequested] = useState({});

  const toggleDose = (id) => {
    setTakenToday((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRequestRefill = (id) => {
    setRefillRequested((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      alert('Refill notification submitted to your local ASHA worker and PHC dispensary.');
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-6 h-6 text-ruralTeal-700" />
              My Prescription Medicines
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Active treatments, daily doses & free government PHC refills
            </p>
          </div>
        </div>

        <Link
          to="/patient/medicines"
          className="px-3.5 py-2 bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-700 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5"
        >
          <span>Check PHC Stock</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Daily Dose Tracker Checklist */}
      <div className="bg-gradient-to-r from-ruralTeal-700 to-teal-800 text-white rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold">Today's Daily Dosage Tracker</h2>
            <p className="text-xs text-teal-100 mt-0.5">
              Tap a medicine once you take your dose to maintain your compliance record.
            </p>
          </div>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
            {Object.values(takenToday).filter(Boolean).length} of {basePatient.activeMedicines.length} Taken
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {basePatient.activeMedicines.map((med) => {
            const isTaken = takenToday[med.id];
            return (
              <button
                key={med.id}
                type="button"
                onClick={() => toggleDose(med.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border ${
                  isTaken
                    ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-inner'
                    : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-teal-100">{med.dose}</span>
                  <CheckCircle2 className={`w-5 h-5 ${isTaken ? 'text-emerald-300' : 'text-white/40'}`} />
                </div>
                <h3 className="text-sm font-extrabold">{med.name}</h3>
                <p className="text-[11px] text-teal-100/80 mt-0.5">{med.timing}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Prescription Medicine Cards */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Active Prescriptions & PHC Stock Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {basePatient.activeMedicines.map((med) => (
            <div
              key={med.id}
              className="rural-card p-5 flex flex-col justify-between rural-card-hover border border-slate-200/80"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider">
                      Prescription Drug
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{med.name}</h3>
                    <p className="text-xs text-ruralTeal-700 font-semibold">{med.dose}</p>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                    {med.remainingDays} Days Left
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-ruralTeal-600 shrink-0" />
                    <span>Timing: <strong>{med.timing}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Special: {med.instruction}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>In-Stock at: <strong>{isMale ? 'Khed CHC Pharmacy' : 'Bhimashankar PHC'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Provided free under NHM</span>
                {refillRequested[med.id] ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Refill Requested
                  </span>
                ) : (
                  <button
                    onClick={() => handleRequestRefill(med.id)}
                    className="px-3 py-1.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Request Refill</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
