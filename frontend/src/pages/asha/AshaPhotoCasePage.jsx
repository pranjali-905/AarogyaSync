import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { MOCK_ASHA_DATA, MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  apiGetPhotoCases,
  apiCreatePhotoCase
} from '../../services/apiClient';
import { CLINICAL_PHOTOS, getClinicalPhoto } from '../../services/clinicalPhotos';
import ClinicalWebcamCapture from '../../components/common/ClinicalWebcamCapture';
import {
  Camera,
  Upload,
  User,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  FileText,
  Eye,
  ShieldCheck,
  ChevronLeft,
  X,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  ZoomIn,
  RefreshCw
} from 'lucide-react';

export default function AshaPhotoCasePage() {
  const { t } = useTranslation();
  const { isOnline, queueRecord } = useOffline();

  const [cases, setCases] = useState(MOCK_ASHA_DATA.photoCasesList || []);
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [notification, setNotification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Form & Camera state
  const [step, setStep] = useState('DETAILS'); // 'DETAILS' | 'CAMERA'
  const [patientName, setPatientName] = useState('');
  const [category, setCategory] = useState('DERMATOLOGY');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('YELLOW');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Fetch backend cases on mount
  useEffect(() => {
    async function loadCases() {
      setIsLoadingBackend(true);
      try {
        const res = await apiGetPhotoCases();
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map((item) => ({
            id: item.id,
            patientName: item.patient_name || item.patientName || 'Village Patient',
            category: item.category || 'DERMATOLOGY',
            title: item.title,
            description: item.symptoms || item.description,
            urgency: item.urgency || 'YELLOW',
            date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : 'Today',
            doctorNotes: item.doctor_notes || item.doctor_treatment_plan || (item.status === 'REVIEWED' ? 'Reviewed by Medical Officer' : null),
            status: item.status === 'REVIEWED' ? 'Doctor Reviewed' : 'Pending Doctor Review',
            photoUrl: (item.photo_urls && item.photo_urls[0]) || item.photoUrl || getClinicalPhoto(item.category)
          }));

          const seenIds = new Set(formatted.map((f) => f.id));
          const remainingMocks = (MOCK_ASHA_DATA.photoCasesList || []).filter((m) => !seenIds.has(m.id));
          setCases([...formatted, ...remainingMocks]);
        }
      } catch (err) {
        console.warn('ASHA photo cases fetch note:', err.message);
      } finally {
        setIsLoadingBackend(false);
      }
    }
    loadCases();
  }, []);

  // Handle webcam capture confirmation
  const handlePhotoCaptured = (dataUrl) => {
    setPhotoPreview(dataUrl);
    setStep('DETAILS');
  };

  // Submit case
  const handleSubmitCase = async (e) => {
    e.preventDefault();
    if (!patientName || !title || !description) return;

    setIsSubmitting(true);
    const resolvedPhoto = photoPreview || getClinicalPhoto(category);
    const caseId = `photo-${Date.now()}`;

    const newCase = {
      id: caseId,
      patientId: `usr-pat-${Date.now().toString(36)}`,
      patientName,
      category,
      title,
      description,
      symptoms: description,
      urgency,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Doctor Review',
      doctorNotes: 'Awaiting review from PHC Medical Officer',
      photoUrl: resolvedPhoto,
      photoUrls: [resolvedPhoto]
    };

    // 1. If online, send directly to backend
    if (isOnline) {
      try {
        await apiCreatePhotoCase({
          patientId: newCase.patientId,
          patientName: newCase.patientName,
          category: newCase.category,
          title: newCase.title,
          symptoms: newCase.description,
          urgency: newCase.urgency,
          photoUrls: [resolvedPhoto]
        });
      } catch (apiErr) {
        console.warn('Direct API submission note, queuing offline:', apiErr.message);
      }
    }

    // 2. Save offline in IndexedDB for resilient sync
    await queueRecord('PHOTO_CASE', newCase);

    // Also populate doctor queues so newly synced case appears immediately in Doctor persona
    if (MOCK_DOCTOR_DATA?.storeAndForwardCases) {
      MOCK_DOCTOR_DATA.storeAndForwardCases = [
        {
          id: caseId,
          patientName: newCase.patientName,
          patientId: newCase.patientId,
          age: 28,
          village: 'Nigdale',
          category: newCase.category,
          title: newCase.title,
          symptoms: newCase.description,
          urgency: newCase.urgency,
          date: 'Just Now (Synced)',
          ashaName: 'Sunita Tai (ASHA)',
          status: 'Awaiting Doctor Review',
          doctorNotesDraft: '',
          doctorTreatmentPlan: '',
          photoUrl: resolvedPhoto
        },
        ...MOCK_DOCTOR_DATA.storeAndForwardCases
      ];
    }

    if (MOCK_DOCTOR_DATA?.consultationQueue) {
      MOCK_DOCTOR_DATA.consultationQueue = [
        {
          id: `cq-${Date.now()}`,
          patientId: newCase.patientId,
          patientName: newCase.patientName,
          age: 28,
          gender: 'Female',
          village: 'Nigdale',
          abhaId: '91-7788-9900-1122',
          priority: 'YELLOW',
          priorityLabel: 'Moderate (YELLOW)',
          chiefComplaint: `${newCase.title} - ${newCase.description}`,
          vitals: { bp: '120/80', pulse: '76', spO2: '98%', temp: '98.6 °F' },
          source: 'ASHA Offline Sync',
          ashaWorker: 'Sunita Tai (ASHA)',
          waitingTime: 'Just Now',
          timeReceived: 'Just Now',
          type: 'PHOTO_CASE',
          status: 'WAITING',
          notes: `Synced offline store-and-forward case: ${newCase.title}`,
          hasAttachment: true,
          attachmentType: 'CLINICAL_PHOTO'
        },
        ...MOCK_DOCTOR_DATA.consultationQueue
      ];
    }

    setIsSubmitting(false);
    setCases([newCase, ...cases]);
    setShowModal(false);
    setNotification(
      isOnline
        ? 'Clinical photo case transmitted to PHC Medical Officer console!'
        : 'Case stored locally in offline queue. Will sync automatically when network reconnects.'
    );
    setTimeout(() => setNotification(''), 5000);

    // Reset form
    setPatientName('');
    setTitle('');
    setDescription('');
    setPhotoPreview(null);
    setStep('DETAILS');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/asha" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('asha.dashboardTitle', 'ASHA Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('asha.photoCasesTitle', 'Photo Case Sharing')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Camera className="w-8 h-8 text-primary-600" />
            Store-and-Forward Clinical Photo Cases
          </h1>
          <p className="text-slate-600 mt-1">
            Capture skin rashes, eye trauma, or wounds at patient doorstep for rapid asynchronous Medical Officer assessment.
          </p>
        </div>

        <button
          onClick={() => {
            setPhotoPreview(null);
            setStep('DETAILS');
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-700 text-white font-semibold shadow-lg shadow-primary-600/20 hover:from-primary-700 hover:to-teal-800 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          Capture New Photo Case
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <p className="font-medium text-sm">{notification}</p>
        </div>
      )}

      {/* Case Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cases.map((c) => {
          const displayPhoto = c.photoUrl || getClinicalPhoto(c.category);

          return (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Thumbnail Banner */}
                <div
                  onClick={() => setSelectedCase(c)}
                  className="relative h-44 bg-slate-900 cursor-pointer group flex items-center justify-center border-b border-slate-100"
                >
                  <img
                    src={displayPhoto}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* Urgency Badge */}
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${
                      c.urgency === 'RED'
                        ? 'bg-red-600'
                        : c.urgency === 'YELLOW'
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {c.urgency} PRIORITY
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-sm ${
                      c.status === 'Doctor Reviewed'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {c.status}
                  </span>

                  {/* Category Pill */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold font-mono tracking-wide bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded border border-white/20">
                      {c.category}
                    </span>
                    <span className="text-[11px] text-teal-300 flex items-center gap-1 group-hover:underline">
                      <ZoomIn className="w-3.5 h-3.5" />
                      View Image
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-500">
                    Patient: <strong>{c.patientName}</strong> • Date: {c.date}
                  </p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-2">
                    {c.description}
                  </p>

                  {/* Doctor Review Guidance Box */}
                  {c.doctorNotes && (
                    <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs">
                        <MessageSquare className="w-4 h-4 text-teal-600" />
                        Medical Officer Clinical Advice:
                      </div>
                      <p className="text-xs text-teal-950 font-medium">{c.doctorNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Case ID: {c.id}</span>
                <button
                  onClick={() => setSelectedCase(c)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all min-h-[40px]"
                >
                  <Eye className="w-4 h-4" />
                  View Full Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-in max-h-[92vh] overflow-y-auto border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  Store-and-Forward Review
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{selectedCase.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res photo container */}
            <div className="relative rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center max-h-[300px]">
              <img
                src={selectedCase.photoUrl || getClinicalPhoto(selectedCase.category)}
                alt={selectedCase.title}
                className="w-full h-full object-contain max-h-[280px]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{selectedCase.patientName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Urgency Level:</span>
                <span className="font-bold text-red-600">{selectedCase.urgency}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Category:</span>
                <span className="font-medium text-slate-800">{selectedCase.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">ASHA Field Observation:</span>
                <p className="font-medium text-slate-800 bg-white p-2.5 rounded-lg border">
                  {selectedCase.description}
                </p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Doctor's Guidance / Action:</span>
                <p className="font-medium text-teal-900 bg-teal-50 p-2.5 rounded-lg border border-teal-200">
                  {selectedCase.doctorNotes || 'Pending Medical Officer assessment.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCase(null)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 min-h-[48px]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* New Photo Case Modal (with Live Webcam Capture) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          {step === 'CAMERA' ? (
            <ClinicalWebcamCapture
              category={category}
              initialPhoto={photoPreview}
              onPhotoCaptured={handlePhotoCaptured}
              onCancel={() => setStep('DETAILS')}
            />
          ) : (
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto animate-scale-in border border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Capture Clinical Photo Case</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Send high-resolution photo and symptom notes to PHC Medical Officer
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitCase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ganesh Shinde"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                    >
                      <option value="DERMATOLOGY">Dermatology / Skin Rash</option>
                      <option value="EYE_INJURY">Eye Trauma / Chemical Splash</option>
                      <option value="WOUND_ULCER">Wound / Diabetic Foot Ulcer</option>
                      <option value="ANIMAL_BITE">Dog / Snake / Animal Bite</option>
                      <option value="NEONATAL">Neonatal / Infant Condition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Urgency Priority *
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                    >
                      <option value="RED">RED - Immediate Attention (&lt; 2h)</option>
                      <option value="YELLOW">YELLOW - Urgent Review (&lt; 24h)</option>
                      <option value="GREEN">GREEN - Routine Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Case Title / Condition Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Farm chemical splash in right eye with severe redness"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Detailed Symptoms & Onset *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe when symptom started, pain severity, whether area was irrigated with water, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Photo Capture Section with Webcam Button */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Clinical Photo *
                  </label>

                  {photoPreview ? (
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 p-2 text-center">
                      <img
                        src={photoPreview}
                        alt="Case Preview"
                        className="max-h-48 mx-auto rounded-xl object-contain shadow-sm"
                      />
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStep('CAMERA')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Retake / Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-bold"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setStep('CAMERA')}
                      className="border-2 border-dashed border-teal-500/50 bg-teal-50/40 hover:bg-teal-50/80 rounded-2xl p-5 text-center transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-teal-900">
                        Open Live Camera / Webcam or Upload
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Use device webcam for live close-up snapshot or upload file
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 min-h-[48px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-700 text-white text-sm font-bold shadow-md shadow-primary-600/20 hover:from-primary-700 hover:to-teal-800 min-h-[48px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Submit & Queue Photo Case
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
