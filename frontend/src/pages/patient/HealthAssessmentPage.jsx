import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Stethoscope,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  PhoneCall,
  Activity,
  Heart,
  Thermometer,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function HealthAssessmentPage() {
  const { currentUser, patientGender } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [basicInfo, setBasicInfo] = useState({
    age: currentUser?.age || 28,
    durationDays: '1-2 days',
    severity: 'Moderate',
    isPregnant: patientGender === 'female'
  });
  const [vitals, setVitals] = useState({
    bpSystolic: '',
    bpDiastolic: '',
    tempFahrenheit: '',
    pulseBpm: '',
    spO2Percent: '',
    bloodSugar: ''
  });
  const [warningSigns, setWarningSigns] = useState({
    severeShortnessOfBreath: false,
    chestPainOrPressure: false,
    uncontrolledBleeding: false,
    confusionOrUnconsciousness: false,
    inabilityToKeepFluidsDown: false,
    highFeverOver103: false
  });

  // Symptoms catalog
  const symptomsCatalog = [
    { id: 'fever', label: 'Fever / Chills', icon: '🌡️' },
    { id: 'cough', label: 'Cough / Cold', icon: '🤧' },
    { id: 'headache', label: 'Severe Headache', icon: '🤕' },
    { id: 'fatigue', label: 'Body Ache & Fatigue', icon: '🥱' },
    { id: 'diarrhea', label: 'Vomiting / Diarrhea', icon: '💧' },
    { id: 'breathless', label: 'Mild Breathlessness', icon: '🫁' },
    { id: 'dizziness', label: 'Dizziness / Weakness', icon: '💫' },
    { id: 'swelling', label: 'Leg / Ankle Swelling', icon: '🦶' },
    { id: 'skinRash', label: 'Skin Rash / Itching', icon: '🩹' },
    { id: 'abdominal', label: 'Abdominal Cramps', icon: '⚡' }
  ];

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleWarningSignToggle = (key) => {
    setWarningSigns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Evaluation logic based on National Health Mission & ICMR rural triage rules
  const evaluateTriage = () => {
    const hasDangerSign = Object.values(warningSigns).some(Boolean);
    const systolic = Number(vitals.bpSystolic);
    const diastolic = Number(vitals.bpDiastolic);
    const spo2 = Number(vitals.spO2Percent);
    const temp = Number(vitals.tempFahrenheit);

    // RED: Urgent Emergency transfer
    if (
      hasDangerSign ||
      (spo2 && spo2 < 93) ||
      (systolic && systolic >= 160) ||
      (diastolic && diastolic >= 100) ||
      (temp && temp >= 103)
    ) {
      return {
        level: 'RED',
        label: 'Urgent Priority (Emergency Transfer Recommended)',
        color: 'rose',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-300',
        textColor: 'text-rose-900',
        actionTitle: 'Immediate Transfer to Nearest Primary / Community Health Centre',
        actionSummary:
          'Critical danger signs or vital parameters require urgent direct medical evaluation. Mobilize local emergency transit immediately.',
        actions: [
          'Call 108 Emergency Ambulance for immediate transport dispatch',
          'Notify local village ASHA worker for emergency coordination',
          'Keep patient hydrated and in a well-ventilated, resting position',
          'Do not administer unprescribed self-medication'
        ],
        emergencyAvailable: true
      };
    }

    // YELLOW: Moderate Risk - Doctor review within 24 hours
    if (
      selectedSymptoms.length >= 3 ||
      basicInfo.severity === 'Severe' ||
      (systolic && systolic >= 140) ||
      (spo2 && spo2 >= 93 && spo2 <= 95) ||
      (temp && temp >= 100.4)
    ) {
      return {
        level: 'YELLOW',
        label: 'Moderate Priority (Medical Officer Review Within 24 Hours)',
        color: 'amber',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
        textColor: 'text-amber-900',
        actionTitle: 'Schedule In-Person PHC Visit or Teleconsultation',
        actionSummary:
          'Symptoms indicate an active health condition that warrants evaluation by a qualified medical officer today or tomorrow morning.',
        actions: [
          'Book a teleconsultation with the PHC Medical Officer',
          'Visit Bhimashankar PHC / Khed CHC during OPD hours (9 AM - 2 PM)',
          'Rest, monitor body temperature and fluid intake',
          'If symptoms worsen, trigger the 108 Emergency SOS button'
        ],
        emergencyAvailable: false
      };
    }

    // GREEN: Routine / Mild Self-care
    return {
      level: 'GREEN',
      label: 'Routine Priority (Home Observation & Supportive Care)',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-900',
      actionTitle: 'Supportive Hydration & Routine Doorstep Follow-up',
      actionSummary:
        'Parameters are currently stable with no warning flags. Continue normal hydration, balanced nutrition, and notify your ASHA worker if symptoms persist.',
      actions: [
        'Maintain oral hydration with clean boiled water, lemon, or ORS',
        'Take adequate rest and consume warm, nutritious meals',
        'Log your vitals again after 24 hours if fever or aches continue',
        'Consult ASHA worker during routine village visits'
      ],
      emergencyAvailable: false
    };
  };

  const triageResult = evaluateTriage();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
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
              <Stethoscope className="w-6 h-6 text-ruralTeal-700" />
              {t('nav.healthAssessment', 'Clinical Health Assessment')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('patient.triageSubtitle', 'Step-by-step ICMR-aligned triage & clinical guidance')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentStep(1);
            setSelectedSymptoms([]);
            setVitals({ bpSystolic: '', bpDiastolic: '', tempFahrenheit: '', pulseBpm: '', spO2Percent: '', bloodSugar: '' });
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> {t('common.reset', 'Reset')}
        </button>
      </div>

      {/* NON-DIAGNOSTIC MANDATORY DISCLAIMER */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <p className="font-bold">{t('triage.disclaimerTitle', 'Medical Decision Support Disclaimer (ICMR & Telemedicine Guidelines):')}</p>
          <p className="leading-relaxed text-amber-900">
            {t('triage.disclaimer', 'This tool is designed to assist frontline triage and symptom prioritization in rural settings. It does not diagnose diseases or replace a formal clinical examination by a licensed medical practitioner. In an acute medical emergency, proceed immediately to the nearest hospital or call 108.')}
          </p>
        </div>
      </div>

      {/* Progress Bar (6 Steps) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Step {currentStep} of 6</span>
          <span className="text-ruralTeal-700">
            {currentStep === 1 && '1. Primary Symptoms'}
            {currentStep === 2 && '2. Basic Details & Duration'}
            {currentStep === 3 && '3. Vital Signs (If Available)'}
            {currentStep === 4 && '4. Danger Warning Signs'}
            {currentStep === 5 && '5. Priority Classification'}
            {currentStep === 6 && '6. Recommended Action'}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-ruralTeal-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: SYMPTOMS */}
      {currentStep === 1 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Select What You Are Experiencing</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tap all symptoms that apply to you or your family member today.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {symptomsCatalog.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-ruralTeal-600 bg-ruralTeal-50/70 shadow-sm ring-2 ring-ruralTeal-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl mb-1.5">{sym.icon}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-ruralTeal-900' : 'text-slate-800'}`}>
                    {sym.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {selectedSymptoms.length} symptom(s) selected
            </span>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={selectedSymptoms.length === 0}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Basic Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BASIC INFORMATION */}
      {currentStep === 2 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Basic Details & Symptom Duration</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Help calibrate the urgency of your situation.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">How long have you had these symptoms?</label>
              <div className="grid grid-cols-3 gap-2.5">
                {['Started Today', '1-3 days', 'More than 4 days'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setBasicInfo({ ...basicInfo, durationDays: dur })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      basicInfo.durationDays === dur
                        ? 'border-ruralTeal-600 bg-ruralTeal-50 text-ruralTeal-900 ring-2 ring-ruralTeal-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Overall Severity</label>
              <div className="grid grid-cols-3 gap-2.5">
                {['Mild (Manageable)', 'Moderate (Troublesome)', 'Severe (Disabling)'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setBasicInfo({ ...basicInfo, severity: sev })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      basicInfo.severity === sev
                        ? 'border-ruralTeal-600 bg-ruralTeal-50 text-ruralTeal-900 ring-2 ring-ruralTeal-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {patientGender === 'female' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-950 block">Are you currently pregnant?</span>
                  <span className="text-[11px] text-rose-800">Enables maternal safety considerations</span>
                </div>
                <input
                  type="checkbox"
                  checked={basicInfo.isPregnant}
                  onChange={(e) => setBasicInfo({ ...basicInfo, isPregnant: e.target.checked })}
                  className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Vitals Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VITALS WHERE AVAILABLE */}
      {currentStep === 3 && (
        <div className="rural-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Vitals Measurements (Optional)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              If you or an ASHA worker measured any vitals today, enter them here. Leave blank if unavailable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Blood Pressure (Systolic / Diastolic)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="120"
                  value={vitals.bpSystolic}
                  onChange={(e) => setVitals({ ...vitals, bpSystolic: e.target.value })}
                  className="w-1/2 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-ruralTeal-500"
                />
                <span className="text-slate-400">/</span>
                <input
                  type="number"
                  placeholder="80"
                  value={vitals.bpDiastolic}
                  onChange={(e) => setVitals({ ...vitals, bpDiastolic: e.target.value })}
                  className="w-1/2 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-ruralTeal-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Target: Under 135/85 mmHg</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Body Temperature (°F)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 98.6"
                value={vitals.tempFahrenheit}
                onChange={(e) => setVitals({ ...vitals, tempFahrenheit: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-ruralTeal-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: 97.8 - 99.0 °F</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Oxygen Saturation (SpO2 %)
              </label>
              <input
                type="number"
                placeholder="e.g. 98"
                value={vitals.spO2Percent}
                onChange={(e) => setVitals({ ...vitals, spO2Percent: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-ruralTeal-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: 95 - 100%</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pulse Rate (BPM)
              </label>
              <input
                type="number"
                placeholder="e.g. 76"
                value={vitals.pulseBpm}
                onChange={(e) => setVitals({ ...vitals, pulseBpm: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-ruralTeal-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: 60 - 100 beats/min</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Next: Warning Signs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RED-FLAG WARNING SIGNS */}
      {currentStep === 4 && (
        <div className="rural-card p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Check for Critical Danger Flags</h2>
              <p className="text-xs text-slate-500">
                Do you or the patient have ANY of the following symptoms right now?
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'severeShortnessOfBreath', label: 'Severe difficulty breathing or gasping for air' },
              { key: 'chestPainOrPressure', label: 'Heavy squeezing chest pain spreading to left arm or jaw' },
              { key: 'uncontrolledBleeding', label: 'Severe or uncontrolled bleeding (including vaginal bleeding)' },
              { key: 'confusionOrUnconsciousness', label: 'Loss of consciousness, extreme confusion or fainting' },
              { key: 'inabilityToKeepFluidsDown', label: 'Inability to keep any liquids down with dry mouth/sunken eyes' },
              { key: 'highFeverOver103', label: 'Extremely high fever (over 103 °F) with stiff neck or convulsions' }
            ].map((item) => (
              <label
                key={item.key}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  warningSigns[item.key]
                    ? 'border-rose-400 bg-rose-50 text-rose-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xs sm:text-sm pr-3">{item.label}</span>
                <input
                  type="checkbox"
                  checked={warningSigns[item.key]}
                  onChange={() => handleWarningSignToggle(item.key)}
                  className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 shrink-0"
                />
              </label>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>Calculate Priority</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PRIORITY CLASSIFICATION */}
      {currentStep === 5 && (
        <div className="rural-card p-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              National Health Mission Triage Classification
            </span>
            <div className={`p-6 rounded-3xl border ${triageResult.bgColor} ${triageResult.borderColor} max-w-md mx-auto`}>
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3">
                {triageResult.level === 'RED' && <AlertTriangle className="w-8 h-8 text-rose-600" />}
                {triageResult.level === 'YELLOW' && <AlertCircle className="w-8 h-8 text-amber-600" />}
                {triageResult.level === 'GREEN' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
              </div>
              <h2 className={`text-xl font-extrabold ${triageResult.textColor}`}>
                {triageResult.label}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Priority Index: <strong>{triageResult.level} CODE</strong>
              </p>
            </div>
          </div>

          {/* Key Evaluation Parameters Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <h3 className="font-bold text-slate-800">Triage Summary Factors:</h3>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>Primary Symptoms logged: {selectedSymptoms.length} symptom(s)</li>
              <li>Reported Duration: {basicInfo.durationDays} • Severity: {basicInfo.severity}</li>
              {vitals.bpSystolic && <li>Blood Pressure: {vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</li>}
              {vitals.spO2Percent && <li>Oxygen Saturation: {vitals.spO2Percent}%</li>}
              {vitals.tempFahrenheit && <li>Temperature: {vitals.tempFahrenheit} °F</li>}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <span>See Recommended Action</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: RECOMMENDED NEXT ACTION */}
      {currentStep === 6 && (
        <div className="rural-card p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${triageResult.bgColor} ${triageResult.textColor}`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${triageResult.bgColor} ${triageResult.textColor}`}>
                Step 6: Recommended Protocol
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {triageResult.actionTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                {triageResult.actionSummary}
              </p>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Immediate Guidance Checklist:
            </h3>
            {triageResult.actions.map((act, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-ruralTeal-600 shrink-0 mt-0.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-3">
            {triageResult.level === 'RED' ? (
              <>
                <a
                  href="tel:108"
                  className="flex-1 min-w-[200px] py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t('emergency.call108Now', 'Call 108 Emergency Ambulance')}</span>
                </a>
                <Link
                  to="/patient/emergency"
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  {t('nav.emergencyHelp', 'Emergency Area')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/patient/teleconsult"
                  className="flex-1 min-w-[200px] py-3 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>{t('patient.connectDoctorBtn', 'Connect with PHC Doctor')}</span>
                </Link>
                <Link
                  to="/patient"
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  {t('common.goToDashboard', 'Return to Dashboard')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
