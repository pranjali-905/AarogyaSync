import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from '../../components/common/LanguageSelector';
import { apiForgotPassword, apiResetPassword } from '../../services/apiClient';
import {
  HeartPulse,
  Phone,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Step 1: Phone input, Step 2: OTP & New Password, Step 3: Success
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [maskedPhone, setMaskedPhone] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      setFieldErrors({ phone: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await apiForgotPassword({ phone: cleanPhone });
      if (response && response.success) {
        setMaskedPhone(response.data?.maskedPhone || cleanPhone);
        if (response.data?.devOtp) {
          setDevOtpHint(response.data.devOtp);
        }
        setStep(2);
      } else {
        setErrorMessage(response?.error || response?.message || 'Failed to request OTP. Phone number may not be registered.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const errors = {};

    if (!otp.trim()) {
      errors.otp = 'Please enter the 6-digit OTP.';
    }

    if (!newPassword) {
      errors.newPassword = 'Password is required.';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters long.';
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      const response = await apiResetPassword({
        phone: cleanPhone,
        otp: otp.trim(),
        newPassword
      });

      if (response && response.success) {
        setStep(3);
      } else {
        setErrorMessage(response?.error || response?.message || 'Invalid verification code or password update failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Header Bar */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex items-center justify-between mb-4">
        <Link to="/login" className="flex items-center gap-2 text-xs font-bold text-ruralTeal-700 hover:text-ruralTeal-900">
          <HeartPulse className="w-4 h-4" />
          <span>← {t('auth.backToLogin')}</span>
        </Link>
        <LanguageSelector />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rural-card p-6 sm:p-8 shadow-sm space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-xs mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('auth.forgotTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {step === 1 && t('auth.forgotSubtitle')}
              {step === 2 && `Enter the verification code sent to ${maskedPhone}`}
              {step === 3 && 'Password successfully updated!'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* STEP 1: Phone Input Form */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.phoneLabel')}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
              >
                {loading ? <span>{t('auth.sendingOtp')}</span> : <span>{t('auth.sendOtpBtn')}</span>}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1">
                <div className="font-bold flex items-center gap-1 text-slate-700">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Test Mobile Numbers:</span>
                </div>
                <div>• Patient: <code>9876543210</code></div>
                <div>• ASHA Worker: <code>9876543220</code></div>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification & New Password Form */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in">
              {/* Dev Hint Callout */}
              {devOtpHint && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                  <span>Demo Verification OTP:</span>
                  <span className="font-mono font-extrabold px-2 py-0.5 bg-amber-200 rounded text-amber-950 tracking-wider">
                    {devOtpHint}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.otpLabel')}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder={t('auth.otpPlaceholder')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ruralTeal-500 font-mono tracking-widest text-center"
                  />
                </div>
                {fieldErrors.otp && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{fieldErrors.otp}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.newPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.newPasswordPlaceholder')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ruralTeal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{fieldErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('auth.confirmNewPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ruralTeal-500"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
              >
                {loading ? <span>{t('auth.resetting')}</span> : <span>{t('auth.resetBtn')}</span>}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 pt-1"
              >
                ← Change Mobile Number
              </button>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="space-y-4 text-center animate-in zoom-in-95">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Password Reset Successful!
              </h2>
              <p className="text-xs text-slate-600">
                Your credentials have been securely updated. You can now log into your AarogyaSync account.
              </p>
              <Link
                to="/login"
                className="w-full py-3 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Bottom Link */}
          {step !== 3 && (
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
              <Link to="/login" className="font-bold text-ruralTeal-700 hover:underline">
                {t('auth.backToLogin')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
