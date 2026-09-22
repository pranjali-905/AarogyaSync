import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { MOCK_DOCTORS } from '../../services/mockData';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  PhoneCall,
  User,
  Activity,
  Heart,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Wifi,
  WifiOff,
  ChevronLeft,
  Volume2,
  RotateCcw
} from 'lucide-react';

export default function AshaTelemedicinePage() {
  const { t } = useTranslation();
  const { isOnline, queueRecord } = useOffline();

  const [selectedDoctor, setSelectedDoctor] = useState(MOCK_DOCTORS[0]);
  const [patientName, setPatientName] = useState('Baban Rao');
  const [patientVitals, setPatientVitals] = useState({
    bp: '130/84',
    pulse: '86',
    spO2: '93%',
    temp: '99.8 °F'
  });
  const [chiefComplaint, setChiefComplaint] = useState(
    'Persistent productive cough for 10 days, nocturnal shortness of breath. SpO2 93% on room air.'
  );

  // Call simulation state
  const [callStatus, setCallStatus] = useState('IDLE'); // IDLE, CONNECTING, ACTIVE, ENDED
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isLowBandwidthMode, setIsLowBandwidthMode] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [doctorPrescription, setDoctorPrescription] = useState('');
  const [isSavedOffline, setIsSavedOffline] = useState(false);

  // Start Call
  const handleStartCall = () => {
    setCallStatus('CONNECTING');
    setIsSavedOffline(false);
    setTimeout(() => {
      setCallStatus('ACTIVE');
    }, 2000);
  };

  // End Call
  const handleEndCall = () => {
    setCallStatus('ENDED');
    setDoctorPrescription(
      'Advised Steam Inhalation twice daily, Tab Amoxicillin 500mg TDS x 5 days, Syrup Ambroxol 10ml TDS. Sputum test for AFB at Khed CHC if cough persists past 14 days.'
    );
  };

  // Save Consult Summary to patient record
  const handleSaveConsult = async () => {
    const summary = {
      patientName,
      doctor: selectedDoctor.fullName,
      facility: selectedDoctor.facility,
      vitals: patientVitals,
      complaint: chiefComplaint,
      prescription: doctorPrescription,
      timestamp: new Date().toISOString()
    };

    await queueRecord('TELECONSULT_SUMMARY', summary);
    setIsSavedOffline(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <Link to="/asha" className="hover:text-primary-600 flex items-center gap-1 font-medium">
            <ChevronLeft className="w-4 h-4" />
            {t('asha.dashboardTitle', 'ASHA Portal')}
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{t('asha.quickTelemedicine', 'Telemedicine')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Video className="w-8 h-8 text-primary-600" />
          Frontline Doorstep Telemedicine
        </h1>
        <p className="text-slate-600 mt-1">
          Connect rural patients directly to PHC / CHC Medical Officers with live vitals transmission and 2G audio mode.
        </p>
      </div>

      {/* Main Grid: Call Console & Patient Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video / Audio Stream & Call Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl min-h-[420px] flex flex-col justify-between p-6">
            {/* Call Status Badge */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs text-white">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    callStatus === 'ACTIVE'
                      ? 'bg-emerald-500 animate-pulse'
                      : callStatus === 'CONNECTING'
                      ? 'bg-amber-500 animate-ping'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="font-semibold uppercase tracking-wider">
                  {callStatus === 'ACTIVE'
                    ? 'Encrypted Live e-Sanjeevani Link'
                    : callStatus === 'CONNECTING'
                    ? 'Connecting to PHC Medical Officer...'
                    : callStatus === 'ENDED'
                    ? 'Consultation Completed'
                    : 'Doorstep Teleconsultation Ready'}
                </span>
              </div>

              {/* Bandwidth Indicator */}
              <button
                onClick={() => setIsLowBandwidthMode(!isLowBandwidthMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isLowBandwidthMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isLowBandwidthMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                {isLowBandwidthMode ? '2G Low Bandwidth (Audio Only)' : 'Standard Video'}
              </button>
            </div>

            {/* Video Placeholder or Doctor Visual */}
            <div className="my-auto text-center py-10 z-10">
              {callStatus === 'ACTIVE' ? (
                <div className="space-y-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-teal-500 mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-white/20 animate-pulse">
                    DR
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedDoctor.fullName}</h3>
                  <p className="text-sm text-teal-300">{selectedDoctor.designation} • {selectedDoctor.facility}</p>
                  <p className="text-xs text-slate-400">Consulting with {patientName} (Assisted by Sunita Tai)</p>
                </div>
              ) : callStatus === 'CONNECTING' ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto" />
                  <p className="text-white font-medium">Ringing {selectedDoctor.fullName}...</p>
                  <p className="text-xs text-slate-400">PHC Telemedicine Room, Ambegaon Block</p>
                </div>
              ) : callStatus === 'ENDED' ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Call Ended</h3>
                  <p className="text-sm text-slate-300">Doctor prescription & advice received below.</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-primary-400">
                    <Video className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Ready for Doctor Consultation</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Tap below to initiate encrypted audio/video consultation with {selectedDoctor.fullName}.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Call Controls */}
            <div className="flex items-center justify-center gap-4 z-10">
              {callStatus === 'ACTIVE' ? (
                <>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-2xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
                      isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-4 rounded-2xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${
                      !isVideoOn ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
                  >
                    {!isVideoOn ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 min-h-[48px]"
                  >
                    <PhoneOff className="w-6 h-6" />
                    End Call
                  </button>
                </>
              ) : callStatus === 'IDLE' ? (
                <button
                  onClick={handleStartCall}
                  className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-3 shadow-lg shadow-emerald-600/30 transition-all text-base min-h-[48px]"
                >
                  <PhoneCall className="w-6 h-6" />
                  Connect With Doctor Now
                </button>
              ) : (
                <button
                  onClick={() => setCallStatus('IDLE')}
                  className="px-6 py-3.5 rounded-2xl bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 hover:bg-slate-700 min-h-[48px]"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start New Call
                </button>
              )}
            </div>
          </div>

          {/* Doctor Selection Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Available On-Duty PHC Medical Officers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_DOCTORS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedDoctor.id === doc.id
                      ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-900">{doc.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{doc.specialty}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {doc.facility}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Post-Consultation Advice & Rx Summary */}
          {doctorPrescription && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <FileText className="w-5 h-5" />
                  Doctor's Digital Prescription & Guidance
                </div>
                <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  Issued by {selectedDoctor.fullName}
                </span>
              </div>

              <p className="text-sm text-slate-800 bg-white p-3.5 rounded-xl border border-emerald-100 font-medium">
                {doctorPrescription}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-600">
                  Status: <strong>{isSavedOffline ? 'Saved in IndexedDB offline vault' : 'Ready to save'}</strong>
                </div>

                <button
                  onClick={handleSaveConsult}
                  disabled={isSavedOffline}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm disabled:bg-emerald-400 min-h-[44px]"
                >
                  {isSavedOffline ? '✓ Saved to Patient Record' : 'Save to Patient Digital Backpack'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Live Patient Vitals & Chief Complaint */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-slate-900">Doorstep Patient Info</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Chief Complaint / Symptoms
              </label>
              <textarea
                rows={3}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Live Vitals Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-red-500" />
                Transmitted Field Vitals
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">BP (mmHg)</span>
                  <input
                    type="text"
                    value={patientVitals.bp}
                    onChange={(e) => setPatientVitals({ ...patientVitals, bp: e.target.value })}
                    className="w-full bg-transparent font-bold text-sm text-slate-900 border-none p-0 focus:ring-0"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Pulse (BPM)</span>
                  <input
                    type="text"
                    value={patientVitals.pulse}
                    onChange={(e) => setPatientVitals({ ...patientVitals, pulse: e.target.value })}
                    className="w-full bg-transparent font-bold text-sm text-slate-900 border-none p-0 focus:ring-0"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">SpO2 Oxygen</span>
                  <input
                    type="text"
                    value={patientVitals.spO2}
                    onChange={(e) => setPatientVitals({ ...patientVitals, spO2: e.target.value })}
                    className="w-full bg-transparent font-bold text-sm text-red-600 border-none p-0 focus:ring-0"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Temp (°F)</span>
                  <input
                    type="text"
                    value={patientVitals.temp}
                    onChange={(e) => setPatientVitals({ ...patientVitals, temp: e.target.value })}
                    className="w-full bg-transparent font-bold text-sm text-slate-900 border-none p-0 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Offline Advisory */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                All teleconsultation notes and digital prescriptions automatically save to local IndexedDB if connectivity drops mid-session.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
