import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE } from '../../services/mockData';
import {
  AlertTriangle,
  ArrowLeft,
  PhoneCall,
  MapPin,
  HeartPulse,
  UserCheck,
  ShieldCheck,
  Clock,
  Compass,
  Building2,
  AlertOctagon,
  Flame,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function EmergencyPage() {
  const { currentUser, patientGender, patientType } = useAuth();
  const { t } = useTranslation();

  const isMale = (patientType === 'male') || (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const nearbyFacilities = [
    {
      name: 'Bhimashankar Primary Health Centre (PHC)',
      type: '24x7 Emergency Delivery & First Aid Station',
      distance: '2.1 km (approx. 7 mins)',
      phone: '+91-2135-245101',
      beds: '6 Emergency Beds • Oxygen Ready',
      doctorOnDuty: 'Dr. Sunita Deshmukh'
    },
    {
      name: 'Khed Community Health Centre (CHC)',
      type: 'Sub-District Trauma & Referral Hospital',
      distance: '8.4 km (approx. 18 mins)',
      phone: '+91-2135-245202',
      beds: '30 Beds • 108 Base Station',
      doctorOnDuty: 'Dr. Ramesh Kulkarni'
    }
  ];

  const firstAidProtocols = [
    {
      title: 'Snakebite Emergency Protocol',
      icon: '🐍',
      badge: 'Do NOT Apply Tourniquet',
      steps: [
        'Keep patient calm, completely still and reassure them to slow venom spread',
        'Immobilize the bitten limb using a broad splint or cloth sling (like a fracture)',
        'Do NOT cut, suck venom, or wash the bite site with chemicals',
        'Immediately call 108 for anti-snake venom (ASV) transport to Khed CHC'
      ]
    },
    {
      title: 'Severe Maternal / Acute Danger Signs',
      icon: '🤰',
      badge: 'Immediate 102 / 108 Call',
      steps: [
        'Vaginal bleeding or acute pelvic pain is an emergency',
        'Severe headache with blurred vision indicates pre-eclampsia',
        'Place patient in left lateral position (lying on left side) to maximize blood flow',
        'Carry MCP Card and ABHA ID directly to Bhimashankar PHC delivery ward'
      ]
    },
    {
      title: 'Agricultural Heat Stroke & Collapse',
      icon: '☀️',
      badge: 'Rapid Cooling Essential',
      steps: [
        'Move person immediately to deep tree shade or well-ventilated porch',
        'Loosen tight clothing and spray body with cool water while fanning vigorously',
        'If conscious, offer sips of cool water with ORS or pinch of salt',
        'If confused or unconscious, tilt head sideways and call 108 ambulance'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
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
            <h1 className="text-xl sm:text-2xl font-bold text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              {t('nav.emergency')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Immediate medical dispatch, nearby government health centres & frontline assistance
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          24x7 Emergency Active
        </span>
      </div>

      {/* 3 CORE ACTIONS - PROMINENT & HIGH-CONTRAST */}
      <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-200 bg-rose-500/30 px-3 py-1 rounded-full border border-rose-400/30 inline-block">
            Government of Maharashtra Emergency Helpline
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            One-Tap Emergency Assistance
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
            Your location (<strong>{basePatient.village} Village</strong>) will be dispatched to the nearest emergency ambulance and community medical team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* ACTION 1: CALL 108 AMBULANCE */}
          <a
            href="tel:108"
            className="p-5 bg-white text-rose-700 hover:bg-rose-50 rounded-2xl font-bold shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center text-center space-y-1.5 ring-4 ring-rose-500/30 cursor-pointer"
          >
            <PhoneCall className="w-8 h-8 text-rose-600 animate-bounce" />
            <span className="text-2xl font-black">108</span>
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
              Call 108 Ambulance
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Free Emergency Transport</span>
          </a>

          {/* ACTION 2: FIND NEAREST HEALTH CENTRE */}
          <a
            href="#nearest-centres"
            className="p-5 bg-rose-800/90 hover:bg-rose-800 text-white border border-rose-400/40 rounded-2xl font-bold shadow transition-transform active:scale-95 flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer"
          >
            <Building2 className="w-8 h-8 text-rose-200" />
            <span className="text-lg font-extrabold">Health Centres</span>
            <span className="text-xs font-bold text-rose-100 uppercase tracking-wide">
              Find Nearest Centre
            </span>
            <span className="text-[10px] text-rose-200/80 font-medium">Bhimashankar (2.1 km)</span>
          </a>

          {/* ACTION 3: CONTACT ASHA WORKER */}
          <a
            href={`tel:${basePatient.assignedAsha.phone}`}
            className="p-5 bg-rose-800/90 hover:bg-rose-800 text-white border border-rose-400/40 rounded-2xl font-bold shadow transition-transform active:scale-95 flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer"
          >
            <UserCheck className="w-8 h-8 text-emerald-300" />
            <span className="text-lg font-extrabold">ASHA Worker</span>
            <span className="text-xs font-bold text-rose-100 uppercase tracking-wide">
              Contact ASHA Worker
            </span>
            <span className="text-[10px] text-emerald-200 font-medium">{basePatient.assignedAsha.name}</span>
          </a>
        </div>
      </div>

      {/* ASSIGNED ASHA WORKER DEDICATED CONTACT CARD */}
      <div className="rural-card p-5 border-l-4 border-l-emerald-600 bg-white shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Frontline Community Health Contact
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {basePatient.assignedAsha.name} (ASHA Worker)
              </h3>
              <p className="text-xs text-slate-500">
                Assigned to {basePatient.village} Village • Doorstep First-Aid & Transit Coordination
              </p>
            </div>
          </div>

          <a
            href={`tel:${basePatient.assignedAsha.phone}`}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow flex items-center gap-2 self-start sm:self-auto active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call ASHA: {basePatient.assignedAsha.phone}</span>
          </a>
        </div>
      </div>

      {/* NEAREST HEALTHCARE FACILITIES */}
      <div id="nearest-centres" className="rural-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-600" />
            Nearest Government Health Centres & Emergency Wards
          </h2>
          <span className="text-xs text-slate-500">
            Calculated from {basePatient.village}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyFacilities.map((fac, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{fac.name}</h3>
                  <p className="text-slate-600 font-medium">{fac.type}</p>
                </div>
                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200 whitespace-nowrap">
                  {fac.distance}
                </span>
              </div>

              <div className="space-y-1 text-slate-600">
                <p>Medical Officer on Duty: <strong>{fac.doctorOnDuty}</strong></p>
                <p>Emergency Capacity: <strong>{fac.beds}</strong></p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={`tel:${fac.phone}`}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Facility Desk
                </a>
                <span className="text-slate-500 font-mono text-[11px]">{fac.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RURAL EMERGENCY FIRST-AID GUIDELINES */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-600" />
          Rural Emergency First-Aid Guidelines
        </h2>

        <div className="space-y-4">
          {firstAidProtocols.map((proto, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{proto.icon}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{proto.title}</h3>
                </div>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">
                  {proto.badge}
                </span>
              </div>

              <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside bg-white p-3 rounded-xl border border-slate-200">
                {proto.steps.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">{step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
