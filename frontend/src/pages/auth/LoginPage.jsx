import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import LanguageSelector from '../../components/common/LanguageSelector';
import InstallAppModal from '../../components/common/InstallAppModal';
import {
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Download
} from 'lucide-react';

export default function LoginPage() {
  const { loginWithCredentials, authLoading } = useAuth();
  const { t } = useTranslation();
  const { canInstall, isIOS, hasNativePrompt, isModalOpen, setIsModalOpen, triggerInstall } = usePWAInstall();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      errors.phone = 'Mobile Number or ABHA ID is required.';
    } else if (cleanPhone.length < 10 && cleanPhone.length !== 14) {
      errors.phone = 'Please enter a valid 10-digit phone number or 14-digit ABHA ID.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const result = await loginWithCredentials({ phone: cleanPhone, password });

    if (result.success && result.user) {
      // Navigate strictly according to server-verified role
      const serverRole = result.user.role;
      switch (serverRole) {
        case 'ASHA':
          navigate('/asha');
          break;
        case 'DOCTOR':
          navigate('/doctor');
          break;
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'PATIENT':
        default:
          navigate('/patient');
          break;
      }
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your phone and password.');
    }
  };

  const autofillCredentials = (testPhone, testPassword = 'demo123') => {
    setPhone(testPhone);
    setPassword(testPassword);
    setFieldErrors({});
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans">
      {/* Top Header Bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-ruralTeal-800">
          <div className="p-1.5 bg-ruralTeal-100 rounded-lg text-ruralTeal-700">
            <HeartPulse className="w-4 h-4" />
          </div>
          <span className="truncate">{t('common.appName')}</span>
        </div>
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md mx-auto space-y-4">
        {/* Backend Role Authorization Security Banner */}
        <div className="p-3 rounded-2xl bg-ruralTeal-50 border border-ruralTeal-200 text-xs text-ruralTeal-950 flex items-start gap-2.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-ruralTeal-700 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold block text-ruralTeal-900">Role-Aware Authentication</span>
            <span className="text-slate-600">All four roles (Patient, ASHA Worker, Doctor, Admin) sign in here. Your role and permissions are authorized directly by the server.</span>
          </div>
        </div>

        {/* Regular Mobile / Aadhaar Login Form */}
        <div className="rural-card p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-ruralTeal-700 flex items-center justify-center text-white shadow-xs mb-2">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Quick-fill credentials helper */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-600 block">
              Quick Autofill Credentials for Password Login (demo123):
            </span>
            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={() => autofillCredentials('9876543210')}
                className="px-2 py-1.5 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition-colors text-center truncate"
              >
                👩 Female Patient
              </button>
              <button
                type="button"
                onClick={() => autofillCredentials('9876543211')}
                className="px-2 py-1.5 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg transition-colors text-center truncate"
              >
                👨 Male Patient
              </button>
              <button
                type="button"
                onClick={() => autofillCredentials('9876543220')}
                className="px-2 py-1.5 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors text-center truncate"
              >
                🩺 ASHA Worker
              </button>
              <button
                type="button"
                onClick={() => autofillCredentials('9876543230')}
                className="px-2 py-1.5 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg transition-colors text-center truncate"
              >
                👨‍⚕️ Doctor
              </button>
              <button
                type="button"
                onClick={() => autofillCredentials('9876543240')}
                className="px-2 py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg transition-colors text-center truncate"
              >
                🏛️ Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('auth.phoneLabel')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    fieldErrors.phone
                      ? 'border-rose-300 ring-rose-200 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-ruralTeal-500'
                  }`}
                />
              </div>
              {fieldErrors.phone && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  {t('auth.passwordLabel')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-ruralTeal-700 hover:text-ruralTeal-900"
                >
                  {t('auth.forgotPasswordLink')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    fieldErrors.password
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
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99]"
            >
              {authLoading ? (
                <span>{t('auth.loggingIn')}</span>
              ) : (
                <>
                  <span>{t('auth.loginBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>{t('auth.dontHaveAccount')} </span>
            <Link to="/register" className="font-bold text-ruralTeal-700 hover:underline">
              {t('auth.registerLink')}
            </Link>
          </div>
        </div>

        {/* Mobile PWA Install Card for Team Members */}
        {canInstall && (
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-ruralTeal-50 text-ruralTeal-700 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Install Mobile App</div>
                <div className="text-[10px] text-slate-500 truncate">Add to phone home screen</div>
              </div>
            </div>
            <button
              type="button"
              onClick={triggerInstall}
              className="px-3 py-1.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          </div>
        )}
      </div>

      {/* PWA Install Modal Dialog */}
      <InstallAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hasNativePrompt={hasNativePrompt}
        onNativeInstall={triggerInstall}
        isIOS={isIOS}
      />
    </div>
  );
}
