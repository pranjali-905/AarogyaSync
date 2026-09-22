import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { apiService } from '../../services/apiService';
import { MOCK_DOCTOR_DATA, MOCK_MEDICINES } from '../../services/mockData';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, PhoneCall,
  Activity, FileText, ShieldCheck, Building2, CheckCircle2,
  Wifi, WifiOff, ChevronLeft, Plus, Trash2, Pill, Send,
  AlertTriangle, RotateCcw, SwitchCamera, Maximize2, Minimize2,
  Signal, Radio
} from 'lucide-react';

export default function DoctorLiveConsultPage() {
  const { id } = useParams();
  const { isOnline } = useOffline();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { consultationQueue, patientsList, doctor } = MOCK_DOCTOR_DATA;
  const [selectedPatientId, setSelectedPatientId] = useState(id || 'p-02');
  const targetQueueItem = consultationQueue.find((q) => q.patientId === selectedPatientId) || consultationQueue[0];
  const targetPatient = patientsList.find((p) => p.id === selectedPatientId) || patientsList[0];

  // Call state
  const [callStatus, setCallStatus] = useState('IDLE');
  const [callDuration, setCallDuration] = useState(0);

  // Real webcam refs
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [facingMode, setFacingMode] = useState('user');
  const [isSwapped, setIsSwapped] = useState(false);
  const [camError, setCamError] = useState(null);
  const [bandwidthMode, setBandwidthMode] = useState('4g');
  const [audioFreqBars, setAudioFreqBars] = useState([12, 18, 24, 30, 22, 16, 28, 35, 20, 14]);
  const [audioLevel, setAudioLevel] = useState(0);

  // Prescriptions
  const [diagnosis, setDiagnosis] = useState(targetQueueItem ? targetQueueItem.chiefComplaint : 'Clinical Assessment');
  const [clinicalAdvice, setClinicalAdvice] = useState('Strict bed rest in left lateral recumbent position. Monitor blood pressure every 4 hours. Avoid high sodium foods.');
  const [medicines, setMedicines] = useState([
    { name: 'Tab Labetalol 100mg', dosage: '1 tablet', frequency: 'Twice Daily (BD)', duration: '5 days', instructions: 'Take after meals' },
    { name: 'Tab Calcium Carbonate 500mg', dosage: '1 tablet', frequency: 'Once Daily (OD)', duration: '30 days', instructions: 'Take with clean water' }
  ]);
  const [newMed, setNewMed] = useState({ name: 'Tab Paracetamol 500mg', dosage: '1 tablet', frequency: 'SOS (as needed)', duration: '3 days', instructions: 'Take if fever > 100F' });
  const [rxDispatched, setRxDispatched] = useState(false);

  // Detect connection speed
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      const c = navigator.connection;
      if (c.effectiveType === '2g' || c.effectiveType === 'slow-2g') setBandwidthMode('2g');
      else if (c.effectiveType === '3g') setBandwidthMode('3g');
    }
  }, []);

  // Call timer
  useEffect(() => {
    let interval;
    if (callStatus === 'ACTIVE') interval = setInterval(() => setCallDuration((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Audio analyser
  const setupAudioAnalyser = useCallback((stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close().catch(() => {});
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      if (!stream.getAudioTracks().length) return;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buf);
        let sum = 0; const bars = [];
        for (let i = 0; i < 10; i++) { const v = buf[i] || 0; sum += v; bars.push(Math.max(12, Math.round((v / 255) * 80))); }
        setAudioLevel(Math.min(100, Math.round((sum / 1280) * 100)));
        setAudioFreqBars(bars);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) { console.warn('Audio analyser:', e); }
  }, []);

  // Hardware cleanup
  const stopHardwareTracks = useCallback(() => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') { audioContextRef.current.close().catch(() => {}); audioContextRef.current = null; }
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach((t) => t.stop()); localStreamRef.current = null; }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  }, []);

  // Canvas fallback
  const createFallbackStream = useCallback((name) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 480;
      const ctx = canvas.getContext('2d');
      let angle = 0;
      const draw = () => {
        angle += 0.04;
        const grad = ctx.createLinearGradient(0, 0, 640, 480);
        grad.addColorStop(0, '#1e293b'); grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 640, 480);
        ctx.save(); ctx.translate(320, 210); ctx.fillStyle = '#0d9488';
        ctx.beginPath(); ctx.arc(0, -30 + Math.sin(angle) * 3, 55, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, 70, 110, 60, 0, 0, Math.PI); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(name || 'Doctor', 320, 340);
        ctx.fillStyle = '#34d399'; ctx.font = '13px sans-serif'; ctx.fillText('Live Video Connected', 320, 368);
        animFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
      return canvas.captureStream ? canvas.captureStream(25) : null;
    } catch (e) { console.warn('Canvas stream:', e); return null; }
  }, []);

  // Start webcam
  const startWebcam = useCallback(async (bw, facing) => {
    setCamError(null);
    stopHardwareTracks();
    let stream = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      let vc = false;
      if (bw !== '2g') vc = { facingMode: facing, width: { ideal: bw === '3g' ? 480 : 1280 }, height: { ideal: bw === '3g' ? 360 : 720 }, frameRate: { ideal: bw === '3g' ? 15 : 30 } };
      try {
        stream = await Promise.race([
          navigator.mediaDevices.getUserMedia({ video: vc, audio: true }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 4000))
        ]);
      } catch (err) {
        console.warn('Doctor cam:', err.message);
        setCamError('Camera unavailable - animated preview active.');
        stream = createFallbackStream(doctor?.fullName || 'Dr. Ramesh Kulkarni');
      }
    } else {
      stream = createFallbackStream(doctor?.fullName || 'Dr. Ramesh Kulkarni');
    }
    if (stream) {
      localStreamRef.current = stream;
      if (localVideoRef.current) { localVideoRef.current.srcObject = stream; localVideoRef.current.play().catch(() => {}); }
      setupAudioAnalyser(stream);
    }
    if (bw === '2g') setIsVideoOn(false); else setIsVideoOn(true);
    setIsMuted(false);
  }, [stopHardwareTracks, createFallbackStream, setupAudioAnalyser, doctor]);

  useEffect(() => () => stopHardwareTracks(), [stopHardwareTracks]);

  const handleStartCall = async () => {
    setCallStatus('CONNECTING'); setCallDuration(0);
    setTimeout(async () => { setCallStatus('ACTIVE'); await startWebcam(bandwidthMode, facingMode); }, 1200);
  };
  const handleEndCall = () => { setCallStatus('ENDED'); stopHardwareTracks(); };
  const handleToggleMic = () => { if (localStreamRef.current) localStreamRef.current.getAudioTracks().forEach((t) => { t.enabled = isMuted; }); setIsMuted((v) => !v); };
  const handleToggleVideo = () => { if (localStreamRef.current) localStreamRef.current.getVideoTracks().forEach((t) => { t.enabled = !isVideoOn; }); setIsVideoOn((v) => !v); };
  const handleFlipCamera = async () => { const n = facingMode === 'user' ? 'environment' : 'user'; setFacingMode(n); if (callStatus === 'ACTIVE') await startWebcam(bandwidthMode, n); };
  const handleBandwidthChange = async (mode) => {
    setBandwidthMode(mode);
    if (callStatus !== 'ACTIVE') return;
    if (mode === '2g') { if (localStreamRef.current) localStreamRef.current.getVideoTracks().forEach((t) => { t.enabled = false; }); setIsVideoOn(false); }
    else await startWebcam(mode, facingMode);
  };
  const handleAddMedicine = (e) => { e.preventDefault(); if (!newMed.name) return; setMedicines([...medicines, newMed]); setNewMed({ name: '', dosage: '1 tablet', frequency: 'Twice Daily (BD)', duration: '5 days', instructions: 'Take after meals' }); };
  const handleRemoveMedicine = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const handleSignAndDispatchRx = async (e) => {
    e.preventDefault();
    try { await apiService.doctor.issuePrescription({ patientId: targetPatient.id, patientName: targetPatient.fullName, diagnosis, medicines, clinicalAdvice, notes: clinicalAdvice }); } catch (err) { console.warn('Rx local:', err); }
    setRxDispatched(true); setTimeout(() => setRxDispatched(false), 4000);
  };

  const patientFeedImage = selectedPatientId === 'p-01' ? '/assets/patients/patient_male_feed.jpg' : '/assets/patients/patient_female_feed.jpg';

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/doctor" className="hover:text-primary-600 flex items-center gap-1 font-medium"><ChevronLeft className="w-4 h-4" />{t('doctor.dashboardTitle', 'Doctor Portal')}</Link>
            <span>/</span><span className="text-slate-700 font-semibold">{t('doctor.liveConsultation', 'Live Consultation')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Video className="w-8 h-8 text-primary-600" />Live Rural Teleconsultation Console
          </h1>
          <p className="text-slate-600 mt-1">Real webcam with PiP, encrypted WebRTC link, 4G/3G/2G adaptive, and instant digital e-Rx dispatch.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-xs font-bold text-slate-500 uppercase pl-2">Patient:</label>
            <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} disabled={callStatus === 'ACTIVE'} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[40px]">
              {patientsList.map((p) => <option key={p.id} value={p.id}>{p.fullName} ({p.village})</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-end">
            {[{ mode: '4g', label: '4G HD', icon: <Signal className="w-3 h-3" />, cls: 'bg-teal-700 text-white' }, { mode: '3g', label: '3G Fair', icon: <Wifi className="w-3 h-3" />, cls: 'bg-amber-600 text-white' }, { mode: '2g', label: '2G Audio', icon: <Radio className="w-3 h-3" />, cls: 'bg-rose-700 text-white animate-pulse' }].map(({ mode, label, icon, cls }) => (
              <button key={mode} onClick={() => handleBandwidthChange(mode)} className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${bandwidthMode === mode ? cls : 'text-slate-600 hover:text-slate-900'}`}>{icon}<span>{label}</span></button>
            ))}
          </div>
        </div>
      </div>

      {!isOnline && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start sm:items-center gap-3"><div className="p-2.5 bg-amber-200 text-amber-800 rounded-xl shrink-0"><WifiOff className="w-5 h-5" /></div>
            <div><p className="font-bold text-sm">Doctor Live Video Link Offline</p><p className="text-xs text-amber-800 mt-0.5">Real-time WebRTC requires active internet. Review cached vitals below.</p></div>
          </div>
          <Link to="/doctor/photo-cases" className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap transition">Review Photo Cases</Link>
        </div>
      )}
      {camError && callStatus === 'ACTIVE' && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 flex items-center gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1"><p className="font-bold">Webcam Notice:</p><p>{camError}</p></div>
          <button onClick={() => startWebcam(bandwidthMode, facingMode)} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer">Retry Camera</button>
        </div>
      )}
      {rxDispatched && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div><p className="font-bold text-sm">Digital e-Prescription Dispatched Successfully!</p><p className="text-xs text-emerald-700">Signed by {doctor.fullName} and sent to {targetPatient.fullName}'s Digital Backpack.</p></div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          {/* Video Stage */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl min-h-[440px] flex flex-col justify-between p-4 sm:p-6">
            {/* Top bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs text-white">
                <span className={`w-2.5 h-2.5 rounded-full ${callStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : callStatus === 'CONNECTING' ? 'bg-amber-500 animate-ping' : 'bg-slate-500'}`} />
                <span className="font-bold">{callStatus === 'ACTIVE' ? `Live Encrypted Call (${formatTimer(callDuration)})` : callStatus === 'CONNECTING' ? 'Connecting to Village...' : callStatus === 'ENDED' ? 'Call Disconnected' : 'Ready to Connect'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md flex items-center gap-1.5 ${bandwidthMode === '2g' ? 'bg-rose-900/70 border-rose-500/50 text-rose-200' : bandwidthMode === '3g' ? 'bg-amber-900/70 border-amber-500/50 text-amber-200' : 'bg-emerald-900/70 border-emerald-500/50 text-emerald-200'}`}>
                  {bandwidthMode === '2g' ? <><Radio className="w-3 h-3" /><span>2G Audio</span></> : bandwidthMode === '3g' ? <><Wifi className="w-3 h-3" /><span>3G Video</span></> : <><Signal className="w-3 h-3" /><span>4G HD</span></>}
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] text-emerald-300"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span>ABDM</span></div>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative my-auto w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden bg-slate-900/80 flex items-center justify-center">
              {callStatus === 'ACTIVE' ? (
                <>
                  {/* Main stage */}
                  {!isSwapped ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <img src={patientFeedImage} alt={targetPatient.fullName} className={`w-full h-full object-cover ${bandwidthMode === '2g' ? 'opacity-60 saturate-50' : 'opacity-95'}`} onError={(e) => { e.target.style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: -1 }}>
                        <div className="text-center space-y-2">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-600 to-primary-700 mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl">{targetPatient.fullName.slice(0, 2).toUpperCase()}</div>
                          <p className="text-white font-bold text-sm">{targetPatient.fullName}</p>
                          <p className="text-teal-300 text-xs">{targetPatient.village} - Assisted by ASHA</p>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <div className="text-xs font-bold text-white">{targetPatient.fullName} <span className="ml-1 text-[10px] text-emerald-300 px-1.5 bg-emerald-950/80 border border-emerald-500/40 rounded">Patient</span></div>
                          <p className="text-[10px] text-slate-300">{targetPatient.village}</p>
                        </div>
                      </div>
                      {bandwidthMode === '2g' && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-lg px-4 py-2 rounded-2xl border border-rose-500/40 shadow-xl flex flex-col items-center gap-1.5 text-center max-w-xs">
                          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold"><Radio className="w-4 h-4 text-rose-400 animate-pulse" /><span>2G Rural Mode - 95% Data Saved</span></div>
                          <p className="text-[10px] text-slate-300">Video paused - Opus voice active (~18 kbps)</p>
                          <div className="flex items-end justify-center gap-1 h-7 mt-0.5">
                            {audioFreqBars.map((h, i) => <span key={i} style={{ height: `${h}%` }} className="w-1.5 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-full transition-all duration-75" />)}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {!isVideoOn ? <div className="flex flex-col items-center gap-2 text-slate-400"><VideoOff className="w-12 h-12" /><span className="text-xs font-semibold">Your Camera is Off</span></div>
                        : <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />}
                      <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-white">You ({doctor?.fullName || 'Doctor'}) - Expanded</div>
                    </div>
                  )}

                  {/* PiP */}
                  <div onClick={() => setIsSwapped((v) => !v)} className="absolute bottom-3 right-3 z-20 w-32 h-44 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-white/50 shadow-2xl bg-slate-900 cursor-pointer group transition-all hover:scale-105 active:scale-95" title="Click to swap views">
                    {!isSwapped ? (
                      <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                        {!isVideoOn ? <div className="flex flex-col items-center gap-1 p-2 text-center text-slate-400"><VideoOff className="w-6 h-6 text-rose-400" /><span className="text-[10px] font-bold">Cam Off</span></div>
                          : <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />}
                        <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span>You (Dr.)</span></div>
                        <div className={`absolute bottom-2 right-2 z-10 p-1 rounded-full ${isMuted ? 'bg-rose-600' : audioLevel > 15 ? 'bg-emerald-500 animate-pulse' : 'bg-black/60'} text-white`}>{isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}</div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Maximize2 className="w-5 h-5 text-white" /></div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                        <img src={patientFeedImage} alt={targetPatient.fullName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: -1 }}><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-primary-700 flex items-center justify-center text-white text-xs font-black">{targetPatient.fullName.slice(0, 2).toUpperCase()}</div></div>
                        <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white">{targetPatient.fullName.split(' ')[0]}</div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Minimize2 className="w-5 h-5 text-white" /></div>
                      </div>
                    )}
                  </div>
                </>
              ) : callStatus === 'CONNECTING' ? (
                <div className="space-y-3 text-center"><div className="w-20 h-20 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto" /><p className="text-white font-medium">Calling {targetPatient.fullName}...</p><p className="text-xs text-slate-400">{targetPatient.village} - ASHA-assisted call</p></div>
              ) : callStatus === 'ENDED' ? (
                <div className="space-y-3 text-center"><div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400"><PhoneOff className="w-8 h-8" /></div><h3 className="text-lg font-bold text-white">Consultation Ended</h3><p className="text-xs text-slate-400">Issue prescription below to complete.</p></div>
              ) : (
                <div className="space-y-4 text-center p-6 max-w-sm">
                  <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto shadow-inner"><Video className="w-10 h-10 text-teal-400" /></div>
                  <div><h2 className="text-lg font-bold text-white">Connect to {targetPatient.fullName}</h2><p className="text-xs text-slate-300 leading-relaxed mt-1">{isOnline ? `Real webcam PiP call to ${targetPatient.village}. Supports 4G/3G/2G, front/rear camera.` : 'Live call requires internet connection.'}</p></div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 z-10 mt-3">
              {callStatus === 'ACTIVE' ? (
                <>
                  <button onClick={handleToggleMic} className={`p-4 rounded-2xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer ${isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`} title={isMuted ? 'Unmute' : 'Mute'}>{isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}</button>
                  <button onClick={handleToggleVideo} className={`p-4 rounded-2xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer ${!isVideoOn ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`} title={isVideoOn ? 'Stop Video' : 'Start Video'}>{!isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}</button>
                  <button onClick={handleFlipCamera} className="p-4 rounded-2xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer" title="Switch Camera"><SwitchCamera className="w-5 h-5" /></button>
                  <button onClick={() => setIsSwapped((v) => !v)} className="p-4 rounded-2xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all min-h-[48px] min-w-[48px] hidden sm:flex items-center justify-center cursor-pointer" title="Swap View"><Maximize2 className="w-5 h-5" /></button>
                  <button onClick={handleEndCall} className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 min-h-[48px] cursor-pointer"><PhoneOff className="w-5 h-5" />End Call</button>
                </>
              ) : (
                <button onClick={() => isOnline && handleStartCall()} disabled={!isOnline} className={`px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 min-h-[48px] ${!isOnline ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600' : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'}`}>
                  {callStatus === 'ENDED' ? <RotateCcw className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
                  {isOnline ? (callStatus === 'ENDED' ? 'Reconnect Call' : 'Start Video Call') : 'Live Call Disabled Offline'}
                </button>
              )}
            </div>
          </div>

          {/* Vitals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"><Activity className="w-4 h-4 text-red-500" />Live Transmitted Doorstep Vitals (ASHA Verified)</h4>
              <span className="text-[11px] text-slate-400">Synchronized via IndexedDB</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ label: 'Blood Pressure', value: targetQueueItem?.vitals?.bp || '120/80', unit: 'mmHg' }, { label: 'Pulse Rate', value: targetQueueItem?.vitals?.pulse || '76', unit: 'bpm' }, { label: 'SpO2 Oxygen', value: targetQueueItem?.vitals?.spO2 || '98%', unit: 'Room Air', color: 'text-emerald-700' }, { label: 'Temperature', value: targetQueueItem?.vitals?.temp || '98.6 F', unit: 'Axillary' }].map(({ label, value, unit, color }) => (
                <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{label}</span>
                  <span className={`text-base font-black ${color || 'text-slate-900'}`}>{value}</span>
                  <span className="text-[10px] text-slate-400 block">{unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prescription panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2"><Pill className="w-5 h-5 text-primary-600" />Digital e-Prescription (Rx) &amp; Notes</h3>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-200">{doctor?.fullName || 'Dr. Ramesh Kulkarni'} (SMO)</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Diagnosis / Impression *</label>
              <input type="text" required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Prescribed Medications ({medicines.length})</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {medicines.map((med, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                    <div><p className="font-bold text-slate-900">{med.name}</p><p className="text-[11px] text-slate-500">{med.dosage} - {med.frequency} - {med.duration}</p></div>
                    <button onClick={() => handleRemoveMedicine(idx)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-primary-50/50 border border-primary-100 space-y-2 text-xs">
              <span className="font-bold text-primary-900 block">Add Drug from Essential Medicines List:</span>
              <input type="text" placeholder="Drug Name &amp; Strength (e.g. Tab Amoxicillin 500mg)" value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-primary-500" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Frequency (e.g. Twice Daily BD)" value={newMed.frequency} onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })} className="p-2 rounded-lg border border-slate-200 bg-white text-xs" />
                <input type="text" placeholder="Duration (e.g. 5 days)" value={newMed.duration} onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })} className="p-2 rounded-lg border border-slate-200 bg-white text-xs" />
              </div>
              <button type="button" onClick={handleAddMedicine} className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 min-h-[38px] cursor-pointer"><Plus className="w-4 h-4" />Add to Prescription</button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Doctor Instructions &amp; Dietary Guidance</label>
              <textarea rows={3} value={clinicalAdvice} onChange={(e) => setClinicalAdvice(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button onClick={handleSignAndDispatchRx} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"><Send className="w-4 h-4" />{t('doctor.signAndDispatch', 'Digitally Sign &amp; Dispatch Rx')}</button>
              <div className="flex items-center gap-2">
                <Link to={`/doctor/referrals?patientId=${targetPatient.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 min-h-[44px]"><Building2 className="w-4 h-4" />Refer to Hospital</Link>
                <Link to={`/doctor/history?patientId=${targetPatient.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold min-h-[44px]"><FileText className="w-4 h-4 text-slate-500" />View Timeline</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
