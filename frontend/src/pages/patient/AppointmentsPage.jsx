import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE, MOCK_DOCTORS } from '../../services/mockData';
import apiService from '../../services/apiService';
import useApi from '../../hooks/useApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Calendar,
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  Plus,
  FileText,
  User,
  X
} from 'lucide-react';

export default function AppointmentsPage() {
  const { currentUser, patientGender } = useAuth();
  const { t } = useTranslation();

  const isMale = (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(MOCK_DOCTORS[0].id);
  const [appointmentDate, setAppointmentDate] = useState('2026-09-24');
  const [appointmentType, setAppointmentType] = useState('General Consultation');

  // Live appointments from backend API
  const {
    data: appointmentsList,
    loading,
    error,
    refetch
  } = useApi(apiService.appointments.getAll, [], {
    fallbackData: [basePatient.upcomingAppointment]
  });

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError('');

    try {
      const payload = {
        doctorId: selectedDocId,
        appointmentDate,
        timeSlot: '10:30 AM',
        appointmentType: 'IN_PERSON',
        reason: appointmentType
      };

      const res = await apiService.appointments.book(payload);
      if (res && res.success) {
        setBookingSuccess(true);
        refetch();
        setTimeout(() => {
          setBookingSuccess(false);
          setShowBookModal(false);
        }, 1800);
      } else {
        setBookingError(res?.error || 'Failed to book appointment. Please try again.');
      }
    } catch (err) {
      setBookingError(err.message || 'Error occurred while booking appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryAppointment = Array.isArray(appointmentsList) && appointmentsList.length > 0
    ? appointmentsList[0]
    : basePatient.upcomingAppointment;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
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
              <Calendar className="w-6 h-6 text-ruralTeal-700" />
              {t('appointments.title', 'Doctor Appointments & OPD Schedule')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('appointments.subtitle', 'Manage upcoming PHC/CHC visits, OPD tokens & consultation history')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-3.5 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('appointments.bookNew', 'Book Appointment')}</span>
        </button>
      </div>

      {loading && <LoadingState message="Fetching your clinic appointments..." />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {/* Upcoming Confirmed Appointment Card */}
      {primaryAppointment ? (
        <div className="rural-card p-6 border-l-4 border-l-ruralTeal-600 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md uppercase tracking-wider">
                {primaryAppointment.status || 'Confirmed Appointment'}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {primaryAppointment.doctor_name || primaryAppointment.doctorName || 'Medical Officer'}
              </h2>
              <p className="text-xs text-slate-500">
                {primaryAppointment.doctorSpecialty || primaryAppointment.reason || 'General Medicine'}
              </p>
            </div>

            <div className="text-left sm:text-right bg-ruralTeal-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="text-xs text-slate-500 block">Queue Token Number</span>
              <span className="text-2xl font-extrabold text-ruralTeal-700 font-mono">
                #{primaryAppointment.token_number || primaryAppointment.tokenNumber || 'OPD-01'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Date & Time</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {primaryAppointment.appointment_date || primaryAppointment.date || 'Scheduled'} • {primaryAppointment.time_slot || primaryAppointment.time || '10:00 AM'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Facility Location</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {primaryAppointment.facility_name || primaryAppointment.facility || 'Bhimashankar PHC'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Consultation Type</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {primaryAppointment.appointment_type || primaryAppointment.type || 'In-Person Checkup'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Present your ABHA card or token at the OPD desk upon arrival.</span>
            <Link to="/patient/teleconsult" className="font-bold text-ruralTeal-700 hover:text-ruralTeal-800 flex items-center gap-1">
              Switch to Teleconsult <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={t('appointments.noUpcoming', 'No Upcoming Appointments')}
          description={t('appointments.noUpcoming', 'You currently have no pending hospital or OPD appointments scheduled.')}
          actionLabel={t('appointments.bookNew', 'Book OPD Visit')}
          onAction={() => setShowBookModal(true)}
        />
      )}

      {/* Consultation History & Past OPD Encounters */}
      <div className="rural-card p-5 sm:p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-ruralTeal-600" />
          {t('appointments.pastTab', 'Past Consultation History')}
        </h2>

        <div className="space-y-3">
          {basePatient.consultationHistory.map((con) => (
            <div
              key={con.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{con.doctor}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{con.date}</span>
                </div>
                <p className="text-slate-700 font-semibold">{con.reason}</p>
                <p className="text-slate-600">{con.summary}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Link
                  to="/patient/backpack"
                  className="px-3 py-1.5 bg-white text-ruralTeal-700 border border-slate-200 hover:bg-ruralTeal-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> View e-Rx
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowBookModal(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ruralTeal-600" />
              Book Doctor OPD Appointment
            </h2>
            <p className="text-xs text-slate-500">
              Select your preferred doctor, date, and visit reason to generate a guaranteed OPD token.
            </p>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">Appointment Booked Successfully!</p>
                <p className="text-xs text-emerald-700">Token assigned. Added to your healthcare calendar.</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-3 pt-2">
                {bookingError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {bookingError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('appointments.selectDoctor', 'Select Doctor')}</label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    {MOCK_DOCTORS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('appointments.selectDate', 'Preferred Date')}</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('appointments.reasonForVisit', 'Reason for Visit')}</label>
                  <input
                    type="text"
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    placeholder={t('appointments.reasonPlaceholder', 'e.g. Monthly Hypertension Checkup')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? t('common.loading', 'Booking...') : t('appointments.confirmBooking', 'Confirm & Generate Token')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
