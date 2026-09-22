import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest } from '../../services/apiClient';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowLeft,
  Save,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TriagePage() {
  const { t } = useTranslation();
  const { queueRecord } = useOffline();
  const { currentUser, patientGender } = useAuth();

  const [vitals, setVitals] = useState({
    systolicBp: '120',
    diastolicBp: '80',
    pulseRate: '75',
    temperature: '98.6',
    spO2: '98',
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const symptomList = [
    { id: 'fever', label: 'High Fever (>100°F) / थंडी वाजून ताप' },
    { id: 'cough', label: 'Cough or Cold / खोकला किंवा सर्दी' },
    { id: 'breathing', label: 'Difficulty Breathing / श्वास घेण्यास त्रास' },
    { id: 'chest_pain', label: 'Chest Pain or Heaviness / छातीत दुखणे' },
    { id: 'headache', label: 'Severe Persistent Headache / तीव्र डोकेदुखी' },
    { id: 'dizziness', label: 'Dizziness or Weakness / चक्कर किंवा अशक्तपणा' },
    { id: 'swelling', label: 'Swelling in Feet/Face (Maternal Flag) / पायावर सूज' },
    { id: 'vomiting', label: 'Persistent Vomiting or Diarrhea / सतत उलट्या किंवा जुलाब' }
  ];

  const handleToggleSymptom = (label) => {
    setSelectedSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setIsEvaluating(true);

    const payload = {
      vitals: {
        systolicBp: Number(vitals.systolicBp),
        diastolicBp: Number(vitals.diastolicBp),
        pulseRate: Number(vitals.pulseRate),
        temperature: Number(vitals.temperature),
        spO2: Number(vitals.spO2),
      },
      symptoms: selectedSymptoms,
      context: {
        isPregnant: patientGender === 'female' && currentUser?.isPregnant,
        patientName: currentUser?.fullName
      }
    };

    try {
      const response = await apiRequest('/triage/assess', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response && response.data) {
        setAssessmentResult(response.data);
      }
    } catch (err) {
      console.error('Triage assessment error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveAssessment = async () => {
    if (!assessmentResult) return;

    await queueRecord('TRIAGE_RECORD', {
      patientId: currentUser?.id,
      patientName: currentUser?.fullName,
      vitals,
      symptoms: selectedSymptoms,
      priority: assessmentResult.priority,
      message: assessmentResult.message,
      recordedAt: new Date().toISOString()
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
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
            <Stethoscope className="w-6 h-6 text-ruralTeal-700" />
            {t('triage.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentUser?.fullName} ({currentUser?.village || 'Rural Health Post'})
          </p>
        </div>
      </div>

      {/* ICMR Clinical Disclaimer Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          {t('triage.disclaimer')}
        </p>
      </div>

      {/* Vitals Form */}
      <form onSubmit={handleEvaluate} className="rural-card p-5 sm:p-6 space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          {t('triage.vitalsSection')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Blood Pressure */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('triage.bpLabel')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={vitals.systolicBp}
                onChange={(e) => setVitals({ ...vitals, systolicBp: e.target.value })}
                placeholder="120"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-ruralTeal-500 focus:outline-none text-sm font-semibold"
                required
              />
              <span className="text-slate-400 font-bold">/</span>
              <input
                type="number"
                value={vitals.diastolicBp}
                onChange={(e) => setVitals({ ...vitals, diastolicBp: e.target.value })}
                placeholder="80"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-ruralTeal-500 focus:outline-none text-sm font-semibold"
                required
              />
              <span className="text-xs text-slate-500 font-medium shrink-0">mmHg</span>
            </div>
          </div>

          {/* SpO2 Oxygen */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('triage.spo2Label')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="50"
                max="100"
                value={vitals.spO2}
                onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                placeholder="98"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-ruralTeal-500 focus:outline-none text-sm font-semibold"
                required
              />
              <span className="text-xs text-slate-500 font-medium shrink-0">%</span>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('triage.tempLabel')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                placeholder="98.6"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-ruralTeal-500 focus:outline-none text-sm font-semibold"
                required
              />
              <span className="text-xs text-slate-500 font-medium shrink-0">°F</span>
            </div>
          </div>

          {/* Pulse Rate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('triage.pulseLabel')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={vitals.pulseRate}
                onChange={(e) => setVitals({ ...vitals, pulseRate: e.target.value })}
                placeholder="75"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-ruralTeal-500 focus:outline-none text-sm font-semibold"
                required
              />
              <span className="text-xs text-slate-500 font-medium shrink-0">BPM</span>
            </div>
          </div>
        </div>

        {/* Symptoms Checklist */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {t('triage.symptomsLabel')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {symptomList.map((s) => {
              const checked = selectedSymptoms.includes(s.label);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleToggleSymptom(s.label)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    checked
                      ? 'bg-ruralTeal-50 border-ruralTeal-500 text-ruralTeal-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.label}</span>
                  {checked && <Check className="w-4 h-4 text-ruralTeal-700 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isEvaluating}
          className="w-full py-3.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white font-bold rounded-xl shadow-sm text-sm transition-colors flex items-center justify-center gap-2 touch-target"
        >
          <Stethoscope className="w-5 h-5" />
          {isEvaluating ? t('common.loading') : t('triage.calculateBtn')}
        </button>
      </form>

      {/* Assessment Output Display */}
      {assessmentResult && (
        <div className={`rural-card p-5 sm:p-6 border-2 transition-all animate-in slide-in-from-bottom-2 ${
          assessmentResult.priority === 'RED'
            ? 'border-red-500 bg-red-50/50'
            : assessmentResult.priority === 'YELLOW'
            ? 'border-amber-500 bg-amber-50/50'
            : 'border-emerald-500 bg-emerald-50/50'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {assessmentResult.priority === 'RED' && (
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              )}
              {assessmentResult.priority === 'YELLOW' && (
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7" />
                </div>
              )}
              {assessmentResult.priority === 'GREEN' && (
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}

              <div>
                <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full uppercase tracking-wider ${
                  assessmentResult.priority === 'RED'
                    ? 'bg-red-200 text-red-900'
                    : assessmentResult.priority === 'YELLOW'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}>
                  Priority: {assessmentResult.priority}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {assessmentResult.priority === 'RED'
                    ? t('triage.redAlert')
                    : assessmentResult.priority === 'YELLOW'
                    ? t('triage.yellowAlert')
                    : t('triage.greenAlert')}
                </h3>
              </div>
            </div>

            <button
              onClick={handleSaveAssessment}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Save className="w-4 h-4 text-ruralTeal-700" />
              {savedSuccess ? 'Saved to Vault!' : t('common.save')}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 mt-4 leading-relaxed font-medium bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
            {assessmentResult.message}
          </p>

          {assessmentResult.redFlags && assessmentResult.redFlags.length > 0 && (
            <div className="mt-3 space-y-1">
              <span className="text-xs font-bold text-red-900 uppercase">Alert Triggers:</span>
              <ul className="list-disc list-inside text-xs text-red-800 space-y-0.5">
                {assessmentResult.redFlags.map((rf, idx) => (
                  <li key={idx}>{rf}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
