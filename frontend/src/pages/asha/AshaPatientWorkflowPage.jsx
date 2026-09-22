import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { MOCK_ASHA_DATA, MOCK_DOCTORS } from '../../services/mockData';
import {
  Stethoscope,
  ArrowLeft,
  ArrowRight,
  Search,
  User,
  HeartPulse,
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Save,
  RotateCcw,
  Sparkles,
  PhoneCall,
  UserCheck,
  Check,
  Building2,
  FileCheck
} from 'lucide-react';

export default function AshaPatientWorkflowPage() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { queueRecord } = useOffline();

  const [step, setStep] = useState(1);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(MOCK_ASHA_DATA.patientsList[0]);

  // Workflow State
  const [visitContext, setVisitContext] = useState('Routine Doorstep Survey');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [vitals, setVitals] = useState({
    bpSystolic: '120',
    bpDiastolic: '80',
    tempFahrenheit: '98.4',
    pulseBpm: '76',
    spO2Percent: '98',
    bloodSugar: ''
  });
  const [dangerFlags, setDangerFlags] = useState({
    severeBreathingDifficulty: false,
    heavyBleedingOrFluidLeak: false,
    chestPainOrPalpitations: false,
    alteredMentalState: false,
    convulsionsOrHighFever: false
  });
  const [referralOption, setReferralOption] = useState('DOCTOR_REFERRAL'); // or FOLLOW_UP
  const [selectedDoctor, setSelectedDoctor] = useState(MOCK_DOCTORS[0].id);
  const [followupDays, setFollowupDays] = useState('Tomorrow');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [savedRecordId, setSavedRecordId] = useState(null);

  const symptomsList = [
    { id: 'fever', label: 'Fever / Chills', icon: '🌡️' },
    { id: 'cough', label: 'Cough / Cold', icon: '🤧' },
    { id: 'headache', label: 'Severe Headache', icon: '🤕' },
    { id: 'vomiting', label: 'Vomiting / Loose Stools', icon: '💧' },
    { id: 'breathlessness', label: 'Shortness of Breath', icon: '🫁' },
    { id: 'swelling', label: 'Ankle / Facial Swelling', icon: '🦶' },
    { id: 'pain', label: 'Abdominal Pain', icon: '⚡' },
    { id: 'dizziness', label: 'Extreme Weakness / Faintness', icon: '💫' }
  ];

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Evaluate Triage Level
  const calculateTriage = () => {
    const hasDanger = Object.values(dangerFlags).some(Boolean);
    const systolic = Number(vitals.bpSystolic);
    const diastolic = Number(vitals.bpDiastolic);
    const spo2 = Number(vitals.spO2Percent);
    const temp = Number(vitals.tempFahrenheit);

    const isPregnant = Boolean(selectedPatient?.isPregnant || selectedPatient?.maternalStage);

    if (
      hasDanger ||
      (spo2 && spo2 < 93) ||
      (systolic && systolic >= 160) ||
      (diastolic && diastolic >= 100) ||
      (temp && temp >= 103) ||
      (isPregnant && (systolic >= 140 || diastolic >= 90))
    ) {
      return {
        level: 'RED',
        label: isPregnant && (systolic >= 140 || diastolic >= 90)
          ? 'CRITICAL (Suspected Preeclampsia / Urgent Facility Referral)'
          : 'CRITICAL (Urgent Emergency Facility Referral)',
        color: 'rose',
        action: 'Immediate transfer to nearest PHC/CHC. Dispatch 108/102 ambulance.',
        bg: 'bg-rose-50 border-rose-300 text-rose-950'
      };
    }

    if (selectedSymptoms.length >= 2 || (systolic && systolic >= 140) || (spo2 && spo2 >= 93 && spo2 <= 95) || (temp && temp >= 100.4)) {
      return {
        level: 'YELLOW',
        label: 'MODERATE RISK (Doctor Consultation Within 24h)',
        color: 'amber',
        action: 'Schedule PHC Doctor OPD visit or doorstep teleconsultation.',
        bg: 'bg-amber-50 border-amber-300 text-amber-950'
      };
    }

    return {
      level: 'GREEN',
      label: 'STABLE / ROUTINE (Supportive Home Care & Routine Follow-up)',
      color: 'emerald',
      action: 'Maintain hydration and nutrition. Continue routine village monitoring.',
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-950'
    };
  };

  const triage = calculateTriage();

  const handleSaveToOfflineQueue = async () => {
    const checkupPayload = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientPhone: selectedPatient.phone,
      patientAbha: selectedPatient.abhaId,
      village: selectedPatient.village,
      visitContext,
      symptoms: selectedSymptoms,
      vitals,
      dangerFlags,
      triageResult: triage.level,
      referralType: referralOption,
      assignedDoctor: selectedDoctor,
      followupDue: followupDays,
      clinicalNotes,
      recordedByAsha: currentUser?.fullName || 'Sunita Tai',
      recordedAt: new Date().toISOString()
    };

    const queued = await queueRecord('PATIENT_HEALTH_CHECK', checkupPayload);
    setSavedRecordId(queued?.id || 'LOCAL-SYNC-01');
    setStep(10); // Final saved step
  };

  const filteredPatients = MOCK_ASHA_DATA.patientsList.filter((p) =>
    p.fullName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.phone.includes(patientSearch) ||
    p.village.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/asha"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-ruralTeal-700" />
              {t('asha.workflowTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Guided 10-step frontline clinical checkup & offline triage
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setStep(1);
            setSelectedSymptoms([]);
            setClinicalNotes('');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start Over
        </button>
      </div>

      {/* Progress tracker */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Step {step} of 10</span>
          <span className="text-ruralTeal-700">
            {step === 1 && '1. Search / Select Patient'}
            {step === 2 && '2. Patient Profile Summary'}
            {step === 3 && '3. Health Check Context'}
            {step === 4 && '4. Symptoms Checklist'}
            {step === 5 && '5. Vitals Entry'}
            {step === 6 && '6. Digital Health Assessment'}
            {step === 7 && '7. Triage Classification'}
            {step === 8 && '8. Recommended Action'}
            {step === 9 && '9. Doctor Referral / Follow-up'}
            {step === 10 && '10. Record Saved to Vault!'}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-ruralTeal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: SEARCH / SELECT PATIENT */}
      {step === 1 && (
        <div className="rural-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Select or Search Village Patient</h2>
              <p className="text-xs text-slate-500">Pick an existing patient or register a new one offline.</p>
            </div>
            <Link
              to="/asha/register"
              className="px-3 py-1.5 bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-700 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto"
            >
              + Register New Patient
            </Link>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone or village..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-ruralTeal-600"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-ruralTeal-600 bg-ruralTeal-50/70 shadow-xs ring-2 ring-ruralTeal-600/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{p.fullName}</h4>
                      <span className="text-xs text-slate-500">• {p.age} yrs • {p.gender}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                        {p.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{p.details}</p>
                    <p className="text-[11px] text-slate-400">ABHA: {p.abhaId} • Village: {p.village}</p>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    isSelected ? 'bg-ruralTeal-700 border-ruralTeal-700 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Patient Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PATIENT PROFILE SUMMARY */}
      {step === 2 && (
        <div className="rural-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Patient Profile Summary</h2>
              <p className="text-xs text-slate-500">Confirm demographics before starting clinical examination.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              ABHA Verified
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Full Name</span>
              <span className="text-sm font-bold text-slate-900 block">{selectedPatient.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">ABHA Identification Number</span>
              <span className="text-sm font-mono font-bold text-ruralTeal-700 block">{selectedPatient.abhaId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Demographics</span>
              <span className="font-semibold text-slate-800">{selectedPatient.age} years • {selectedPatient.gender.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Village & Assigned Centre</span>
              <span className="font-semibold text-slate-800">{selectedPatient.village} Village • Nigdale Sub-Centre</span>
            </div>
            <div className="sm:col-span-2 pt-1 border-t border-slate-200">
              <span className="text-slate-500 block">Clinical Healthcare Track:</span>
              <p className="font-bold text-slate-800 text-sm">{selectedPatient.details}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Health Check Context</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: HEALTH CHECK CONTEXT */}
      {step === 3 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 3: Reason for Doorstep Visit</h2>
            <p className="text-xs text-slate-500">Select the primary purpose of this health checkup.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'Routine Doorstep Survey', desc: 'General household survey and vitals screening' },
              { id: 'Maternal ANC Checkup', desc: 'Antenatal care, IFA check, edema check' },
              { id: 'Infant Nutrition & Vaccine Recall', desc: 'Growth monitoring and immunization review' },
              { id: 'Acute Illness Complaint', desc: 'Patient experiencing fever, cough or pain' },
              { id: 'Chronic Disease Follow-up', desc: 'Blood pressure or blood glucose re-check' },
              { id: 'Post-Discharge Review', desc: 'Hospital follow-up after delivery or surgery' }
            ].map((ctx) => (
              <button
                key={ctx.id}
                type="button"
                onClick={() => setVisitContext(ctx.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  visitContext === ctx.id
                    ? 'border-ruralTeal-600 bg-ruralTeal-50/70 shadow-xs ring-2 ring-ruralTeal-600/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <h4 className="font-bold text-slate-900 text-sm">{ctx.id}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{ctx.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Record Symptoms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SYMPTOMS CHECKLIST */}
      {step === 4 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 4: Active Symptoms Checklist</h2>
            <p className="text-xs text-slate-500">Tap all symptoms reported by the patient today.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {symptomsList.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-ruralTeal-600 bg-ruralTeal-50/70 shadow-xs ring-2 ring-ruralTeal-600/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{sym.icon}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-ruralTeal-950' : 'text-slate-800'}`}>
                    {sym.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Measure Vitals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: VITALS ENTRY */}
      {step === 5 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 5: Record Patient Vitals</h2>
            <p className="text-xs text-slate-500">Measure with field toolkit (Sphygmomanometer, Thermometer, Pulse Oximeter).</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Blood Pressure (Systolic / Diastolic)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="120"
                  value={vitals.bpSystolic}
                  onChange={(e) => setVitals({ ...vitals, bpSystolic: e.target.value })}
                  className="w-1/2 p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
                <span className="text-slate-400">/</span>
                <input
                  type="number"
                  placeholder="80"
                  value={vitals.bpDiastolic}
                  onChange={(e) => setVitals({ ...vitals, bpDiastolic: e.target.value })}
                  className="w-1/2 p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Oxygen Saturation (SpO2 %)</label>
              <input
                type="number"
                placeholder="98"
                value={vitals.spO2Percent}
                onChange={(e) => setVitals({ ...vitals, spO2Percent: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pulse Rate (BPM)</label>
              <input
                type="number"
                placeholder="76"
                value={vitals.pulseBpm}
                onChange={(e) => setVitals({ ...vitals, pulseBpm: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                placeholder="98.4"
                value={vitals.tempFahrenheit}
                onChange={(e) => setVitals({ ...vitals, tempFahrenheit: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Danger Signs Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: DIGITAL HEALTH ASSESSMENT (DANGER FLAGS) */}
      {step === 6 && (
        <div className="rural-card p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 6: Danger Signs Assessment</h2>
              <p className="text-xs text-slate-500">Check for red-flag emergency symptoms.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'severeBreathingDifficulty', label: 'Severe breathlessness, chest indrawing, gasping' },
              { key: 'heavyBleedingOrFluidLeak', label: 'Vaginal bleeding, fluid leakage, or severe hemorrhage' },
              { key: 'chestPainOrPalpitations', label: 'Heavy retrosternal chest pain spreading to arm/jaw' },
              { key: 'alteredMentalState', label: 'Confusion, unconsciousness, or inability to respond' },
              { key: 'convulsionsOrHighFever', label: 'Convulsions, seizures, or rigid neck with high fever' }
            ].map((flag) => (
              <label
                key={flag.key}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  dangerFlags[flag.key] ? 'bg-rose-50 border-rose-400 font-bold text-rose-950' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-xs sm:text-sm pr-3">{flag.label}</span>
                <input
                  type="checkbox"
                  checked={dangerFlags[flag.key]}
                  onChange={() => setDangerFlags({ ...dangerFlags, [flag.key]: !dangerFlags[flag.key] })}
                  className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
                />
              </label>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(5)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(7)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Calculate Triage Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: TRIAGE CLASSIFICATION */}
      {step === 7 && (
        <div className="rural-card p-6 space-y-5">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              National Health Mission Decision Protocol
            </span>
            <div className={`p-6 rounded-3xl border ${triage.bg} max-w-md mx-auto`}>
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3">
                {triage.level === 'RED' && <AlertTriangle className="w-8 h-8 text-rose-600" />}
                {triage.level === 'YELLOW' && <AlertCircle className="w-8 h-8 text-amber-600" />}
                {triage.level === 'GREEN' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
              </div>
              <h2 className="text-xl font-extrabold">{triage.label}</h2>
              <p className="text-xs text-slate-600 mt-1">{triage.action}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-800">Parameters Logged:</h4>
            <p>Blood Pressure: <strong>{vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</strong> • SpO2: <strong>{vitals.spO2Percent}%</strong></p>
            <p>Pulse: <strong>{vitals.pulseBpm} bpm</strong> • Temp: <strong>{vitals.tempFahrenheit} °F</strong></p>
            <p>Symptoms: <strong>{selectedSymptoms.join(', ') || 'None reported'}</strong></p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(6)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(8)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Recommended Action</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: RECOMMENDED ACTION */}
      {step === 8 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 8: Recommended Next Clinical Action</h2>
            <p className="text-xs text-slate-500">Review action guidelines calibrated for this priority.</p>
          </div>

          <div className="space-y-3">
            {triage.level === 'RED' ? (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-2 text-rose-950">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Urgent Emergency Transfer Required
                </h4>
                <ul className="text-xs list-disc list-inside space-y-1">
                  <li>Call 108 Emergency Ambulance or 102 Janani Shishu Vahan</li>
                  <li>Reassure patient and arrange emergency escort with village panchayat</li>
                  <li>Alert Bhimashankar PHC / Khed CHC emergency ward</li>
                </ul>
              </div>
            ) : triage.level === 'YELLOW' ? (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-amber-950">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Doctor Evaluation Recommended Within 24 Hours
                </h4>
                <ul className="text-xs list-disc list-inside space-y-1">
                  <li>Refer to Dr. Ramesh Kulkarni (Khed CHC) or Dr. Sunita Deshmukh (Bhimashankar PHC)</li>
                  <li>Arrange doorstep teleconsultation if distance or rain prevents travel</li>
                  <li>Schedule next morning doorstep vitals follow-up visit</li>
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-emerald-950">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Stable / Supportive Care Routine
                </h4>
                <ul className="text-xs list-disc list-inside space-y-1">
                  <li>Advise clean boiled drinking water, lemon juice, or ORS</li>
                  <li>Verify compliance with daily Iron & Folic Acid or blood pressure medicines</li>
                  <li>Next routine doorstep follow-up within 7-14 days</li>
                </ul>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(7)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(9)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Referral & Follow-up</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: DOCTOR REFERRAL / FOLLOW-UP */}
      {step === 9 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 9: Doctor Referral & Follow-up Assignment</h2>
            <p className="text-xs text-slate-500">Finalize referral details and schedule follow-up visit.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReferralOption('DOCTOR_REFERRAL')}
                className={`p-3.5 rounded-2xl border text-left font-bold text-xs ${
                  referralOption === 'DOCTOR_REFERRAL'
                    ? 'border-ruralTeal-600 bg-ruralTeal-50 text-ruralTeal-950 ring-2 ring-ruralTeal-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                🏥 Refer to PHC / CHC Doctor
              </button>
              <button
                type="button"
                onClick={() => setReferralOption('FOLLOW_UP')}
                className={`p-3.5 rounded-2xl border text-left font-bold text-xs ${
                  referralOption === 'FOLLOW_UP'
                    ? 'border-ruralTeal-600 bg-ruralTeal-50 text-ruralTeal-950 ring-2 ring-ruralTeal-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                📅 Set Doorstep Follow-up Only
              </button>
            </div>

            {referralOption === 'DOCTOR_REFERRAL' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Medical Officer</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
                >
                  {MOCK_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.specialty} • {d.facility})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ASHA Doorstep Follow-up Due</label>
              <select
                value={followupDays}
                onChange={(e) => setFollowupDays(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
              >
                <option value="Today Evening">Today Evening</option>
                <option value="Tomorrow">Tomorrow Morning</option>
                <option value="In 3 Days">In 3 Days</option>
                <option value="In 7 Days (Routine)">In 7 Days (Routine)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Frontline Clinical Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Advised clean fluid intake, instructed family on danger signs, escorted to PHC."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(8)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSaveToOfflineQueue}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Record to Vault</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 10: RECORD SAVED CONFIRMATION */}
      {step === 10 && (
        <div className="rural-card p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Health Check Record Saved!</h2>
            <p className="text-xs text-slate-600">
              Patient: <strong>{selectedPatient.fullName}</strong> • Priority: <strong>{triage.level}</strong>
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              Encrypted in device IndexedDB vault ({savedRecordId}). Queued for auto-sync upon connectivity.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/asha"
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-all shadow"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => {
                setStep(1);
                setSelectedSymptoms([]);
                setClinicalNotes('');
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Check Next Patient
            </button>
            <Link
              to="/asha/sync"
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
            >
              View Sync Queue
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
