import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import LanguageSelector from '../../components/common/LanguageSelector';
import {
  HeartPulse,
  ShieldCheck,
  Wifi,
  WifiOff,
  ArrowRight,
  Stethoscope,
  Users,
  Building2,
  PhoneCall,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Clock,
  Database,
  Smartphone,
  Baby,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { t, language } = useTranslation();
  const { currentUser, activeRole, quickSwitchRole } = useAuth();
  const navigate = useNavigate();

  // Interactive offline simulator state
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [simSyncStatus, setSimSyncStatus] = useState('SYNCED');

  const handleToggleSim = () => {
    if (!simulatedOffline) {
      setSimulatedOffline(true);
      setSimSyncStatus('OFFLINE_QUEUE_ACTIVE');
    } else {
      setSimSyncStatus('SYNCING');
      setTimeout(() => {
        setSimulatedOffline(false);
        setSimSyncStatus('SYNCED');
      }, 1500);
    }
  };

  const getDashboardPath = () => {
    switch (activeRole) {
      case 'ASHA':
        return '/asha';
      case 'DOCTOR':
        return '/doctor';
      case 'ADMIN':
        return '/admin';
      case 'PATIENT':
      default:
        return '/patient';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-ruralTeal-100 selection:text-ruralTeal-900">
      {/* ====================================================================
          1. TOP NAVIGATION HEADER
          ==================================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-ruralTeal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">
                {t('common.appName')}
              </span>
              <span className="text-[10px] font-bold text-ruralTeal-700 uppercase tracking-widest block">
                {t('roles.PATIENT_FEMALE').includes('राधिका') ? 'आरोग्य परिसंस्था' : 'Rural Health Ecosystem'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-ruralTeal-700 transition-colors">
              {t('landing.navAbout')}
            </a>
            <a href="#ecosystem" className="hover:text-ruralTeal-700 transition-colors">
              {t('landing.navEcosystem')}
            </a>
            <a href="#how-it-works" className="hover:text-ruralTeal-700 transition-colors">
              {t('landing.navHowItWorks')}
            </a>
            <a href="#features" className="hover:text-ruralTeal-700 transition-colors">
              {t('landing.navFeatures')}
            </a>
            <a href="#offline" className="hover:text-ruralTeal-700 transition-colors">
              {t('landing.navOffline')}
            </a>
            <a href="#pwa" className="hover:text-ruralTeal-700 transition-colors">
              {t('landing.navPwa')}
            </a>
          </nav>

          {/* Right Action Bar: Language Selector & Auth CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            {currentUser ? (
              <Link
                to={getDashboardPath()}
                className="px-3.5 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>{t('common.goToDashboard')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-slate-700 hover:text-ruralTeal-700 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl transition-colors"
                >
                  {t('landing.loginBtn')}
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3.5 py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all items-center gap-1"
                >
                  <span>{t('landing.getStarted')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. HERO SECTION
          ==================================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-ruralTeal-50/40 via-white to-slate-50">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-ruralTeal-200/20 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Reliability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ruralTeal-100/80 border border-ruralTeal-200 text-ruralTeal-800 text-xs sm:text-sm font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-ruralTeal-700" />
              <span>{t('landing.heroBadge')}</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-snug">
              {t('landing.heroPrimary')}
            </h1>

            {/* Simple Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {t('landing.heroSubtitle')}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base group"
              >
                <span>{t('landing.getStarted')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>{t('landing.loginBtn')}</span>
              </Link>
              <a
                href="#pwa"
                className="w-full sm:w-auto px-5 py-3.5 text-ruralTeal-800 hover:bg-ruralTeal-50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4 text-ruralTeal-700" />
                <span>{t('landing.installPwaBtn')}</span>
              </a>
            </div>

            {/* Emergency Hotline Shortcut */}
            <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 text-rose-600">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>108 Ambulance Hotline</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700">Doorstep ASHA Support</span>
              <span>•</span>
              <span className="text-indigo-700">PHC Teleconsult</span>
            </div>
          </div>

          {/* Quick Problem vs Solution Cards Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* The Problem Card */}
            <div className="rural-card p-6 border-l-4 border-l-rose-500 bg-white/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {t('landing.problemTitle')}
                </h2>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{t('landing.problemCard1Title')}:</strong> {t('landing.problemCard1Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{t('landing.problemCard2Title')}:</strong> {t('landing.problemCard2Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{t('landing.problemCard3Title')}:</strong> {t('landing.problemCard3Desc')}</span>
                </li>
              </ul>
            </div>

            {/* The Solution Card */}
            <div className="rural-card p-6 border-l-4 border-l-ruralTeal-600 bg-white/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-ruralTeal-100 text-ruralTeal-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {t('landing.solutionTitle')}
                </h2>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-ruralTeal-600 font-bold">✓</span>
                  <span><strong>{t('landing.solutionCard1Title')}:</strong> {t('landing.solutionCard1Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ruralTeal-600 font-bold">✓</span>
                  <span><strong>{t('landing.solutionCard2Title')}:</strong> {t('landing.solutionCard2Desc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ruralTeal-600 font-bold">✓</span>
                  <span><strong>{t('landing.solutionCard3Title')}:</strong> {t('landing.solutionCard3Desc')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. THE ECOSYSTEM SECTION
          Patient ↔ ASHA Worker ↔ Doctor ↔ Healthcare Facility
          ==================================================================== */}
      <section id="ecosystem" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-ruralTeal-700 uppercase tracking-wider block mb-1">
              Connected Continuum of Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('landing.ecosystemTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {t('landing.ecosystemSubtitle')}
            </p>

            {/* Ecosystem Flow Ribbon */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-ruralTeal-50 border border-ruralTeal-200 rounded-2xl text-xs sm:text-sm font-extrabold text-ruralTeal-900 shadow-2xs">
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">Patient</span>
              <span className="text-slate-400">↔</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">ASHA Worker</span>
              <span className="text-slate-400">↔</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">Doctor</span>
              <span className="text-slate-400">↔</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md">Healthcare Facility</span>
            </div>
          </div>

          {/* 4 Pillars Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Patient */}
            <div className="rural-card p-6 border-t-4 border-t-rose-500 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
                  👩
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('landing.pillarPatientTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.pillarPatientDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <span>Maternal ANC • Vaccine Calendar</span>
              </div>
            </div>

            {/* Pillar 2: ASHA Worker */}
            <div className="rural-card p-6 border-t-4 border-t-emerald-600 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  🩺
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('landing.pillarAshaTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.pillarAshaDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <span>100% Offline Vault • Doorstep Vitals</span>
              </div>
            </div>

            {/* Pillar 3: Doctor */}
            <div className="rural-card p-6 border-t-4 border-t-indigo-600 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  👨‍⚕️
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('landing.pillarDoctorTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.pillarDoctorDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-indigo-700 flex items-center gap-1">
                <span>Priority Triage Queue • Digital Rx</span>
              </div>
            </div>

            {/* Pillar 4: Healthcare Facility & Admin */}
            <div className="rural-card p-6 border-t-4 border-t-slate-700 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg">
                  🏛️
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('landing.pillarFacilityTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.pillarFacilityDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                <span>PHC Medicine Stock • Surveillance</span>
              </div>
            </div>
          </div>

          {/* Bi-directional Continuum of Care Details in Simple Language */}
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 text-center">
              How The Ecosystem Works Together (Continuous Loop)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="font-extrabold text-rose-700 flex items-center gap-1.5 text-xs">
                  <span>Patient</span>
                  <span className="text-slate-400 font-normal">↔</span>
                  <span>ASHA Worker</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Villagers receive doorstep visits, vital sign checks, and maternal reminders directly in their home without traveling long distances.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="font-extrabold text-emerald-700 flex items-center gap-1.5 text-xs">
                  <span>ASHA Worker</span>
                  <span className="text-slate-400 font-normal">↔</span>
                  <span>Doctor</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  ASHA records vitals and symptom photos offline. When network connects, the doctor reviews the prioritized queue and provides clinical guidance.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="font-extrabold text-indigo-700 flex items-center gap-1.5 text-xs">
                  <span>Doctor</span>
                  <span className="text-slate-400 font-normal">↔</span>
                  <span>Healthcare Facility</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Doctors verify real-time drug supplies at the Primary Health Centre before writing e-prescriptions, ensuring zero out-of-stock wasted trips.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span>Facility</span>
                  <span className="text-slate-400 font-normal">↔</span>
                  <span>Patient</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Patients collect essential medicines locally at the clinic, access permanent digital records, and dispatch 108 ambulances in medical emergencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. ABOUT AAROGYASYNC SECTION
          ==================================================================== */}
      <section id="about" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-ruralTeal-700 uppercase tracking-wider block mb-1">
              Mission & Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('landing.aboutTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              {t('landing.aboutMission')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rural-card p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.aboutPillar1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.aboutPillar1Desc')}
              </p>
            </div>

            <div className="rural-card p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-ruralTeal-100 text-ruralTeal-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.aboutPillar2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.aboutPillar2Desc')}
              </p>
            </div>

            <div className="rural-card p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.aboutPillar3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.aboutPillar3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. HOW IT WORKS (Simple 4-Step Process)
          ==================================================================== */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-ruralTeal-700 uppercase tracking-wider block mb-1">
              Step-by-Step Delivery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('landing.howItWorksTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {t('landing.howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative rural-card p-6 bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-ruralTeal-300 block mb-2">
                  {t('landing.step1Number')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t('landing.step1Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.step1Desc')}
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-ruralTeal-700 flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Zero Internet Required</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rural-card p-6 bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-amber-300 block mb-2">
                  {t('landing.step2Number')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t('landing.step2Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.step2Desc')}
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Red/Yellow/Green Clinical Rules</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rural-card p-6 bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-emerald-300 block mb-2">
                  {t('landing.step3Number')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t('landing.step3Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.step3Desc')}
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Auto-Burst Background Sync</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative rural-card p-6 bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-indigo-300 block mb-2">
                  {t('landing.step4Number')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t('landing.step4Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing.step4Desc')}
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>PHC Medicine Dispensation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. KEY FEATURES SECTION
          ==================================================================== */}
      <section id="features" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-ruralTeal-700 uppercase tracking-wider block mb-1">
              Purpose-Built Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {t('landing.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Maternal */}
            <div className="rural-card p-6 bg-white space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Baby className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.featMaternalTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.featMaternalDesc')}
              </p>
            </div>

            {/* Feature 2: Child Vaccines */}
            <div className="rural-card p-6 bg-white space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.featChildTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.featChildDesc')}
              </p>
            </div>

            {/* Feature 3: Digital Backpack */}
            <div className="rural-card p-6 bg-white space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.featBackpackTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.featBackpackDesc')}
              </p>
            </div>

            {/* Feature 4: PHC Medicine Stock */}
            <div className="rural-card p-6 bg-white space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.featStockTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.featStockDesc')}
              </p>
            </div>

            {/* Feature 5: Emergency SOS */}
            <div className="rural-card p-6 bg-white space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.featEmergencyTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.featEmergencyDesc')}
              </p>
            </div>

            {/* Feature 6: District Surveillance */}
            <div className="rural-card p-6 bg-white space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.featSurveillanceTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.featSurveillanceDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. RURAL HEALTHCARE & OFFLINE CAPABILITY SECTION
          ==================================================================== */}
      <section id="offline" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-ruralTeal-700 uppercase tracking-wider block mb-1">
              Offline-First Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('landing.offlineSectionTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {t('landing.offlineSectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="rural-card p-6 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-ruralTeal-100 text-ruralTeal-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.offlineCard1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.offlineCard1Desc')}
              </p>
            </div>

            <div className="rural-card p-6 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.offlineCard2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.offlineCard2Desc')}
              </p>
            </div>

            <div className="rural-card p-6 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('landing.offlineCard3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('landing.offlineCard3Desc')}
              </p>
            </div>
          </div>

          {/* Interactive Live Offline/Online Simulator */}
          <div className="max-w-3xl mx-auto rural-card p-6 sm:p-8 bg-slate-900 text-white border-none shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-ruralTeal-400" />
                  <span>{t('landing.offlineSimTitle')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t('landing.offlineSimDesc')}
                </p>
              </div>

              <button
                onClick={handleToggleSim}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all bg-ruralTeal-600 hover:bg-ruralTeal-500 text-white shadow-md active:scale-95"
              >
                {simulatedOffline ? (
                  <>
                    <Wifi className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span>Restore Network (Online)</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-rose-300" />
                    <span>Cut Network (Simulate Offline)</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulation Status Display */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Simulated Network State
                </span>
                <div className="flex items-center gap-2 mt-2">
                  {simulatedOffline ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-sm font-bold text-rose-400">
                        {t('landing.offlineSimOffline')}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-emerald-400">
                        {t('landing.offlineSimOnline')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Client Storage & Synchronization Engine
                </span>
                <div className="flex items-center gap-2 mt-2">
                  {simSyncStatus === 'SYNCING' && (
                    <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Transmitting queued records to cloud...</span>
                    </span>
                  )}
                  {simSyncStatus === 'OFFLINE_QUEUE_ACTIVE' && (
                    <span className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-rose-400" />
                      <span>IndexedDB active: 3 records held locally</span>
                    </span>
                  )}
                  {simSyncStatus === 'SYNCED' && (
                    <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>All records safe & synchronized</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. MULTILINGUAL SUPPORT SECTION
          ==================================================================== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-ruralTeal-700 uppercase tracking-wider block mb-1">
              Zero Language Barrier
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('landing.multilingualSectionTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              {t('landing.multilingualDesc')}
            </p>
          </div>

          {/* Tri-Lingual Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* English */}
            <div className="rural-card p-6 bg-white space-y-3 border-t-4 border-t-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">English</span>
                <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Standard</span>
              </div>
              <p className="text-xs text-slate-500">
                Medical terminology aligned with international clinical guidelines and National Health Mission protocols.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-700">
                <div>• Urgent Triage: Immediate PHC Transfer</div>
                <div>• ANC Trimester Checkup Due</div>
                <div>• ORS & Paracetamol Stock Available</div>
              </div>
            </div>

            {/* Hindi */}
            <div className="rural-card p-6 bg-white space-y-3 border-t-4 border-t-amber-500">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">हिंदी (Hindi)</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">राष्ट्रभाषा</span>
              </div>
              <p className="text-xs text-slate-500">
                सरल व सुगम हिंदी शब्दावली ताकि ग्रामीण नागरिक और स्वास्थ्य कार्यकर्ता बिना किसी संकोच के जानकारी समझ सकें।
              </p>
              <div className="p-3 bg-amber-50/60 rounded-xl text-xs space-y-1 text-slate-800">
                <div>• आपातकालीन स्थिति: तुरंत पीएचसी ले जाएं</div>
                <div>• गर्भावस्था प्रसवपूर्व जांच की तारीख</div>
                <div>• ओआरएस व पेरासिटामोल उपलब्ध है</div>
              </div>
            </div>

            {/* Marathi */}
            <div className="rural-card p-6 bg-white space-y-3 border-t-4 border-t-ruralTeal-600">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">मराठी (Marathi)</span>
                <span className="text-xs bg-ruralTeal-100 text-ruralTeal-800 font-bold px-2 py-0.5 rounded">स्थानिक भाषा</span>
              </div>
              <p className="text-xs text-slate-500">
                महाराष्ट्रातील वाड्या-वस्त्यांवरील आशा सेविका आणि ग्रामस्थांसाठी मायबोलीत अचूक आरोग्य सूचना.
              </p>
              <div className="p-3 bg-ruralTeal-50/60 rounded-xl text-xs space-y-1 text-slate-800">
                <div>• अति-तातडीची स्थिती: तात्काळ रुग्णालयात दाखल करा</div>
                <div>• प्रसूतीपूर्व तपासणी (ANC) वेळापत्रक</div>
                <div>• ओआरएस व पॅरासिटामॉल औषध साठा उपलब्ध</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. PROGRESSIVE WEB APP (PWA) SECTION
          ==================================================================== */}
      <section id="pwa" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-ruralTeal-900 via-ruralTeal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ruralTeal-700/80 rounded-full text-xs font-bold text-ruralTeal-200">
                <Smartphone className="w-4 h-4" />
                <span>PWA Ready • Service Worker v1.0</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {t('landing.pwaSectionTitle')}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {t('landing.pwaSectionSubtitle')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-ruralTeal-300 block mb-1">
                    No Store Required
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {t('landing.pwaPoint1')}
                  </p>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-ruralTeal-300 block mb-1">
                    Under 3 MB Footprint
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {t('landing.pwaPoint2')}
                  </p>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-ruralTeal-300 block mb-1">
                    Instant Flight Mode Boot
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {t('landing.pwaPoint3')}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>{t('landing.ctaRegister')}</span>
                  <ArrowRight className="w-4 h-4 text-ruralTeal-700" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-ruralTeal-700/80 hover:bg-ruralTeal-700 text-white font-bold rounded-xl text-sm border border-ruralTeal-600 transition-all"
                >
                  <span>{t('landing.ctaLogin')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. FOOTER
          ==================================================================== */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ruralTeal-700 text-white flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-bold text-white block">
                  {t('common.appName')}
                </span>
                <span className="text-xs text-slate-400">
                  {t('landing.footerTagline')}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-300 font-semibold">
              <a href="#about" className="hover:text-white transition-colors">
                {t('landing.navAbout')}
              </a>
              <a href="#ecosystem" className="hover:text-white transition-colors">
                {t('landing.navEcosystem')}
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                {t('landing.navHowItWorks')}
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                {t('landing.navFeatures')}
              </a>
              <a href="#offline" className="hover:text-white transition-colors">
                {t('landing.navOffline')}
              </a>
              <Link to="/login" className="hover:text-white transition-colors">
                {t('landing.loginBtn')}
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <p className="text-slate-400">
              {t('landing.footerLegal')}
            </p>
            <p className="text-slate-500 font-medium">
              {t('landing.footerHelplines')}
            </p>
            <p className="text-slate-600 text-[11px] pt-4">
              © {new Date().getFullYear()} AarogyaSync. Continuous Rural Healthcare Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
