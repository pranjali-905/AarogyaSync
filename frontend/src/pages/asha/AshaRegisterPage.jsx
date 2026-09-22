import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { saveCachedPatient } from '../../services/offlineStorage';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Save,
  Phone,
  User,
  HeartPulse,
  WifiOff
} from 'lucide-react';

export default function AshaRegisterPage() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { queueRecord } = useOffline();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'female',
    village: currentUser?.village || 'Nigdale',
    district: 'Pune',
    bloodGroup: 'B+',
    isPregnant: false,
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [savedPatient, setSavedPatient] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    const payload = {
      ...formData,
      id: `usr-pat-off-${Date.now()}`,
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredByAsha: currentUser?.fullName || 'Sunita Tai',
      registeredAt: new Date().toISOString(),
      isOfflineCached: true
    };

    // 1. Save to local IndexedDB patient registry
    await saveCachedPatient(payload);
    // 2. Queue for server sync
    await queueRecord('PATIENT_REGISTRATION', payload);
    setSavedPatient(payload);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/asha"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-ruralTeal-700" />
              {t('asha.registerPatient')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              100% Offline Registration • Queued directly to device vault
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Ready</span>
        </span>
      </div>

      {savedPatient ? (
        <div className="rural-card p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Patient Registered Locally!</h2>
            <p className="text-xs text-slate-600">
              <strong>{savedPatient.fullName}</strong> has been enrolled and assigned provisional ABHA ID:
            </p>
            <p className="text-sm font-mono font-bold text-ruralTeal-700 bg-slate-100 py-1.5 px-3 rounded-xl max-w-xs mx-auto mt-1">
              {savedPatient.abhaId}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2">
              Record is safely queued in your device's IndexedDB storage and will auto-sync upon connectivity.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/asha/workflow?patientId=${savedPatient.id}`}
              className="px-5 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all"
            >
              Start Health Check Now
            </Link>
            <button
              onClick={() => {
                setSavedPatient(null);
                setFormData({
                  fullName: '',
                  phone: '',
                  age: '',
                  gender: 'female',
                  village: currentUser?.village || 'Nigdale',
                  district: 'Pune',
                  bloodGroup: 'B+',
                  isPregnant: false,
                  emergencyContactName: '',
                  emergencyContactPhone: ''
                });
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Register Another Citizen
            </button>
            <Link
              to="/asha"
              className="px-4 py-2.5 text-slate-600 hover:text-slate-800 text-xs font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rural-card p-6 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Citizen Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Meena Sanjay Waghmare"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-ruralTeal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.phone', 'Mobile Number')} *</label>
              <input
                type="tel"
                required
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-ruralTeal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.ageYears', 'Age (Years)')} *</label>
              <input
                type="number"
                required
                placeholder="e.g. 24"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-ruralTeal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('patient.gender', 'Gender')}</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="female">{t('patient.female', 'Female')}</option>
                <option value="male">{t('patient.male', 'Male')}</option>
                <option value="other">{t('patient.other', 'Other')}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t('profile.bloodGroup', 'Blood Group')}</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
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
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          {formData.gender === 'female' && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-950 block">{t('patient.currentlyPregnant', 'Is this patient currently pregnant?')}</span>
                <span className="text-[11px] text-rose-800">{t('patient.ancCalendarDesc', 'Enables Antenatal Care (ANC) calendar & IFA tracking')}</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isPregnant}
                onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500"
              />
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/asha"
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
            >
              {t('common.cancel', 'Cancel')}
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t('sync.saveToDeviceVault', 'Save to Device Vault')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
