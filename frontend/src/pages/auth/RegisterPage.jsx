import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from '../../components/common/LanguageSelector';
import {
  HeartPulse,
  User,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function RegisterPage() {
  const { registerWithCredentials, authLoading } = useAuth();
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  // Form State
  const [role, setRole] = useState('PATIENT'); // PATIENT or ASHA
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientType, setPatientType] = useState(''); // Mandatory Male or Female for Patient
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [preferredLang, setPreferredLang] = useState(language || 'en');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Error States
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (role === 'PATIENT' && !patientType) {
      errors.patientType = t('auth.patientTypeRequired', 'Please select Patient Type (Male or Female).');
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (role === 'ASHA' && !village.trim()) {
      errors.village = 'Assigned village/hamlet is required for ASHA health workers.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    const selectedType = role === 'PATIENT' ? patientType : 'female';

    const userData = {
      fullName: fullName.trim(),
      phone: phone.trim().replace(/\D/g, ''),
      password,
      role,
      patientType: selectedType,
      gender: selectedType,
      village: village.trim() || 'Nigdale',
      district: district.trim() || 'Pune',
      preferredLanguage: preferredLang
    };

    const result = await registerWithCredentials(userData);

    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        if (role === 'ASHA') {
          navigate('/asha');
        } else {
          navigate('/patient');
        }
      }, 1000);
    } else {
      setApiError(result.error || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans">
      {/* Top Header Bar with Language Selector & Back to Home */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between mb-3 sm:mb-4">
        <Link to="/login" className="flex items-center gap-2 text-xs font-bold text-ruralTeal-700 hover:text-ruralTeal-900 transition-colors">
          <HeartPulse className="w-4 h-4" />
          <span>← {t('auth.login', 'Sign In')}</span>
        </Link>
        <LanguageSelector />
      </div>

      {/* Main Registration Card Container */}
      <div className="w-full max-w-lg mx-auto">
        <div className="rural-card p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-ruralTeal-700 flex items-center justify-center text-white shadow-xs mb-2">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('auth.registerTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('auth.registerSubtitle')}
            </p>
          </div>

          {/* API Error Notification */}
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{apiError}</div>
            </div>
          )}

          {/* Success Notification */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="font-bold">{successMessage}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t('auth.roleSelectionTitle')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setRole('PATIENT')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'PATIENT'
                      ? 'border-ruralTeal-600 bg-ruralTeal-50/70 ring-1 ring-ruralTeal-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className={`w-4 h-4 ${role === 'PATIENT' ? 'text-ruralTeal-700' : 'text-slate-400'}`} />
                    <span className={`text-xs font-extrabold ${role === 'PATIENT' ? 'text-ruralTeal-900' : 'text-slate-700'}`}>
                      {t('auth.rolePatient')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {t('auth.rolePatientDesc')}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ASHA')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    role === 'ASHA'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className={`w-4 h-4 ${role === 'ASHA' ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className={`text-xs font-extrabold ${role === 'ASHA' ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {t('auth.roleAsha')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {t('auth.roleAshaDesc')}
                  </p>
                </button>
              </div>

              {/* District Admin & Doctor Security Callout */}
              <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-[11px] text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Administrative & Doctor Provisioning Policy</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>District Administrator</strong> accounts are provisioned exclusively by District Health Authorities (Zilla Parishad) and cannot be registered publicly. <strong>Doctor (Medical Officer)</strong> credentials require National Medical Commission (NMC) verification.
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('auth.fullNameLabel')} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('auth.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    formErrors.fullName
                      ? 'border-rose-300 ring-rose-200 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-ruralTeal-500'
                  }`}
                />
              </div>
              {formErrors.fullName && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('auth.phoneLabel')} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    formErrors.phone
                      ? 'border-rose-300 ring-rose-200 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-ruralTeal-500'
                  }`}
                />
              </div>
              {formErrors.phone && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Patient Type Selection (Mandatory Male / Female) */}
            {role === 'PATIENT' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.patientTypeLabel', 'Patient Type')} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPatientType('male');
                      setFormErrors((prev) => ({ ...prev, patientType: null }));
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-extrabold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                      patientType === 'male'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500 shadow-xs'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">👨</span>
                    <span>{t('auth.patientTypeMale', 'Male')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPatientType('female');
                      setFormErrors((prev) => ({ ...prev, patientType: null }));
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-extrabold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                      patientType === 'female'
                        ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500 shadow-xs'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">👩</span>
                    <span>{t('auth.patientTypeFemale', 'Female')}</span>
                  </button>
                </div>
                {formErrors.patientType && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.patientType}</p>
                )}
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {patientType === 'female' && '👩 Female Patient section: Maternal care (if applicable), health records & rural telemedicine.'}
                  {patientType === 'male' && '👨 Male Patient section: General health, chronic care management & telemedicine.'}
                  {!patientType && '⚠️ Please select Male or Female to continue registration.'}
                </p>
              </div>
            ) : null}

            {/* Village & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.villageLabel')} {role === 'ASHA' ? '*' : ''}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('auth.villagePlaceholder')}
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ruralTeal-500"
                  />
                </div>
                {formErrors.village && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.village}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.districtLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('auth.districtPlaceholder')}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ruralTeal-500"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.passwordLabel')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      formErrors.password
                        ? 'border-rose-300 ring-rose-200 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-ruralTeal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.confirmPasswordLabel')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      formErrors.confirmPassword
                        ? 'border-rose-300 ring-rose-200 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-ruralTeal-500'
                    }`}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 active:scale-[0.99]"
            >
              {authLoading ? (
                <span>{t('auth.registering')}</span>
              ) : (
                <>
                  <span>{t('auth.registerBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation Link */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span>{t('auth.alreadyHaveAccount')} </span>
            <Link to="/login" className="font-bold text-ruralTeal-700 hover:underline">
              {t('auth.signInLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
