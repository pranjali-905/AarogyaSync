import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE } from '../../services/mockData';
import apiService from '../../services/apiService';
import useApi from '../../hooks/useApi';
import {
  HeartPulse,
  ArrowLeft,
  Activity,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  User,
  Stethoscope,
  Eye,
  Download,
  Upload,
  X,
  Printer,
  Pill,
  Scale,
  Droplet,
  FileCheck
} from 'lucide-react';

export default function MyHealthPage() {
  const { currentUser, patientGender, patientType } = useAuth();
  const { t } = useTranslation();

  const isMale = (patientType === 'male') || (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'consultations' | 'reports' | 'prescriptions'
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', category: 'Lab Report', notes: '' });

  // Basic health metrics
  const [vitalsHistory, setVitalsHistory] = useState([
    {
      date: '10 Sep 2026',
      bp: isMale ? '138/88' : '114/74',
      pulse: isMale ? '74' : '78',
      temp: '98.4',
      spO2: '99%',
      extra: isMale ? 'Blood Sugar: 112 mg/dL' : 'Hb: 11.2 g/dL • FHR: 142 bpm',
      loggedBy: 'Sunita Tai (ASHA)'
    },
    {
      date: '25 Aug 2026',
      bp: isMale ? '142/90' : '112/72',
      pulse: isMale ? '76' : '76',
      temp: '98.2',
      spO2: '98%',
      extra: isMale ? 'Blood Sugar: 118 mg/dL' : 'Hb: 11.4 g/dL • FHR: 140 bpm',
      loggedBy: 'PHC Clinic Nurse'
    }
  ]);

  const [newLog, setNewLog] = useState({
    bp: '',
    pulse: '',
    spO2: '',
    sugarOrHb: ''
  });

  // Previous consultations and diagnoses
  const [consultations, setConsultations] = useState(basePatient.consultationHistory || []);

  // Uploaded reports (lab tests, imaging, discharge summaries)
  const [reports, setReports] = useState([
    {
      id: 'rep-01',
      title: isMale ? 'Fasting Lipid & Blood Glucose Panel' : 'Complete Blood Count & Maternal Hemoglobin (CBC)',
      type: 'Lab Report',
      category: 'Diagnostic Lab',
      date: isMale ? '2026-08-08' : '2026-06-25',
      facility: isMale ? 'Khed CHC Pathology Lab' : 'Bhimashankar PHC Lab',
      verified: true,
      summary: isMale
        ? 'Fasting Sugar: 112 mg/dL. Total Cholesterol: 194 mg/dL. HbA1c: 5.9%. Liver & kidney functions within normal clinical ranges.'
        : 'Hemoglobin: 11.2 g/dL (Adequate pregnancy level). Platelets: 240,000 /mcL. Blood Group: B Rh-Positive.',
      doctor: isMale ? 'Dr. Ramesh Kulkarni' : 'Dr. Sunita Deshmukh'
    },
    {
      id: 'rep-02',
      title: isMale ? '12-Lead Electrocardiogram (ECG) Tracing Strip' : 'Second Trimester Obstetric Ultrasound (USG)',
      type: 'Imaging / Diagnostics',
      category: 'Radiology & Imaging',
      date: isMale ? '2026-05-12' : '2026-06-25',
      facility: isMale ? 'Khed CHC Cardiac Unit' : 'Khed CHC Radiology Ward',
      verified: true,
      summary: isMale
        ? 'Normal sinus rhythm, 74 bpm. Normal axis, no acute ST-T wave abnormalities noted.'
        : 'Single active live intrauterine fetus, gestational age 18w2d. Normal fetal heart rate (142 bpm) & clear amniotic fluid index.',
      doctor: isMale ? 'Dr. Ramesh Kulkarni' : 'Dr. Sunita Deshmukh'
    },
    {
      id: 'rep-03',
      title: isMale ? 'Hypertension Outpatient Evaluation & Discharge Summary' : 'Primary Health Centre Antenatal Clinical Summary',
      type: 'Discharge Summary',
      category: 'Hospital Encounters',
      date: isMale ? '2026-04-18' : '2026-04-12',
      facility: isMale ? 'Khed Community Health Centre' : 'Bhimashankar Primary Health Centre',
      verified: true,
      summary: isMale
        ? 'Patient presented with mild morning headaches. Diagnosed with essential hypertension. Initiated on low-dose antihypertensive therapy with dietary salt restriction.'
        : 'Mother registered under Maharashtra NHM. MCP Card issued. Routine IFA and Calcium supplementation initiated.',
      doctor: isMale ? 'Dr. Ramesh Kulkarni' : 'Dr. Sunita Deshmukh'
    }
  ]);

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'rx-01',
      doctor: isMale ? 'Dr. Ramesh Kulkarni (Senior MO)' : 'Dr. Sunita Deshmukh (MCH Officer)',
      facility: isMale ? 'Khed Community Health Centre' : 'Bhimashankar Primary Health Centre',
      date: isMale ? '10 Aug 2026' : '25 Jun 2026',
      diagnosis: isMale ? 'Essential Hypertension (Stage 1)' : 'Normal Intrauterine Pregnancy (Second Trimester)',
      instructions: isMale
        ? 'Take medications daily after meals. Maintain low salt diet. Revisit in 30 days.'
        : 'Take Iron tablet with lemon water or plain water; take Calcium tablet after lunch. Avoid tea/coffee near IFA dose.',
      medicines: isMale
        ? [
            { name: 'Amlodipine', dosage: '5 mg', frequency: 'Once Daily (OD) - Morning', duration: '30 Days' },
            { name: 'Metformin', dosage: '500 mg', frequency: 'Once Daily (OD) - Evening after food', duration: '30 Days' }
          ]
        : [
            { name: 'Iron & Folic Acid (IFA)', dosage: '100 mg elemental iron + 0.5 mg folic acid', frequency: 'Once Daily (OD) - Night after dinner', duration: '180 Days' },
            { name: 'Calcium + Vitamin D3', dosage: '500 mg + 250 IU', frequency: 'Once Daily (OD) - Afternoon after lunch', duration: '180 Days' }
          ]
    }
  ]);

  const handleAddVitals = (e) => {
    e.preventDefault();
    if (!newLog.bp) return;

    setVitalsHistory([
      {
        date: 'Today, Just now',
        bp: newLog.bp,
        pulse: newLog.pulse || '76',
        temp: '98.4',
        spO2: newLog.spO2 || '99%',
        extra: isMale
          ? `Blood Sugar: ${newLog.sugarOrHb || '110'} mg/dL`
          : `Hb: ${newLog.sugarOrHb || '11.2'} g/dL`,
        loggedBy: 'Self Logged'
      },
      ...vitalsHistory
    ]);

    setNewLog({ bp: '', pulse: '', spO2: '', sugarOrHb: '' });
    setShowLogModal(false);
  };

  const handleUploadReport = (e) => {
    e.preventDefault();
    if (!uploadData.title) return;

    const newRep = {
      id: `rep-${Date.now()}`,
      title: uploadData.title,
      type: uploadData.category,
      category: 'Patient Uploaded',
      date: new Date().toLocaleDateString(),
      facility: 'Self Uploaded / Digitized',
      verified: true,
      summary: uploadData.notes || 'Document uploaded and synced with digital health record timeline.',
      doctor: 'Uploaded by Patient'
    };

    setReports([newRep, ...reports]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setUploadData({ title: '', category: 'Lab Report', notes: '' });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-ruralTeal-700" />
              {t('patient.myHealthTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Basic health profile, consultations, uploaded diagnostic reports & prescriptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="px-3.5 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Vitals</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-ruralTeal-700" />
            <span>Upload Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('basic')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'basic'
              ? 'border-ruralTeal-700 text-ruralTeal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          Basic Health Info
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'consultations'
              ? 'border-ruralTeal-700 text-ruralTeal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Consultations & Diagnoses ({consultations.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'reports'
              ? 'border-ruralTeal-700 text-ruralTeal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Uploaded Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'prescriptions'
              ? 'border-ruralTeal-700 text-ruralTeal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4" />
          Prescriptions List ({prescriptions.length})
        </button>
      </div>

      {/* TAB 1: BASIC HEALTH INFORMATION */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Key Health Vitals Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="rural-card p-4 space-y-1 border-l-4 border-l-ruralTeal-600">
              <span className="text-[11px] text-slate-500 font-semibold block">Blood Pressure</span>
              <span className="text-xl font-extrabold text-slate-900 block">{basePatient.healthStatus.vitals.bp}</span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                {isMale ? 'Mild Stage 1 (Controlled)' : 'Normal Pregnancy Range'}
              </span>
            </div>

            <div className="rural-card p-4 space-y-1 border-l-4 border-l-blue-600">
              <span className="text-[11px] text-slate-500 font-semibold block">Oxygen (SpO2)</span>
              <span className="text-xl font-extrabold text-slate-900 block">{basePatient.healthStatus.vitals.spO2}</span>
              <span className="text-[10px] text-emerald-700 font-bold block">Optimal Lung Function</span>
            </div>

            <div className="rural-card p-4 space-y-1 border-l-4 border-l-purple-600">
              <span className="text-[11px] text-slate-500 font-semibold block">
                {isMale ? 'Fasting Glucose' : 'Hemoglobin (Hb)'}
              </span>
              <span className="text-xl font-extrabold text-slate-900 block">
                {isMale ? basePatient.healthStatus.vitals.bloodGlucose : basePatient.healthStatus.vitals.hemoglobin}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                {isMale ? 'Pre-diabetic target' : 'Safe delivery range'}
              </span>
            </div>

            <div className="rural-card p-4 space-y-1 border-l-4 border-l-amber-600">
              <span className="text-[11px] text-slate-500 font-semibold block">Pulse Rate</span>
              <span className="text-xl font-extrabold text-slate-900 block">{basePatient.healthStatus.vitals.pulse}</span>
              <span className="text-[10px] text-slate-500 font-medium block">Regular Rhythm</span>
            </div>
          </div>

          {/* Basic Health Info: Blood Group, Allergies, Chronic, Height/Weight/BMI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Demographic & Physical Metrics */}
            <div className="rural-card p-5 space-y-4 border border-slate-200/80">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <User className="w-4 h-4 text-ruralTeal-700" />
                Physical Metrics & Blood Group
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Droplet className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-semibold">Blood Group</span>
                  </div>
                  <span className="text-base font-extrabold text-slate-900 block">
                    {isMale ? 'O Positive (O+)' : 'B Positive (B+)'}
                  </span>
                  <span className="text-[10px] text-slate-400">Verified via PHC Lab</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Scale className="w-3.5 h-3.5 text-ruralTeal-600" />
                    <span className="font-semibold">Height & Weight</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {isMale ? '172 cm • 68 kg' : '156 cm • 54 kg'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    BMI: <strong>{isMale ? '23.0 (Normal)' : '22.2 (Normal)'}</strong>
                  </span>
                </div>

                <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block font-semibold mb-1">Primary Health Center</span>
                  <p className="font-bold text-slate-800 text-xs">
                    {isMale ? 'Khed Community Health Centre (CHC)' : 'Bhimashankar Primary Health Centre (PHC)'}
                  </p>
                  <p className="text-[11px] text-slate-400">Linked to National Health Mission (NHM)</p>
                </div>
              </div>
            </div>

            {/* Allergies & Chronic Conditions */}
            <div className="rural-card p-5 space-y-4 border border-slate-200/80">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Allergies & Chronic Conditions
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 text-rose-950 space-y-1">
                  <span className="font-bold text-rose-900 block">Documented Drug Allergies:</span>
                  <p className="font-extrabold">{basePatient.medicalHistory.allergies.join(', ')}</p>
                  <p className="text-[11px] text-rose-800">
                    Flagged automatically in all digital prescriptions across Maharashtra health centers.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 block font-bold">Chronic Conditions:</span>
                  <ul className="font-bold text-slate-800 list-disc list-inside">
                    {basePatient.medicalHistory.chronicIllnesses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals History Table */}
          <div className="rural-card p-5 space-y-4 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-ruralTeal-600" />
                Vitals History & Doorstep Logs
              </h2>
              <span className="text-xs text-slate-400">Recorded offline & cloud synced</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Blood Pressure</th>
                    <th className="py-2.5 px-3">Pulse</th>
                    <th className="py-2.5 px-3">SpO2</th>
                    <th className="py-2.5 px-3">Specific Vitals</th>
                    <th className="py-2.5 px-3">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {vitalsHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold">{item.date}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{item.bp} mmHg</td>
                      <td className="py-3 px-3">{item.pulse} bpm</td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">{item.spO2}</td>
                      <td className="py-3 px-3 text-slate-600">{item.extra}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                          {item.loggedBy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PREVIOUS CONSULTATIONS & DIAGNOSES */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Previous Consultations & Diagnoses
              </h2>
              <p className="text-xs text-slate-500">
                Detailed doctor notes, examination summaries & clinical advice
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {consultations.length} Consultations
            </span>
          </div>

          {consultations.length === 0 ? (
            <div className="rural-card p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">{t('patient.noHealthRecords')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No past consultations or medical encounter notes recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((con) => (
                <div
                  key={con.id}
                  className="rural-card p-5 space-y-3 border border-slate-200/80 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ruralTeal-700 bg-ruralTeal-50 px-2 py-0.5 rounded border border-ruralTeal-200 inline-block mb-1">
                        Doctor OPD Consultation
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{con.doctor}</h3>
                      <p className="text-xs text-slate-500">{con.facility || 'Khed Community Health Centre'}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block font-medium">Consultation Date</span>
                      <span className="text-xs font-bold text-slate-800">{con.date}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <span className="text-slate-400 font-bold block">Clinical Diagnosis / Encounter Reason</span>
                    <p className="font-bold text-slate-900 text-sm">{con.reason}</p>
                    <p className="text-slate-700 leading-relaxed">{con.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: UPLOADED REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Diagnostic Reports & Imaging
              </h2>
              <p className="text-xs text-slate-500">
                Blood tests, pathology, radiology scans & discharge summaries. Click any report to view.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Report
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="rural-card p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">{t('patient.noHealthRecords')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No diagnostic test reports or imaging scans uploaded yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="rural-card p-5 space-y-3 border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 uppercase">
                        {rep.type}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{rep.date}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {rep.title}
                    </h3>
                    <p className="text-xs text-slate-500">{rep.facility} • {rep.doctor}</p>

                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{rep.summary}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Laboratory Record
                    </span>

                    {/* CLICKING REPORT OPENS MODAL */}
                    <button
                      type="button"
                      onClick={() => setSelectedDocument(rep)}
                      className="px-3 py-1.5 bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRESCRIPTIONS LIST */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Prescriptions List
              </h2>
              <p className="text-xs text-slate-500">
                Official digital prescriptions issued by government medical officers
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {prescriptions.length} Active Prescriptions
            </span>
          </div>

          {prescriptions.length === 0 ? (
            <div className="rural-card p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">{t('patient.noHealthRecords')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active or past prescription records found.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="rural-card p-6 border border-slate-200/80 space-y-5 shadow-sm bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="px-2.5 py-0.5 bg-ruralTeal-50 text-ruralTeal-800 text-xs font-bold rounded-md uppercase tracking-wider mb-1 inline-block border border-ruralTeal-200">
                        Government e-Prescription
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">{rx.doctor}</h3>
                      <p className="text-xs text-slate-500">{rx.facility}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block font-medium">Prescription Date</span>
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5 sm:justify-end">
                        <Calendar className="w-4 h-4 text-ruralTeal-700" />
                        {rx.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    <span className="text-slate-400 font-bold block">Diagnosis</span>
                    <p className="font-bold text-slate-800 text-sm">{rx.diagnosis}</p>
                  </div>

                  {/* Medicines Table */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2">Prescribed Medicines</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Medicine Name</th>
                            <th className="py-2.5 px-3">Dosage</th>
                            <th className="py-2.5 px-3">Frequency</th>
                            <th className="py-2.5 px-3">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          {rx.medicines.map((med, mIdx) => (
                            <tr key={mIdx} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-bold text-ruralTeal-800">{med.name}</td>
                              <td className="py-2.5 px-3">{med.dosage}</td>
                              <td className="py-2.5 px-3 font-semibold">{med.frequency}</td>
                              <td className="py-2.5 px-3 text-slate-600">{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Doctor Instructions */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-500 font-bold block">Doctor's Clinical Instructions:</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{rx.instructions}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Validated by State Health Mission</span>
                    <button
                      type="button"
                      onClick={() => alert(`Prescription for ${rx.diagnosis} downloaded.`)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download e-Rx
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-ruralTeal-50 text-ruralTeal-800 rounded uppercase">
                  {selectedDocument.type}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedDocument.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedDocument.facility} • {selectedDocument.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Clinical Findings & Summary</span>
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  {selectedDocument.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-slate-600">
                <div>
                  <span className="block text-[11px] text-slate-400">Ordering Physician</span>
                  <span className="font-bold text-slate-800">{selectedDocument.doctor}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Issuing Facility</span>
                  <span className="font-bold text-slate-800">{selectedDocument.facility}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-900 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ayushman Bharat Digital Health Seal • Cryptographically Verified</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Report "${selectedDocument.title}" downloaded as PDF.`);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REPORT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-ruralTeal-700" />
                Upload Health Report
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Report Uploaded & Synced!</h3>
                <p className="text-xs text-slate-500">
                  Your medical document has been safely stored in your health record.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadReport} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document / Test Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chest X-Ray or Lipid Profile"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document Category
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="Lab Report">Diagnostic Lab Report</option>
                    <option value="Imaging / Scans">Imaging / Ultrasound Scans</option>
                    <option value="Discharge Summary">Discharge / Hospital Summary</option>
                    <option value="Vaccination Record">Immunization Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Notes or Doctor's Comments
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Summary of lab values or diagnosis..."
                    value={uploadData.notes}
                    onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    Save & Sync Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* LOG VITALS MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-ruralTeal-600" />
              Log New Vitals Reading
            </h2>
            <p className="text-xs text-slate-500">
              Enter your latest blood pressure, pulse, or sugar reading. This is saved to your health timeline.
            </p>

            <form onSubmit={handleAddVitals} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Blood Pressure (Systolic/Diastolic)</label>
                <input
                  type="text"
                  placeholder="e.g. 120/80"
                  required
                  value={newLog.bp}
                  onChange={(e) => setNewLog({ ...newLog, bp: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pulse (BPM)</label>
                  <input
                    type="number"
                    placeholder="e.g. 74"
                    value={newLog.pulse}
                    onChange={(e) => setNewLog({ ...newLog, pulse: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Oxygen (SpO2 %)</label>
                  <input
                    type="number"
                    placeholder="e.g. 98"
                    value={newLog.spO2}
                    onChange={(e) => setNewLog({ ...newLog, spO2: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isMale ? 'Fasting Blood Sugar (mg/dL)' : 'Hemoglobin (g/dL)'}
                </label>
                <input
                  type="text"
                  placeholder={isMale ? 'e.g. 110' : 'e.g. 11.5'}
                  value={newLog.sugarOrHb}
                  onChange={(e) => setNewLog({ ...newLog, sugarOrHb: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Vitals Log
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
