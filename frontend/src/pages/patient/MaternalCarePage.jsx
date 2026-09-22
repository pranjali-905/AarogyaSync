import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  ArrowLeft, 
  Calendar, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Package,
  Award
} from 'lucide-react';

export default function MaternalCarePage() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

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
            <HeartHandshake className="w-6 h-6 text-rose-600" />
            {t('nav.maternalCare')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) • {currentUser?.fullName}
          </p>
        </div>
      </div>

      {/* Overview Status Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-700 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 bg-rose-400/50 rounded-full">
            Trimester 3 (28 Weeks)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1.5">
            Expected Date of Delivery: 06 Dec 2026
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1">
            Assigned ASHA: {currentUser?.assignedAsha?.name || 'Sunita Tai'} ({currentUser?.assignedAsha?.phone || '+91-9822005566'})
          </p>
        </div>

        <a
          href="tel:+919822005566"
          className="self-start sm:self-auto px-4 py-2.5 bg-white text-rose-800 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-rose-50 transition-colors flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4 text-rose-600" />
          {t('common.callAsha')}
        </a>
      </div>

      {/* ANC Visit Timeline Card */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
          <span>Antenatal Care (ANC) Visits Schedule</span>
          <span className="text-xs text-slate-500 font-normal">Standard 4-visit protocol</span>
        </h3>

        <div className="space-y-3">
          {currentUser?.ancVisits?.map((visit, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                visit.status === 'Completed'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {visit.status === 'Completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{visit.visit}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {visit.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Pressure</span>
                  <span className="font-semibold text-slate-800">{visit.bp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight</span>
                  <span className="font-semibold text-slate-800">{visit.weight}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hemoglobin (Hb)</span>
                  <span className="font-semibold text-slate-800">{visit.hb}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                  visit.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {visit.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Iron Folic Acid (IFA) Tablet Tracker */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Iron & Folic Acid (IFA) 180 Tablets Course
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            66% Completed (120/180)
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="bg-emerald-600 h-3 rounded-full" style={{ width: '66%' }}></div>
        </div>
        <p className="text-xs text-slate-500">
          Daily 1 tablet after meals helps prevent maternal anemia and ensures healthy fetal brain and physical development.
        </p>
      </div>

      {/* Institutional Delivery Checklist & JSY Scheme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rural-card p-5 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-ruralTeal-700" />
            Hospital Bag Checklist for Delivery
          </h4>
          <ul className="text-xs text-slate-700 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mother and Child Protection (MCP) Card</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Aadhaar Card & Bank Passbook (for JSY grant)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Clean baby clothes, blankets & sanitizers</span>
            </li>
          </ul>
        </div>

        <div className="rural-card p-5 space-y-3 bg-amber-50/40 border-amber-200">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            Janani Suraksha Yojana (JSY) Benefit
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Institutional delivery at Khed CHC or Bhimashankar PHC entitles the mother to a Direct Benefit Transfer (DBT) of ₹1,400 + ₹600 nutrition assistance.
          </p>
          <div className="text-xs font-bold text-amber-900 bg-amber-100/60 p-2 rounded-lg border border-amber-200">
            Designated Facility: Khed Community Health Centre (24x7 Delivery Room)
          </div>
        </div>
      </div>
    </div>
  );
}
