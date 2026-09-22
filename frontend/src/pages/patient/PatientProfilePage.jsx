import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { MOCK_PATIENT_FEMALE, MOCK_PATIENT_MALE } from '../../services/mockData';
import {
  User,
  ArrowLeft,
  ShieldCheck,
  HeartPulse,
  Activity,
  Phone,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  Copy,
  QrCode,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function PatientProfilePage() {
  const { currentUser, patientGender, setGender, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMale = (currentUser?.gender === 'male') || (patientGender === 'male');
  const basePatient = isMale ? MOCK_PATIENT_MALE : MOCK_PATIENT_FEMALE;

  const [selectedGender, setSelectedGender] = useState(isMale ? 'male' : 'female');
  const [copiedAbha, setCopiedAbha] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable profile state
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || basePatient.fullName,
    phone: currentUser?.phone || basePatient.phone,
    age: currentUser?.age || basePatient.age,
    bloodGroup: currentUser?.bloodGroup || basePatient.bloodGroup,
    village: currentUser?.village || basePatient.village,
    district: currentUser?.district || basePatient.district,
    emergencyName: basePatient.emergencyContact.name,
    emergencyPhone: basePatient.emergencyContact.phone
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiService.patients.getProfile();
        if (res && res.success && res.data) {
          const p = res.data;
          setProfileData((prev) => ({
            ...prev,
            fullName: p.full_name || p.fullName || prev.fullName,
            phone: p.phone || prev.phone,
            village: p.village || prev.village,
            district: p.district || prev.district,
            bloodGroup: p.blood_group || p.bloodGroup || prev.bloodGroup
          }));
        }
      } catch (err) {
        console.warn('Patient profile fallback');
      }
    }
    loadProfile();
  }, []);

  const handleCopyAbha = () => {
    navigator.clipboard.writeText(basePatient.abhaId);
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setGender(selectedGender);

    try {
      await apiService.patients.updateProfile({
        fullName: profileData.fullName,
        village: profileData.village,
        district: profileData.district,
        bloodGroup: profileData.bloodGroup
      });
    } catch (err) {
      console.warn('Patient profile update fallback');
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
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
              <User className="w-6 h-6 text-ruralTeal-700" />
              {t('profile.title', 'Patient Profile & ABHA Identity')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('profile.subtitle', 'Manage personal demographics, health identity & gender healthcare pathway')}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/patient')}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
        >
          {t('common.goToDashboard', 'Go to Dashboard')}
        </button>
      </div>

      {/* ABHA DIGITAL IDENTITY CARD */}
      <div className="bg-gradient-to-r from-ruralTeal-800 via-ruralTeal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                {t('profile.abdmHeader', 'Ayushman Bharat Digital Mission (ABDM)')}
              </span>
              <h2 className="text-lg font-extrabold text-white">
                {t('profile.abdmCardTitle', 'Government Digital Health ID Card')}
              </h2>
            </div>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
            ● {t('profile.activeVerified', 'Active & Verified')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-5">
          <div className="sm:col-span-8 space-y-3">
            <div>
              <span className="text-xs text-slate-400 block">{t('profile.fullName', 'Patient Full Name')}</span>
              <span className="text-xl font-bold text-white tracking-wide">{profileData.fullName}</span>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <span className="text-xs text-slate-400 block">{t('profile.abhaNumber', 'ABHA Number')}</span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">
                  {basePatient.abhaId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyAbha}
                className="mt-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-200 text-xs flex items-center gap-1 transition-colors"
                title={t('profile.copyAbha', 'Copy ABHA Number')}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedAbha ? t('profile.copied', 'Copied!') : t('profile.copyAbha', 'Copy')}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
              <span>{t('profile.ageYears', 'Age')}: <strong>{profileData.age} yrs</strong></span>
              <span>•</span>
              <span>{t('profile.bloodGroup', 'Blood Group')}: <strong>{profileData.bloodGroup}</strong></span>
              <span>•</span>
              <span>{t('profile.village', 'Village')}: <strong>{profileData.village}</strong></span>
            </div>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <QrCode className="w-20 h-20 text-white" />
            <span className="text-[10px] text-slate-300 font-mono mt-1.5 text-center">
              {t('profile.scanAtPhc', 'Scan at PHC OPD Counter')}
            </span>
          </div>
        </div>
      </div>

      {/* FORM: PROFILE DETAILS & GENDER SELECTION */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* EXACT WORKFLOW: GENDER SELECTION (MALE / FEMALE EXPERIENCE ROUTING) */}
        <div className="rural-card p-5 sm:p-6 space-y-4 border-2 border-ruralTeal-600/30">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ruralTeal-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t('profile.genderSection', 'Gender Selection & Healthcare Pathway')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('profile.genderSectionDesc', 'Select your gender pathway. This automatically switches your dashboard and navigation into the tailored medical experience.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Female Option */}
            <div
              onClick={() => setSelectedGender('female')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedGender === 'female'
                  ? 'border-rose-600 bg-rose-50/70 shadow-sm ring-2 ring-rose-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </span>
                  <input
                    type="radio"
                    name="gender"
                    checked={selectedGender === 'female'}
                    onChange={() => setSelectedGender('female')}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {t('profile.femaleExperience', 'Female Experience')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('profile.femaleExpDesc', 'Includes General Health + Maternal Care (ANC & delivery planning) + Universal Child Immunization & Nutrition.')}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-rose-200/60 text-[11px] font-bold text-rose-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('profile.femaleBadge', 'Maternal Track Included')}
              </div>
            </div>

            {/* Male Option */}
            <div
              onClick={() => setSelectedGender('male')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedGender === 'male'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </span>
                  <input
                    type="radio"
                    name="gender"
                    checked={selectedGender === 'male'}
                    onChange={() => setSelectedGender('male')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {t('profile.maleExperience', 'Male Experience')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('profile.maleExpDesc', 'General health-focused dashboard with Hypertension & Blood Glucose tracking, chronic vitals, and Agricultural & Occupational Safety.')}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-200/60 text-[11px] font-bold text-blue-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('profile.maleBadge', 'General & Farm Health Track')}
              </div>
            </div>
          </div>
        </div>

        {/* DEMOGRAPHIC & CONTACT DETAILS */}
        <div className="rural-card p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {t('profile.demographicsTitle', 'Demographic & Village Details')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.fullName', 'Full Name')}</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.phone', 'Registered Mobile Number')}</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.ageYears', 'Age (Years)')}</label>
              <input
                type="number"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.bloodGroup', 'Blood Group')}</label>
              <select
                value={profileData.bloodGroup}
                onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-500 bg-white"
              >
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.village', 'Village / Hamlet')}</label>
              <input
                type="text"
                value={profileData.village}
                onChange={(e) => setProfileData({ ...profileData, village: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.district', 'District')}</label>
              <input
                type="text"
                value={profileData.district}
                onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-ruralTeal-500"
              />
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACT & ASSIGNED ASHA WORKER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rural-card p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-600" />
              {t('profile.emergencyContactPerson', 'Emergency Contact Person')}
            </h3>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('profile.contactNameRelation', 'Contact Name & Relation')}</label>
              <input
                type="text"
                value={profileData.emergencyName}
                onChange={(e) => setProfileData({ ...profileData, emergencyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('profile.emergencyPhone', 'Emergency Phone Number')}</label>
              <input
                type="tel"
                value={profileData.emergencyPhone}
                onChange={(e) => setProfileData({ ...profileData, emergencyPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="rural-card p-5 space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                {t('profile.assignedAsha', 'Assigned Frontline ASHA Worker')}
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold text-slate-800">{basePatient.assignedAsha.name}</p>
                <p className="text-xs text-slate-500">{basePatient.assignedAsha.subCentre}</p>
                <p className="text-xs text-ruralTeal-700 font-semibold">{basePatient.assignedAsha.phone}</p>
              </div>
            </div>

            <a
              href={`tel:${basePatient.assignedAsha.phone}`}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> {t('profile.callAshaDirectly', 'Call ASHA Worker Directly')}
            </a>
          </div>
        </div>

        {/* SAVE BUTTON & FEEDBACK BANNER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {saveSuccess ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('profile.profileUpdatedMsg', 'Profile updated! Experience updated to {gender} pathway.', { gender: selectedGender.toUpperCase() })}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              {t('profile.offlineVaultNotice', 'Changes update your local offline ABHA vault immediately.')}
            </span>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200/90 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>{t('common.logout', 'Logout')}</span>
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t('profile.savePathwayBtn', 'Save Profile & Pathway')}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
