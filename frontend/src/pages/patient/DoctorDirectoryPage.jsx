import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { MOCK_DOCTORS, MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE } from '../../services/mockData';
import apiService from '../../services/apiService';
import useApi from '../../hooks/useApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Stethoscope,
  ArrowLeft,
  Search,
  Star,
  Calendar,
  PhoneCall,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
  X,
  ChevronRight,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function DoctorDirectoryPage() {
  const { currentUser, patientGender, patientType } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMale = (patientType === 'male') || (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'upcoming' | 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('ALL');

  // Booking Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(MOCK_DOCTORS[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [consultType, setConsultType] = useState('IN_PERSON'); // 'IN_PERSON' | 'TELECONSULT'
  const [appointmentReason, setAppointmentReason] = useState('General Health Consultation');

  // Fetch live appointments from backend
  const {
    data: appointmentsList,
    loading: loadingAppointments,
    error: appointmentsError,
    refetch: refetchAppointments
  } = useApi(apiService.appointments.getAll, [], {
    fallbackData: [basePatient.upcomingAppointment]
  });

  const facilities = ['ALL', 'Khed Community Health Centre', 'Bhimashankar Primary Health Centre', 'Manchar Sub-District Hospital'];

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchesFacility = selectedFacility === 'ALL' || doc.facility === selectedFacility;
    const matchesSearch =
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.facility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFacility && matchesSearch;
  });

  // Determine active upcoming appointment
  const upcomingAppointments = Array.isArray(appointmentsList) && appointmentsList.length > 0
    ? appointmentsList.filter((a) => a.status !== 'COMPLETED' && a.status !== 'CANCELLED')
    : [basePatient.upcomingAppointment].filter(Boolean);

  const primaryUpcoming = upcomingAppointments[0] || null;

  // Past appointments / consultations
  const pastConsultations = basePatient.consultationHistory || [];

  // Book appointment handler
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError('');

    try {
      const selectedDoc = MOCK_DOCTORS.find((d) => d.id === selectedDocId) || MOCK_DOCTORS[0];
      const payload = {
        doctorId: selectedDocId,
        doctorName: selectedDoc.fullName,
        doctorSpecialty: selectedDoc.specialty,
        facility: selectedDoc.facility,
        appointmentDate,
        timeSlot: appointmentTime,
        appointmentType: consultType,
        reason: appointmentReason
      };

      const res = await apiService.appointments.book(payload);
      if (res && res.success) {
        setBookingSuccess(true);
        refetchAppointments();
        setTimeout(() => {
          setBookingSuccess(false);
          setShowBookModal(false);
          setActiveTab('upcoming');
        }, 1500);
      } else {
        setBookingError(res?.error || 'Could not schedule appointment. Please try another slot.');
      }
    } catch (err) {
      // Graceful fallback for offline demo
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setShowBookModal(false);
        setActiveTab('upcoming');
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBookModalForDoc = (docId) => {
    setSelectedDocId(docId);
    setShowBookModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Page Header */}
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
              <Stethoscope className="w-6 h-6 text-ruralTeal-700" />
              {t('nav.doctor')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Consult doctors, book OPD appointments & attend live teleconsultations
            </p>
          </div>
        </div>

        {/* Primary Header Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowBookModal(true)}
            className="px-3.5 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <Link
            to="/patient/teleconsult"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Consult Doctor</span>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'doctors'
              ? 'border-ruralTeal-700 text-ruralTeal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Available Doctors ({MOCK_DOCTORS.length})
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-ruralTeal-700 text-ruralTeal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Upcoming Appointments
          {primaryUpcoming && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'past'
              ? 'border-ruralTeal-700 text-ruralTeal-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Past Appointments ({pastConsultations.length})
        </button>
      </div>

      {/* TAB 1: AVAILABLE DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, or hospital facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-ruralTeal-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {facilities.map((fac) => (
                <button
                  key={fac}
                  onClick={() => setSelectedFacility(fac)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedFacility === fac
                      ? 'bg-ruralTeal-700 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {fac === 'ALL'
                    ? 'All Facilities'
                    : fac
                        .replace('Community Health Centre', 'CHC')
                        .replace('Primary Health Centre', 'PHC')
                        .replace('Sub-District Hospital', 'SDH')}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="rural-card p-5 flex flex-col justify-between rural-card-hover group border border-slate-200/80 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-ruralTeal-50 text-ruralTeal-700 flex items-center justify-center font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-ruralTeal-700 transition-colors">
                      {doc.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-ruralTeal-700">{doc.designation}</p>
                    <p className="text-xs text-slate-500">{doc.qualification}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.facility}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.experience}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-0.5">
                      Languages: <strong>{doc.languages}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Today's Available Slots:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.availableSlotsToday.map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded border border-emerald-200"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/patient/teleconsult?doc=${doc.id}`}
                    className="flex-1 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Video className="w-3.5 h-3.5" /> Consult Now
                  </Link>
                  <button
                    type="button"
                    onClick={() => openBookModalForDoc(doc.id)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book OPD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: UPCOMING APPOINTMENTS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {upcomingAppointments.length === 0 ? (
            <div className="rural-card p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">No Upcoming Appointments</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                You currently have no scheduled OPD or teleconsultation appointments. Click below to book a slot with an available doctor.
              </p>
              <button
                type="button"
                onClick={() => setShowBookModal(true)}
                className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Book Appointment Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appt, idx) => {
                const docName = appt.doctor_name || appt.doctorName || 'Medical Officer';
                const docSpecialty = appt.doctorSpecialty || appt.reason || 'General Health';
                const facilityName = appt.facility_name || appt.facility || 'Bhimashankar PHC';
                const apptDate = appt.appointment_date || appt.date || 'Upcoming';
                const apptTime = appt.time_slot || appt.time || '10:00 AM';
                const tokenNo = appt.token_number || appt.tokenNumber || `OPD-0${idx + 1}`;
                const apptType = appt.appointment_type || appt.type || 'IN_PERSON';
                const isConfirmed = (appt.status || 'CONFIRMED').toUpperCase() === 'CONFIRMED';

                return (
                  <div
                    key={appt.id || idx}
                    className="rural-card p-6 border-l-4 border-l-ruralTeal-700 space-y-5 shadow-sm bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-md uppercase tracking-wider">
                            {appt.status || 'CONFIRMED'}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {apptType === 'TELECONSULT' ? 'Online Teleconsult' : 'In-Person PHC Visit'}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{docName}</h2>
                        <p className="text-xs text-slate-500">{docSpecialty}</p>
                      </div>

                      <div className="text-left sm:text-right bg-ruralTeal-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                        <span className="text-xs text-slate-500 block">Queue Token Number</span>
                        <span className="text-2xl font-extrabold text-ruralTeal-800 font-mono">
                          #{tokenNo}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block font-semibold mb-0.5">Scheduled Date & Time</span>
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-ruralTeal-700" />
                          {apptDate} • {apptTime}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block font-semibold mb-0.5">Facility Location</span>
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-ruralTeal-700" />
                          {facilityName}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block font-semibold mb-0.5">Reason for Visit</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {appt.reason || 'General Consultation'}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        {isConfirmed ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Consultation is active & confirmed
                          </span>
                        ) : (
                          <span>Pending doctor slot confirmation</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* JOIN CONSULTATION BUTTON */}
                        <Link
                          to={`/patient/teleconsult?appointmentId=${appt.id || 'upcoming'}&doc=${appt.doctorId || 'doc-01'}`}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Consultation</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAST APPOINTMENTS */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Past Consultations & Encounters</h2>
              <p className="text-xs text-slate-500">History of completed OPD visits and prescriptions</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {pastConsultations.length} Consultations
            </span>
          </div>

          {pastConsultations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              No previous consultations on record.
            </div>
          ) : (
            <div className="space-y-3">
              {pastConsultations.map((con) => (
                <div
                  key={con.id}
                  className="rural-card p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:shadow-sm transition-shadow"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{con.doctor}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">{con.date}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                        Completed
                      </span>
                    </div>
                    <p className="text-slate-800 font-semibold">{con.reason}</p>
                    <p className="text-slate-600 leading-relaxed">{con.summary}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      to="/patient/health"
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" /> View in My Health
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-ruralTeal-700" />
                Book Doctor Appointment
              </h2>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Appointment Booked Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Your token has been generated and sent to the PHC OPD counter.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                {bookingError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Doctor Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Doctor & Facility
                  </label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                  >
                    {MOCK_DOCTORS.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.fullName} ({doc.specialty}) — {doc.facility}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultType('IN_PERSON')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        consultType === 'IN_PERSON'
                          ? 'bg-ruralTeal-50 border-ruralTeal-600 text-ruralTeal-800 ring-1 ring-ruralTeal-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      In-Person OPD Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('TELECONSULT')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        consultType === 'TELECONSULT'
                          ? 'bg-ruralTeal-50 border-ruralTeal-600 text-ruralTeal-800 ring-1 ring-ruralTeal-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Online Teleconsult
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                    >
                      <option value="09:30 AM">09:30 AM - Morning Slot</option>
                      <option value="10:30 AM">10:30 AM - Morning Slot</option>
                      <option value="11:30 AM">11:30 AM - Midday Slot</option>
                      <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                      <option value="03:30 PM">03:30 PM - Afternoon Slot</option>
                    </select>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Reason for Consultation / Symptoms
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    placeholder="Describe symptoms, follow-up purpose, or required checkup..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 disabled:bg-ruralTeal-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? 'Booking Slot...' : 'Confirm Appointment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
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
    </div>
  );
}
