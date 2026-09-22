import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import useApi from '../../hooks/useApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { 
  Briefcase, 
  ArrowLeft, 
  FileText, 
  Download, 
  Search, 
  Eye, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Upload,
  QrCode,
  X,
  Lock,
  WifiOff,
  Share2,
  FileCheck
} from 'lucide-react';

export default function DigitalBackpackPage() {
  const { currentUser, patientGender } = useAuth();
  const { t } = useTranslation();

  const isMale = (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Prescription');
  const [isUploading, setIsUploading] = useState(false);

  // Live health records from centralized API service
  const {
    data: liveRecords,
    loading,
    error,
    refetch
  } = useApi(apiService.healthRecords.getAll, [], {
    fallbackData: []
  });

  // Consolidated documents across the 6 specific areas
  const allDocuments = [
    // 1. Health Records
    {
      id: 'doc-hr-01',
      title: isMale ? '12-Lead Electrocardiogram (ECG) Tracing Strip' : 'Mother & Child Protection Card (MCP Card)',
      category: 'HEALTH_RECORD',
      categoryLabel: 'Health Record',
      date: isMale ? '2026-05-12' : '2026-04-12',
      issuer: isMale ? 'Khed Community Hospital' : 'Govt. of Maharashtra NHM',
      verified: true,
      size: '920 KB',
      summary: isMale ? 'Baseline cardiac rhythm tracing: Normal sinus rhythm, 74 bpm.' : 'National Health Mission maternal registration and tracking card.',
      tags: ['Government Health Card', 'Verified']
    },
    // 2. Prescriptions
    {
      id: 'doc-rx-01',
      title: isMale ? 'Hypertension Treatment & Refill e-Prescription' : 'Antenatal Nutrition & Medicine e-Prescription',
      category: 'PRESCRIPTION',
      categoryLabel: 'Prescription',
      date: isMale ? '2026-08-10' : '2026-06-25',
      issuer: isMale ? 'Dr. Ramesh Kulkarni (Senior MO)' : 'Dr. Sunita Deshmukh (MCH Officer)',
      verified: true,
      size: '240 KB',
      summary: isMale ? 'Rx: Amlodipine 5mg (1 tab OD), Metformin 500mg (1 tab OD). Review in 30 days.' : 'Rx: Iron & Folic Acid 100mg, Calcium 500mg daily. Low maternal risk.',
      tags: ['Digital e-Rx', 'PHC Dispensary Validated']
    },
    // 3. Reports
    {
      id: 'doc-rep-01',
      title: isMale ? 'Fasting Lipid & Glucose Panel Laboratory Card' : 'Second Trimester Obstetric Ultrasound (USG)',
      category: 'REPORT',
      categoryLabel: 'Lab Report',
      date: isMale ? '2026-08-08' : '2026-06-25',
      issuer: isMale ? 'Khed CHC Pathology Lab' : 'Khed CHC Radiology Ward',
      verified: true,
      size: '510 KB',
      summary: isMale ? 'Fasting Sugar: 112 mg/dL. Total Cholesterol: 194 mg/dL. HbA1c: 5.9%.' : 'Single live fetus, gestational age 18w2d. Normal amniotic fluid index.',
      tags: ['Diagnostic Report', 'Certified Laboratory']
    },
    {
      id: 'doc-rep-02',
      title: isMale ? 'Kidney & Liver Biomarker Profile Report' : 'Complete Blood Count & Hemoglobin (CBC)',
      category: 'REPORT',
      categoryLabel: 'Lab Report',
      date: isMale ? '2026-05-12' : '2026-06-25',
      issuer: isMale ? 'District Hospital Lab' : 'Bhimashankar PHC Lab',
      verified: true,
      size: '480 KB',
      summary: isMale ? 'Serum Creatinine: 0.9 mg/dL. Blood Urea: 24 mg/dL (Normal renal profile).' : 'Hb: 11.2 g/dL (Normal: 11-14). Blood Group: B Positive. Platelets: 240,000.',
      tags: ['Hematology', 'Certified Laboratory']
    },
    // 4. Vaccination Information
    {
      id: 'doc-vac-01',
      title: isMale ? 'Tetanus Prophylaxis Booster Certificate' : 'Tetanus Toxoid (TT-1 & TT-2) Certificate',
      category: 'VACCINATION',
      categoryLabel: 'Vaccination',
      date: isMale ? '2025-11-20' : '2026-05-15',
      issuer: isMale ? 'Khed Health Centre' : 'Nigdale Health Sub-Centre',
      verified: true,
      size: '180 KB',
      summary: isMale ? 'Administered: TT Booster (Batch: TT25E09). Valid for 5 years.' : 'Administered: TT-1 (12-Apr) and TT-2 (15-May). Full maternal protection.',
      tags: ['Universal Immunization', 'NHM Certified']
    },
    // 5. Consultation Records
    {
      id: 'doc-con-01',
      title: isMale ? 'Chronic Hypertension Review Clinical Notes' : '2nd Trimester Antenatal Clinic Consultation Summary',
      category: 'CONSULTATION',
      categoryLabel: 'Consultation',
      date: isMale ? '2026-08-10' : '2026-06-25',
      issuer: isMale ? 'Dr. Ramesh Kulkarni' : 'Dr. Sunita Deshmukh',
      verified: true,
      size: '320 KB',
      summary: isMale ? 'Clinical review completed. Blood pressure stable at 138/88. Advised brisk walking.' : 'Clinical review completed. Fetal growth matches gestational week. No edema.',
      tags: ['Doctor Notes', 'OPD Encounter']
    },
    // 6. Uploaded Documents
    {
      id: 'doc-up-01',
      title: 'Ayushman Bharat Digital Health Card (ABHA ID)',
      category: 'UPLOADED_DOCUMENT',
      categoryLabel: 'Uploaded Document',
      date: '2026-04-10',
      issuer: 'National Health Authority (NHA)',
      verified: true,
      size: '150 KB',
      summary: `Official government digital health identity card. ABHA Number: ${basePatient.abhaId}.`,
      tags: ['Identity Card', 'Encrypted Vault']
    }
  ];

  const combinedDocs = [
    ...(Array.isArray(liveRecords) ? liveRecords.map(r => ({
      id: r.id,
      title: r.doc_title || r.title,
      category: r.doc_type || 'HEALTH_RECORD',
      categoryLabel: r.doc_type || 'Health Record',
      date: r.doc_date || new Date().toISOString().split('T')[0],
      issuer: r.issued_by || 'Primary Health Centre',
      verified: true,
      size: '450 KB',
      summary: r.metadata?.summary || r.doc_title || 'Uploaded clinical health record',
      tags: ['Encrypted Vault', 'ABDM Verified']
    })) : []),
    ...allDocuments
  ];

  const categories = [
    { key: 'ALL', label: t('common.all', 'All Records') },
    { key: 'HEALTH_RECORD', label: t('doctor.medicalRecords', 'Health Records') },
    { key: 'PRESCRIPTION', label: t('prescriptions.title', 'Prescriptions') },
    { key: 'REPORT', label: t('patient.reportsTab', 'Reports') },
    { key: 'VACCINATION', label: t('patient.vaccinationTab', 'Vaccination') },
    { key: 'CONSULTATION', label: t('nav.teleconsultation', 'Consultation') },
    { key: 'UPLOADED_DOCUMENT', label: t('patient.uploadedDocsTab', 'Uploaded Docs') }
  ];

  const filteredDocs = combinedDocs.filter((doc) => {
    const matchesCat = activeCategory === 'ALL' || doc.category === activeCategory;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUploadSubmit = async () => {
    if (!uploadTitle.trim()) return;
    setIsUploading(true);
    try {
      await apiService.healthRecords.create({
        docTitle: uploadTitle.trim(),
        docType: uploadCategory.toUpperCase().replace(/\s+/g, '_'),
        issuedBy: 'Uploaded by Patient'
      });
      setUploadSuccess(true);
      refetch();
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header & ABHA Identity Banner */}
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
              <Briefcase className="w-6 h-6 text-blue-700" />
              {t('patient.backpackTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              ABHA ID: <strong className="font-mono text-slate-700">{basePatient.abhaId}</strong> • Ayushman Bharat Digital Mission (ABDM)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>{t('patient.uploadDoc', 'Upload Document')}</span>
          </button>
        </div>
      </div>

      {/* Security & Offline Availability Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-blue-950">{t('patient.secureLocker', 'Patient-Consented Secure Health Locker')}</h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                {t('patient.abdmCompliant', 'ABDM Compliant')}
              </span>
            </div>
            <p className="text-xs text-blue-900 mt-0.5 leading-relaxed">
              {t('patient.vaultEncryptedNotice', "All records are encrypted and stored in your device's offline vault. You can present these cards at any PHC or during doctor teleconsultations even without internet.")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-blue-800 bg-white/80 px-3 py-1.5 rounded-xl border border-blue-200">
          <WifiOff className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('patient.offlineReadyCount', 'Offline Ready ({count} files)', { count: allDocuments.length })}</span>
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('patient.searchRecordsPlaceholder', 'Search prescriptions, lab tests, vaccine certificates, hospital summaries...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
        </div>

        {/* 6 Tab Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid / List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="rural-card p-12 text-center text-slate-500 text-sm">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No documents found matching "{searchQuery}"</p>
            <p className="text-xs text-slate-400 mt-1">Try switching categories or clearing your search term.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="rural-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rural-card-hover group border border-slate-200/80"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider">
                      {doc.categoryLabel}
                    </span>
                    {doc.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span className="text-xs text-slate-400">• {doc.size}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{doc.summary}</p>
                  
                  <p className="text-xs text-slate-400 flex items-center gap-2 pt-0.5">
                    <span>Issued by: <strong className="text-slate-600">{doc.issuer}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {doc.date}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => alert(`Downloading verified copy of "${doc.title}" with ABHA watermark.`)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                  {selectedDoc.categoryLabel}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedDoc.title}</h2>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Issuing Facility / Officer:</span>
                <span className="font-bold text-slate-800">{selectedDoc.issuer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Record Date:</span>
                <span className="font-bold text-slate-800">{selectedDoc.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">ABHA Health Identifier:</span>
                <span className="font-bold font-mono text-slate-800">{basePatient.abhaId}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Clinical Summary / Remarks:</span>
                <p className="font-medium text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedDoc.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" /> {t('admin.verified', 'Cryptographically signed')}
              </span>
              <span>{t('profile.size', 'Size')}: {selectedDoc.size}</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Offline QR code generated for "${selectedDoc.title}". The doctor can scan this to read the full record.`);
                  setSelectedDoc(null);
                }}
                className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" /> {t('patient.shareWithDoctor', 'Share with Doctor')}
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                {t('common.close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setUploadSuccess(false);
              }}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-700" />
              {t('patient.uploadDoc', 'Upload Medical Record')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('patient.uploadDocDesc', 'Upload past paper prescriptions, blood test slips or ultrasound reports to your encrypted ABHA vault.')}
            </p>

            {uploadSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">{t('patient.uploadSuccess', 'Document Uploaded Successfully!')}</p>
                <p className="text-xs text-emerald-700">{t('patient.uploadSuccessDesc', 'Encrypted and saved to your Digital Backpack offline cache.')}</p>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadSuccess(false);
                  }}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  {t('common.done', 'Done')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('patient.docCategory', 'Document Category')}</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  >
                    <option value="Prescription">{t('prescriptions.title', 'Prescription')}</option>
                    <option value="Lab Diagnostic Report">{t('patient.reportsTab', 'Lab Diagnostic Report')}</option>
                    <option value="Vaccination Certificate">{t('patient.vaccinationTab', 'Vaccination Certificate')}</option>
                    <option value="Hospital Discharge Summary">{t('patient.dischargeSummary', 'Hospital Discharge Summary')}</option>
                    <option value="Government Identity / MCP Card">{t('patient.mcpCard', 'Government Identity / MCP Card')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('patient.docTitle', 'Document Title')}</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Previous PHC Blood Sugar Test"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>

                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">{t('patient.selectPhotoOrPdf', 'Tap to select photo or PDF')}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t('patient.supportedUploadFormats', 'Supports Camera photo capture, JPG, PNG & PDF up to 10 MB')}</p>
                </div>

                <button
                  onClick={handleUploadSubmit}
                  disabled={isUploading || !uploadTitle.trim()}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? t('common.loading', 'Uploading...') : t('patient.confirmSaveBackpack', 'Confirm & Save to Backpack')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
