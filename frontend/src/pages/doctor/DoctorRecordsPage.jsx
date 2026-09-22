import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  FileText,
  Search,
  ChevronLeft,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Eye,
  X,
  Printer,
  ShieldCheck,
  Activity,
  Calendar,
  User,
  Plus
} from 'lucide-react';

export default function DoctorRecordsPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState(MOCK_DOCTOR_DATA.medicalRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Records' },
    { id: 'URINALYSIS', label: 'Urinalysis' },
    { id: 'RADIOLOGY', label: 'Radiology / Ultrasound' },
    { id: 'CARDIOLOGY', label: 'Cardiology / ECG' },
    { id: 'BIOCHEMISTRY', label: 'Biochemistry / Glucose' }
  ];

  const filteredRecords = records.filter((rec) => {
    const matchesCategory =
      selectedCategory === 'ALL' || rec.category === selectedCategory;
    const matchesSearch =
      rec.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.findings.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVerifyRecord = (id) => {
    setRecords(
      records.map((r) =>
        r.id === id ? { ...r, status: 'Verified', doctorSigned: true } : r
      )
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord({ ...selectedRecord, status: 'Verified', doctorSigned: true });
    }
    setFeedbackMsg('Report digitally verified with ABDM cryptographic signature!');
    setTimeout(() => setFeedbackMsg(''), 4000);
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
            <span className="text-slate-700 font-semibold">{t('doctor.medicalRecords', 'Medical Records')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            {t('doctor.medicalRecords', 'Medical Records & Lab Reports')}
          </h1>
          <p className="text-slate-600 mt-1">
            Diagnostic pathology results, 12-lead ECG traces, and maternal obstetric ultrasounds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            ABDM FHIR Diagnostic Bundle
          </span>
        </div>
      </div>

      {/* Verification Feedback */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-medium text-sm">{feedbackMsg}</p>
        </div>
      )}

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports, patient, facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] whitespace-nowrap ${
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

      {/* 3. Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {rec.category}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                    rec.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rec.status === 'Verified' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {rec.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 my-1.5">
                <span className="font-semibold text-slate-700">Patient: {rec.patientName}</span>
                <span>•</span>
                <span>{rec.date}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                <Building2 className="w-3.5 h-3.5 text-primary-600" />
                <span>{rec.facility}</span>
              </div>

              {/* Clinical findings snippet */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">
                  Diagnostic Findings:
                </span>
                <p className="line-clamp-2">{rec.findings}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-mono text-slate-400">{rec.id}</span>

              <div className="flex items-center gap-2">
                {!rec.doctorSigned && (
                  <button
                    onClick={() => handleVerifyRecord(rec.id)}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold min-h-[40px]"
                  >
                    Verify & Sign
                  </button>
                )}
                <button
                  onClick={() => setSelectedRecord(rec)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 min-h-[40px]"
                >
                  <Eye className="w-4 h-4" />
                  View Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Report Viewer Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  Diagnostic Laboratory Report
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2 text-xs">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{selectedRecord.patientName}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-xs">
                <span className="text-slate-500">Testing Facility:</span>
                <span className="font-semibold text-slate-800">{selectedRecord.facility}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-xs">
                <span className="text-slate-500">Date Collected:</span>
                <span className="font-semibold text-slate-800">{selectedRecord.date}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-xs">
                <span className="text-slate-500">Clinical Status:</span>
                <span className={`font-bold ${selectedRecord.status === 'Verified' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {selectedRecord.status}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1.5 font-bold uppercase">
                  Pathological Interpretation & Findings:
                </span>
                <div className="p-3 bg-white rounded-xl border text-slate-900 text-xs font-medium leading-relaxed">
                  {selectedRecord.findings}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {!selectedRecord.doctorSigned && (
                <button
                  onClick={() => handleVerifyRecord(selectedRecord.id)}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 min-h-[48px]"
                >
                  Digitally Sign & Verify
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 min-h-[48px]"
              >
                <Printer className="w-4 h-4" />
                Print / Export
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 min-h-[48px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
