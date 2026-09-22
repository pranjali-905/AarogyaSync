import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import { 
  Baby, 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Activity,
  HeartPulse
} from 'lucide-react';

export default function ChildCarePage() {
  const { t } = useTranslation();

  const vaccines = [
    { age: 'At Birth', name: 'BCG, OPV-0, Hepatitis B-Birth dose', status: 'Administered', date: 'Hospital Record' },
    { age: '6 Weeks', name: 'OPV-1, Pentavalent-1, Rotavirus-1, PCV-1', status: 'Administered', date: 'PHC Centre' },
    { age: '10 Weeks', name: 'OPV-2, Pentavalent-2, Rotavirus-2', status: 'Administered', date: 'Sub-Centre Nigdale' },
    { age: '14 Weeks', name: 'OPV-3, Pentavalent-3, Rotavirus-3, PCV-2, fIPV-1', status: 'Upcoming', date: 'Next due' },
    { age: '9-12 Months', name: 'MR-1 (Measles & Rubella), JE-1, PCV Booster, Vitamin A', status: 'Pending', date: 'Due late 2026' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/patient"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Baby className="w-6 h-6 text-amber-600" />
            {t('nav.childCare')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Universal Immunization Programme (UIP) & Poshan Tracker
          </p>
        </div>
      </div>

      {/* Vaccine Card */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              National Immunization Schedule (NIS)
            </h2>
            <p className="text-xs text-slate-500">
              Protects children against 12 life-threatening vaccine-preventable diseases.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            Protected
          </span>
        </div>

        <div className="space-y-3">
          {vaccines.map((v, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                v.status === 'Administered'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : v.status === 'Upcoming'
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {v.status === 'Administered' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200/80 text-slate-800 text-[10px] font-bold rounded uppercase">
                      {v.age}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{v.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {v.date}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                v.status === 'Administered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : v.status === 'Upcoming'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {v.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Poshan Growth & Malnutrition Monitoring */}
      <div className="rural-card p-5 sm:p-6 space-y-4 bg-ruralTeal-50/40 border-ruralTeal-200">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-ruralTeal-700" />
          Growth & Nutrition Monitoring (Poshan Abhiyaan)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Frontline ASHA and Anganwadi workers measure height, weight, and Mid-Upper Arm Circumference (MUAC) tape monthly to screen for Severe Acute Malnutrition (SAM).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Growth Curve</span>
            <div className="text-sm font-bold text-emerald-600 mt-1">Normal (Green Zone)</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Weight for Age</span>
            <div className="text-sm font-bold text-slate-800 mt-1">Appropriate</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Next Anganwadi Weighing</span>
            <div className="text-sm font-bold text-slate-800 mt-1">22 Sep 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
