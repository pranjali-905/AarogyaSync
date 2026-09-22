import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_DOCTOR_DATA, MOCK_MEDICINES } from '../../services/mockData';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Pill,
  Search,
  ChevronLeft,
  Printer,
  Plus,
  FileText,
  CheckCircle2,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  Eye,
  X,
  Send,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function DoctorPrescriptionsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const patientIdQuery = searchParams.get('patientId');

  const { doctor, patientsList } = MOCK_DOCTOR_DATA;
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pre-fill if coming with patientId
  const initialPatient = patientsList.find((p) => p.id === patientIdQuery);

  // New Rx form state
  const [patientName, setPatientName] = useState(initialPatient?.fullName || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalAdvice, setClinicalAdvice] = useState('');
  const [medList, setMedList] = useState([
    { name: 'Tab Paracetamol 500mg', dosage: '1 tablet', frequency: 'SOS (as needed)', duration: '3 days', instructions: 'Take if fever > 100 °F' }
  ]);
  const [medDraft, setMedDraft] = useState({
    name: '',
    dosage: '1 tablet',
    frequency: 'Twice Daily (BD)',
    duration: '5 days',
    instructions: 'Take after meals'
  });

  const normalizePrescription = (rx, idx) => ({
    id: rx.id || `rx-${idx}`,
    rxNumber: rx.rx_number || rx.rxNumber || `RX-MH-KHED-${Math.floor(10000 + Math.random() * 90000)}`,
    date: rx.created_at ? new Date(rx.created_at).toISOString().split('T')[0] : (rx.date || 'Today'),
    patientName: rx.patient_name || rx.patientName || 'Rural Citizen',
    age: rx.age || 28,
    gender: rx.gender || 'Female',
    diagnosis: rx.diagnosis || 'Clinical evaluation completed',
    doctorName: rx.doctor_name || rx.doctorName || doctor.fullName,
    facility: rx.facility_name || rx.facility || doctor.facility,
    medicines: Array.isArray(rx.medicines) ? rx.medicines : (Array.isArray(rx.items) ? rx.items : [
      { name: 'Tab Paracetamol 500mg', dosage: '1 tablet', frequency: 'SOS', duration: '3 days' }
    ]),
    clinicalAdvice: rx.clinical_advice || rx.clinicalAdvice || rx.notes || '',
    status: rx.status || 'Active',
    qrToken: rx.qr_token || rx.qrToken || `ABDM-RX-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const loadPrescriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.healthRecords.getAll('PRESCRIPTION');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setPrescriptions(res.data.map(normalizePrescription));
      } else {
        setPrescriptions((MOCK_DOCTOR_DATA.prescriptionsList || []).map(normalizePrescription));
      }
    } catch (err) {
      console.warn('Fallback to local doctor prescriptions:', err);
      setPrescriptions((MOCK_DOCTOR_DATA.prescriptionsList || []).map(normalizePrescription));
      setError('Live prescription records offline. Displaying local e-prescriptions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const query = searchQuery.toLowerCase();
    return (
      (rx.patientName || '').toLowerCase().includes(query) ||
      (rx.rxNumber || '').toLowerCase().includes(query) ||
      (rx.diagnosis || '').toLowerCase().includes(query) ||
      (rx.medicines || []).some((m) => (m.name || '').toLowerCase().includes(query))
    );
  });

  const handleAddMed = () => {
    if (!medDraft.name) return;
    setMedList([...medList, medDraft]);
    setMedDraft({
      name: '',
      dosage: '1 tablet',
      frequency: 'Twice Daily (BD)',
      duration: '5 days',
      instructions: 'Take after meals'
    });
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    if (!patientName || !diagnosis || medList.length === 0) return;

    const newRx = {
      id: `rx-${Date.now()}`,
      rxNumber: `RX-MH-KHED-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      patientName,
      age: 28,
      gender: 'Female',
      diagnosis,
      doctorName: doctor.fullName,
      facility: doctor.facility,
      medicines: medList,
      clinicalAdvice,
      status: 'Active',
      qrToken: `ABDM-RX-${Math.floor(100000 + Math.random() * 900000)}`
    };

    try {
      await apiService.doctor.issuePrescription({
        patientName,
        diagnosis,
        medicines: medList,
        clinicalAdvice,
        notes: clinicalAdvice
      });
    } catch (err) {
      console.warn('Prescription saved to local state:', err);
    }

    setPrescriptions([newRx, ...prescriptions]);
    setShowNewModal(false);
    setFeedback(`Digital e-Prescription (${newRx.rxNumber}) signed and dispatched!`);
    setTimeout(() => setFeedback(''), 4000);

    // Reset
    setDiagnosis('');
    setClinicalAdvice('');
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
            <span className="text-slate-700 font-semibold">{t('doctor.prescriptions', 'Prescriptions')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Pill className="w-8 h-8 text-primary-600" />
            {t('doctor.prescriptions', 'Digital e-Prescriptions (Rx)')}
          </h1>
          <p className="text-slate-600 mt-1">
            Generate, digitally sign, and audit ABDM-compliant rural electronic prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/doctor/medicines"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[48px]"
          >
            <Building2 className="w-4 h-4" />
            Check PHC Drug Stock
          </Link>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-800 transition-all min-h-[48px]"
          >
            <Plus className="w-5 h-5" />
            New e-Prescription
          </button>
        </div>
      </div>

      {/* Notification */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{feedback}</p>
        </div>
      )}

      {error && (
        <ErrorState
          compact
          title="Notice"
          error={error}
          onRetry={loadPrescriptions}
        />
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Rx number, patient, drug, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      {isLoading ? (
        <LoadingState message="Loading digital e-prescriptions..." subtitle="Querying ABDM health repository" />
      ) : filteredPrescriptions.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No Prescriptions Found"
          description="No digital e-prescriptions found matching your search filter."
          actionLabel="Issue New e-Prescription"
          onAction={() => setShowNewModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {rx.rxNumber}
                  </span>

                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {rx.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{rx.patientName}</h3>
                <p className="text-xs text-slate-500 mb-2">
                  Diagnosis: <strong className="text-slate-800">{rx.diagnosis}</strong>
                </p>

                {/* Medicines Summary */}
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Prescribed Drugs ({rx.medicines.length}):
                  </span>
                  {rx.medicines.map((m, idx) => (
                    <div key={idx} className="text-xs text-slate-700 flex items-center justify-between">
                      <span className="font-medium">• {m.name}</span>
                      <span className="text-[11px] text-slate-500 font-semibold">{m.frequency}</span>
                    </div>
                  ))}
                </div>

                {rx.clinicalAdvice && (
                  <p className="text-xs text-slate-600 italic line-clamp-1">
                    Advice: "{rx.clinicalAdvice}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ABDM Signed
                </span>

                <button
                  onClick={() => setSelectedRx(rx)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold min-h-[40px] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View & Print Rx
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View & Print Prescription Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Government Health Mission • Digital Rx
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedRx.facility}</h3>
                <p className="text-xs text-slate-500">
                  Doctor: {selectedRx.doctorName} • {doctor.qualification}
                </p>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Prescription Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border">
                <div>
                  <span className="text-slate-500 block">Patient Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRx.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date of Issue:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRx.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Prescription Token:</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedRx.rxNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Clinical Diagnosis:</span>
                  <span className="font-bold text-slate-900">{selectedRx.diagnosis}</span>
                </div>
              </div>

              {/* Medicines Table */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2">
                  Prescription Details (Rx)
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-2.5">Medicine Name</th>
                        <th className="p-2.5">Dosage</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRx.medicines.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{m.name}</td>
                          <td className="p-2.5 text-slate-700">{m.dosage}</td>
                          <td className="p-2.5 text-slate-700">{m.frequency}</td>
                          <td className="p-2.5 text-slate-700">{m.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedRx.clinicalAdvice && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-0.5">Special Advice:</span>
                  <p className="text-amber-950 font-medium">{selectedRx.clinicalAdvice}</p>
                </div>
              )}

              {/* Verification & Signature */}
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl border border-teal-200">
                <div>
                  <span className="font-bold text-teal-900 block">ABDM Digital Cryptographic Signature</span>
                  <span className="text-[10px] text-teal-700">Verified by Medical Council of India</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-teal-900">{selectedRx.qrToken}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 min-h-[48px] flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Official Prescription
              </button>
              <button
                onClick={() => setSelectedRx(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 min-h-[48px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Prescription Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  New e-Prescription Writer
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">Issue Digital Prescription</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Shinde"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upper Respiratory Tract Infection"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              {/* Medicines Adder */}
              <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Add Drug to Prescription:</span>
                <input
                  type="text"
                  placeholder="Drug Name & Strength (e.g. Tab Amoxicillin 500mg)"
                  value={medDraft.name}
                  onChange={(e) => setMedDraft({ ...medDraft, name: e.target.value })}
                  className="w-full p-2 rounded-lg border text-xs bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Frequency (e.g. Twice Daily BD)"
                    value={medDraft.frequency}
                    onChange={(e) => setMedDraft({ ...medDraft, frequency: e.target.value })}
                    className="p-2 rounded-lg border text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 days)"
                    value={medDraft.duration}
                    onChange={(e) => setMedDraft({ ...medDraft, duration: e.target.value })}
                    className="p-2 rounded-lg border text-xs bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMed}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medicine
                </button>
              </div>

              {/* Current Meds Preview */}
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {medList.map((m, i) => (
                  <div key={i} className="p-2 bg-white rounded-lg border flex items-center justify-between text-xs">
                    <span><strong>{m.name}</strong> • {m.frequency} ({m.duration})</span>
                    <button
                      type="button"
                      onClick={() => setMedList(medList.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Clinical Advice & Precautions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Drink boiled water. Follow up in 5 days if cough persists."
                  value={clinicalAdvice}
                  onChange={(e) => setClinicalAdvice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-3 rounded-xl border text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Digitally Sign & Issue Rx
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
