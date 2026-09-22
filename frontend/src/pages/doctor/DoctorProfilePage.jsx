import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { apiService } from '../../services/apiService';
import { MOCK_DOCTOR_DATA } from '../../services/mockData';
import {
  User,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Calendar,
  Award,
  ChevronLeft,
  CheckCircle2,
  Edit,
  X,
  FileBadge,
  LogOut
} from 'lucide-react';

export default function DoctorProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [doctor, setDoctor] = useState(MOCK_DOCTOR_DATA.doctor);
  const [showEditModal, setShowEditModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function loadDoctorProfile() {
      try {
        const res = await apiService.doctor.getProfile();
        if (res && res.success && res.data) {
          const d = res.data;
          setDoctor((prev) => ({
            ...prev,
            fullName: d.full_name || d.fullName || prev.fullName,
            phone: d.phone || prev.phone,
            email: d.email || prev.email,
            specialty: d.specialization || d.specialty || prev.specialty,
            registrationNo: d.registration_number || d.registrationNo || prev.registrationNo,
            facility: d.facility_name || d.facility || prev.facility
          }));
        }
      } catch (err) {
        console.warn('Doctor profile fallback to mock data');
      }
    }
    loadDoctorProfile();
  }, []);

  const [formData, setFormData] = useState({
    fullName: doctor.fullName,
    specialty: doctor.specialty,
    phone: doctor.phone,
    email: doctor.email,
    languages: doctor.languages
  });


  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setDoctor({
      ...doctor,
      fullName: formData.fullName,
      specialty: formData.specialty,
      phone: formData.phone,
      email: formData.email,
      languages: formData.languages
    });
    setShowEditModal(false);
    setFeedback('Doctor HPR clinical profile updated successfully!');
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/doctor" className="hover:text-primary-600 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('doctor.dashboardTitle', 'Doctor Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('doctor.profile', 'Doctor Profile')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <User className="w-8 h-8 text-primary-600" />
            {t('doctor.profileTitle', 'Medical Officer ABDM Profile')}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('doctor.profileSubtitle', 'Official Healthcare Professional Registry (HPR) identity, credentials, and digital signature status.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200/90 text-xs font-bold transition-all min-h-[44px] cursor-pointer"
            title={t('common.logout', 'Logout')}
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>{t('common.logout', 'Logout')}</span>
          </button>

          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all min-h-[44px] cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>{t('doctor.editProfile', 'Edit Profile')}</span>
          </button>
        </div>
      </div>

      {/* Feedback message */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-bold text-sm">{feedback}</p>
        </div>
      )}

      {/* 2. Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover banner */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-primary-950 to-teal-950 p-6 flex items-end">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 backdrop-blur-sm">
            {t('doctor.phcNetwork', 'Primary Health Centre / CHC Network')}
          </span>
        </div>

        <div className="p-6 sm:p-8 relative pt-0">
          {/* Avatar overlap */}
          <div className="-mt-14 mb-4 flex items-end justify-between">
            <div className="w-24 h-24 rounded-3xl bg-teal-600 text-white border-4 border-white shadow-xl flex items-center justify-center font-black text-3xl">
              {doctor.avatarInitials || 'RK'}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t('doctor.abdmVerifiedHpr', 'ABDM Verified HPR')}
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <h2 className="text-2xl font-black text-slate-900">{doctor.fullName}</h2>
            <p className="text-sm font-semibold text-primary-700">{doctor.qualification}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              {doctor.designation} • {doctor.facility}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                {t('doctor.hprIdLabel', 'Healthcare Professional Registry (HPR ID)')}
              </span>
              <p className="font-mono font-bold text-slate-900 text-sm">{doctor.hprId}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                {t('doctor.regNoLabel', 'Medical Council Registration No')}
              </span>
              <p className="font-mono font-bold text-slate-900 text-sm">{doctor.registrationNo}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                {t('doctor.specialtyLabel', 'Specialty & Clinical Focus')}
              </span>
              <p className="font-bold text-slate-900">{doctor.specialty}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                {t('doctor.experienceLabel', 'Experience & Service')}
              </span>
              <p className="font-bold text-slate-900">{doctor.experience}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                {t('doctor.emailLabel', 'Official Government Email')}
              </span>
              <p className="font-bold text-slate-900">{doctor.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                {t('doctor.phoneLabel', 'Emergency Hotline Contact')}
              </span>
              <p className="font-bold text-slate-900">{doctor.phone}</p>
            </div>
          </div>

          {/* Cryptographic signature badge */}
          <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-teal-900 block">
                {t('doctor.digitalSigLabel', 'ABDM Digital Cryptographic Signature')}
              </span>
              <span className="text-[11px] text-teal-700">
                {doctor.digitalSignatureStatus}
              </span>
            </div>
            <span className="px-3 py-1 bg-teal-600 text-white text-[11px] font-bold rounded-lg">
              {t('doctor.activeESign', 'Active e-Sign')}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  {t('doctor.updateCredentials', 'Update Credentials')}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{t('doctor.editProfile', 'Edit Doctor Profile')}</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('profile.fullName', 'Full Name & Titles')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('doctor.specialtyLabel', 'Specialty & Clinical Focus')}
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t('profile.phone', 'Contact Phone')}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t('doctor.emailLabel', 'Official Email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl border text-slate-700 text-xs font-bold hover:bg-slate-50 min-h-[48px]"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-600/20 min-h-[48px]"
                >
                  {t('common.save', 'Save Profile Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
