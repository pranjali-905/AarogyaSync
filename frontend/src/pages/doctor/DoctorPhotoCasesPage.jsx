import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  apiGetPhotoCases,
  apiReviewPhotoCase,
  apiCreatePhotoCase
} from '../../services/apiClient';
import { CLINICAL_PHOTOS, getClinicalPhoto } from '../../services/clinicalPhotos';
import ClinicalWebcamCapture from '../../components/common/ClinicalWebcamCapture';
import {
  Camera,
  Eye,
  X,
  Search,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  MapPin,
  Calendar,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Plus,
  FileCheck,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function DoctorPhotoCasesPage() {
  const { t } = useTranslation();

  const [cases, setCases] = useState(MOCK_DOCTOR_DATA.storeAndForwardCases);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | AWAITING | REVIEWED
  const [rxNotes, setRxNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Zoom & Pan for Inspection
  const [modalZoom, setModalZoom] = useState(1);
  const [modalRotation, setModalRotation] = useState(0);

  // Doctor Direct Clinic Capture Modal
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [captureStep, setCaptureStep] = useState('CAMERA'); // 'CAMERA' | 'DETAILS'
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [newPatientName, setNewPatientName] = useState('');
  const [newCategory, setNewCategory] = useState('DERMATOLOGY');
  const [newUrgency, setNewUrgency] = useState('YELLOW');
  const [newTitle, setNewTitle] = useState('');
  const [newSymptoms, setNewSymptoms] = useState('');

  // Fetch from backend on mount
  useEffect(() => {
    async function loadBackendCases() {
      setIsLoadingBackend(true);
      try {
        const res = await apiGetPhotoCases();
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Normalize backend fields to doctor case structure
          const backendList = res.data.map((item) => ({
            id: item.id,
            patientName: item.patient_name || item.patientName || 'Clinical Patient',
            patientId: item.patient_id || item.patientId || 'p-01',
            age: item.age || 35,
            village: item.village || 'Nigdale',
            category: item.category || 'DERMATOLOGY',
            title: item.title,
            symptoms: item.symptoms,
            urgency: item.urgency || 'YELLOW',
            date: item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent',
            ashaName: item.asha_name || item.submitted_by_name || 'Sunita Tai',
            status: item.status === 'REVIEWED' ? 'Doctor Reviewed' : 'Awaiting Doctor Review',
            doctorNotesDraft: item.doctor_notes || '',
            doctorTreatmentPlan: item.doctor_treatment_plan || '',
            photoUrl: (item.photo_urls && item.photo_urls[0]) || item.photoUrl || getClinicalPhoto(item.category)
          }));

          // Merge backend cases with mock cases, avoiding duplicates
          const seenIds = new Set(backendList.map((b) => b.id));
          const remainingMocks = MOCK_DOCTOR_DATA.storeAndForwardCases.filter((m) => !seenIds.has(m.id));
          setCases([...backendList, ...remainingMocks]);
        }
      } catch (err) {
        console.warn('Backend photo cases fetch note:', err.message);
        // Fallback to rich mock data
      } finally {
        setIsLoadingBackend(false);
      }
    }
    loadBackendCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    const isReviewed = c.status === 'Doctor Reviewed' || c.status === 'REVIEWED';
    if (activeTab === 'AWAITING') return !isReviewed;
    if (activeTab === 'REVIEWED') return isReviewed;
    return true;
  });

  const handleOpenModal = (c) => {
    setSelectedCase(c);
    setRxNotes(c.doctorNotesDraft || '');
    setTreatmentPlan(c.doctorTreatmentPlan || '');
    setModalZoom(1);
    setModalRotation(0);
  };

  // Submit doctor review & assessment to backend
  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    setIsSubmitting(true);
    try {
      // Backend API review call
      await apiReviewPhotoCase(selectedCase.id, {
        doctorNotes: rxNotes,
        doctorTreatmentPlan: treatmentPlan || rxNotes
      });
    } catch (err) {
      console.warn('Backend review call note:', err.message);
    } finally {
      setIsSubmitting(false);
    }

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: 'Doctor Reviewed',
              doctorNotesDraft: rxNotes,
              doctorTreatmentPlan: treatmentPlan
            }
          : c
      )
    );

    setFeedback(`Assessment & e-Prescription signed for ${selectedCase.patientName}! Dispatched to ASHA.`);
    setTimeout(() => setFeedback(''), 5000);
    setSelectedCase(null);
  };

  // Handle direct doctor clinical capture
  const handlePhotoCapturedByDoctor = (photoData) => {
    setCapturedPhotoUrl(photoData);
    setCaptureStep('DETAILS');
  };

  const handleSubmitDoctorCase = async (e) => {
    e.preventDefault();
    if (!newPatientName || !newTitle || !newSymptoms) return;

    const caseId = `pc-doc-${Date.now()}`;
    const newCasePayload = {
      patientId: `usr-pat-${Date.now().toString(36)}`,
      patientName: newPatientName,
      category: newCategory,
      urgency: newUrgency,
      title: newTitle,
      symptoms: newSymptoms,
      photoUrls: [capturedPhotoUrl || getClinicalPhoto(newCategory)],
      status: 'PENDING_REVIEW'
    };

    setIsSubmitting(true);
    try {
      await apiCreatePhotoCase(newCasePayload);
    } catch (err) {
      console.warn('Doctor case create API note:', err.message);
    } finally {
      setIsSubmitting(false);
    }

    const createdRecord = {
      id: caseId,
      patientName: newPatientName,
      patientId: newCasePayload.patientId,
      age: 40,
      village: 'Khed CHC Walk-In',
      category: newCategory,
      title: newTitle,
      symptoms: newSymptoms,
      urgency: newUrgency,
      date: 'Just Now',
      ashaName: 'Direct Clinical MO Capture',
      status: 'Awaiting Doctor Review',
      doctorNotesDraft: '',
      photoUrl: capturedPhotoUrl || getClinicalPhoto(newCategory)
    };

    setCases([createdRecord, ...cases]);
    setShowCaptureModal(false);
    setCaptureStep('CAMERA');
    setCapturedPhotoUrl(null);
    setNewPatientName('');
    setNewTitle('');
    setNewSymptoms('');

    setFeedback(`Clinical case for ${newPatientName} successfully captured and added to review queue!`);
    setTimeout(() => setFeedback(''), 5000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/doctor" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('doctor.dashboardTitle', 'Doctor Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('doctor.photoCases', 'Photo Cases')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Camera className="w-8 h-8 text-primary-600" />
            Clinical Photo Review Console
          </h1>
          <p className="text-slate-600 mt-1">
            Visual assessment of dermatological eruptions, agricultural eye trauma, wounds, and burns captured by ASHA workers.
          </p>
        </div>

        {/* Top Actions: Direct Capture & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Direct MO Capture with Webcam button */}
          <button
            onClick={() => {
              setCapturedPhotoUrl(null);
              setCaptureStep('CAMERA');
              setShowCaptureModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-teal-700 hover:from-primary-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-primary-600/20 transition min-h-[42px]"
          >
            <Camera className="w-4 h-4" />
            <span>Capture with Webcam</span>
          </button>

          {/* Tab Filters */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Photos ({cases.length})
            </button>
            <button
              onClick={() => setActiveTab('AWAITING')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'AWAITING'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              Awaiting ({cases.filter((c) => c.status !== 'Doctor Reviewed' && c.status !== 'REVIEWED').length})
            </button>
            <button
              onClick={() => setActiveTab('REVIEWED')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'REVIEWED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Reviewed ({cases.filter((c) => c.status === 'Doctor Reviewed' || c.status === 'REVIEWED').length})
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{feedback}</p>
        </div>
      )}

      {/* 2. Photo Cases Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((c) => {
          const isRed = c.urgency === 'RED';
          const isReviewed = c.status === 'Doctor Reviewed' || c.status === 'REVIEWED';
          const displayPhoto = c.photoUrl || getClinicalPhoto(c.category);

          return (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Viewer Container */}
                <div
                  onClick={() => handleOpenModal(c)}
                  className="relative h-48 bg-slate-900 overflow-hidden cursor-pointer group flex items-center justify-center border-b border-slate-100"
                >
                  <img
                    src={displayPhoto}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 group-hover:from-slate-950/60 transition-colors" />

                  {/* Urgency Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase shadow-sm ${
                      isRed ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {c.urgency} PRIORITY
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-sm ${
                      isReviewed ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'
                    }`}
                  >
                    {isReviewed ? 'Reviewed' : 'Awaiting Review'}
                  </span>

                  {/* Category Pill & Hover Zoom CTA */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold font-mono tracking-wide bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded-md border border-white/20">
                      {c.category}
                    </span>
                    <span className="text-[11px] font-medium text-teal-300 flex items-center gap-1 group-hover:underline">
                      <ZoomIn className="w-3.5 h-3.5" />
                      Inspect Macro
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{c.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <strong>{c.patientName}</strong> ({c.age}y) • {c.village}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    {c.symptoms}
                  </p>
                  {c.doctorNotesDraft && (
                    <div className="text-[11px] text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-100 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1"><strong>Rx:</strong> {c.doctorNotesDraft}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">ASHA: {c.ashaName}</span>
                <button
                  onClick={() => handleOpenModal(c)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold transition-all min-h-[40px]"
                >
                  <ZoomIn className="w-4 h-4" />
                  Inspect & Rx
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detail, Zoom & Prescription Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scale-in max-h-[92vh] overflow-y-auto border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary-600" />
                  Telemedicine Photo Inspection & Assessment
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedCase.patientName} • {selectedCase.category}
                </h3>
                <p className="text-xs text-slate-500">
                  Case ID: {selectedCase.id} • Village: {selectedCase.village} • ASHA: {selectedCase.ashaName}
                </p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Interactive Photo Inspection Canvas */}
            <div className="relative rounded-2xl bg-slate-950 text-white overflow-hidden border border-slate-800 flex flex-col items-center justify-center min-h-[300px] max-h-[420px]">
              <div className="w-full h-full overflow-hidden flex items-center justify-center">
                <img
                  src={selectedCase.photoUrl || getClinicalPhoto(selectedCase.category)}
                  alt="Clinical Macro"
                  className="max-h-[360px] max-w-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${modalZoom}) rotate(${modalRotation}deg)`
                  }}
                />
              </div>

              {/* Inspection Floating Controls (Zoom, Rotate, Reset) */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur px-2.5 py-1.5 rounded-xl border border-slate-700 shadow-md">
                  <button
                    type="button"
                    onClick={() => setModalZoom((z) => Math.max(1, z - 0.5))}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-200"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-teal-300 font-bold px-1">
                    {modalZoom}x
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalZoom((z) => Math.min(3, z + 0.5))}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-200"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-slate-700 mx-1" />
                  <button
                    type="button"
                    onClick={() => setModalRotation((r) => (r + 90) % 360)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-1 text-xs"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  {(modalZoom > 1 || modalRotation > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setModalZoom(1);
                        setModalRotation(0);
                      }}
                      className="text-[10px] font-bold text-amber-400 hover:underline ml-1"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="pointer-events-auto px-2.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedCase.urgency === 'RED' ? 'bg-red-500' : 'bg-amber-400'
                    }`}
                  />
                  {selectedCase.urgency} PRIORITY
                </div>
              </div>
            </div>

            {/* Reported Field Symptoms */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 font-bold uppercase text-[10px] block tracking-wider">
                Field Worker Observation & Clinical History:
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">{selectedCase.symptoms}</p>
            </div>

            {/* Medical Officer Clinical Rx Form */}
            <form onSubmit={handleSaveAssessment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Clinical Diagnosis & Assessment Notes *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Corneal abrasion with mild chemical conjunctivitis. Slit lamp exam required if symptom persists > 24h."
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Medical Management & Digital e-Prescription (Rx) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Moxifloxacin 0.5% eye drops 1 drop 4 times daily x 5 days. Normal saline eye wash stat. Pad and bandage right eye. Attend CHC OPD tomorrow."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-700 text-white text-xs font-bold shadow-lg shadow-primary-600/20 hover:from-primary-700 hover:to-teal-800 min-h-[48px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Sign & Transmit Rx to ASHA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Doctor Direct Webcam / Clinic Capture Modal */}
      {showCaptureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          {captureStep === 'CAMERA' ? (
            <ClinicalWebcamCapture
              category={newCategory}
              onPhotoCaptured={handlePhotoCapturedByDoctor}
              onCancel={() => setShowCaptureModal(false)}
            />
          ) : (
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-in border border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Patient Case Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attach clinical photo captured via webcam and record diagnostic details
                  </p>
                </div>
                <button
                  onClick={() => setShowCaptureModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Preview Thumbnail */}
              {capturedPhotoUrl && (
                <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
                  <img
                    src={capturedPhotoUrl}
                    alt="Captured Preview"
                    className="h-full w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setCaptureStep('CAMERA')}
                    className="absolute top-2.5 right-2.5 px-3 py-1 bg-slate-900/80 hover:bg-slate-800 text-teal-300 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Retake
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmitDoctorCase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tukaram Patil"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="DERMATOLOGY">Dermatology / Skin</option>
                      <option value="EYE_INJURY">Eye Trauma / Chemical</option>
                      <option value="WOUND_ULCER">Wound / Foot Ulcer</option>
                      <option value="ANIMAL_BITE">Dog / Animal Bite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Urgency *
                    </label>
                    <select
                      value={newUrgency}
                      onChange={(e) => setNewUrgency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="RED">RED - High Priority</option>
                      <option value="YELLOW">YELLOW - Urgent</option>
                      <option value="GREEN">GREEN - Routine</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Case Summary / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep laceration on dorsum of hand from sickle"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Clinical Symptoms & Findings *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe wound edges, active bleeding, nerve or tendon involvement..."
                    value={newSymptoms}
                    onChange={(e) => setNewSymptoms(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCaptureStep('CAMERA')}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[46px]"
                  >
                    Back to Camera
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-700 text-white text-xs font-bold shadow-md shadow-primary-600/20 hover:from-primary-700 hover:to-teal-800 min-h-[46px] flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Save & Add Case
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
