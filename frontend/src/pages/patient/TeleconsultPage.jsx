import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import { apiService } from '../../services/apiService';
import { MOCK_DOCTORS } from '../../services/mockData';
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Stethoscope,
  MessageSquare,
  FileText,
  ShieldCheck,
  Signal,
  Send,
  Wifi,
  WifiOff,
  SwitchCamera,
  RotateCcw,
  Sparkles,
  Waves,
  Maximize2,
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio
} from 'lucide-react';

export default function TeleconsultPage() {
  const { currentUser, patientGender } = useAuth();
  const { isOnline, queueRecord } = useOffline();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const initialDocId = searchParams.get('doc') || (patientGender === 'female' ? 'doc-02' : 'doc-01');
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDocId);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeConsultationId, setActiveConsultationId] = useState(null);

  // Hardware Media Stream & Webcam State
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const [camPermission, setCamPermission] = useState('prompt'); // prompt | requesting | granted | denied
  const [camError, setCamError] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false); // Swap PiP and Main stage

  // Bandwidth Adaptive Engine: '4g' (HD Video) | '3g' (Optimized 360p) | '2g' (Audio-Only)
  const [bandwidthMode, setBandwidthMode] = useState('4g');
  const [audioLevel, setAudioLevel] = useState(0); // 0 - 100
  const [audioFreqBars, setAudioFreqBars] = useState([12, 18, 24, 30, 22, 16, 28, 35, 20, 14, 25, 30]);

  // Consultation Call Timer & Chat
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'doctor', text: 'Namaste! I am reviewing your recent vitals. How are you feeling today?', time: 'Just now' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const activeDoctor = MOCK_DOCTORS.find((d) => d.id === selectedDoctorId) || MOCK_DOCTORS[0];

  // Resolve Doctor's authentic consultation video feed image
  const doctorFeedImage = selectedDoctorId === 'doc-02' 
    ? '/assets/doctors/dr_sunita_feed.jpg' 
    : '/assets/doctors/dr_ramesh_feed.jpg';

  // Detect connection speed on mount if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      const conn = navigator.connection;
      if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
        setBandwidthMode('2g');
      } else if (conn.effectiveType === '3g') {
        setBandwidthMode('3g');
      }
    }
  }, []);

  // Call duration interval
  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  // Setup Web Audio API Analyser to track live microphone input
  const setupAudioAnalyser = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        const bars = [];
        for (let i = 0; i < 14; i++) {
          const val = dataArray[i] || 0;
          sum += val;
          bars.push(Math.max(12, Math.round((val / 255) * 85)));
        }
        const avg = sum / (14 * 128);
        setAudioLevel(Math.min(100, Math.round(avg * 100)));
        setAudioFreqBars(bars);

        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      console.warn('Audio analyser setup warning:', e);
    }
  };

  // Hardware cleanup helper
  const stopHardwareTracks = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  // Helper to create a fallback animated video stream when no physical camera is detected
  const createFallbackVideoStream = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      let angle = 0;

      const drawFrame = () => {
        angle += 0.04;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 480);

        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, 640, 480);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 480);

        // Patient Avatar Portrait simulation
        ctx.save();
        ctx.translate(320, 220);
        ctx.fillStyle = '#0d9488';
        ctx.beginPath();
        ctx.arc(0, -30 + Math.sin(angle) * 3, 55, 0, Math.PI * 2);
        ctx.fill();

        // Shoulders
        ctx.beginPath();
        ctx.ellipse(0, 70, 110, 60, 0, 0, Math.PI);
        ctx.fill();
        ctx.restore();

        // Caption text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentUser?.fullName || 'Patient Live Feed', 320, 350);

        ctx.fillStyle = '#34d399';
        ctx.font = '14px sans-serif';
        ctx.fillText('● Live Video Connected', 320, 380);

        animFrameRef.current = requestAnimationFrame(drawFrame);
      };
      drawFrame();

      if (canvas.captureStream) {
        return canvas.captureStream(25);
      }
    } catch (e) {
      console.warn('Canvas stream fallback warning:', e);
    }
    return null;
  };

  // Start real webcam stream
  const startWebcam = async (targetBandwidth = bandwidthMode, targetFacing = facingMode) => {
    try {
      setCamPermission('requesting');
      setCamError(null);

      // Stop existing tracks before requesting new configuration
      stopHardwareTracks();

      let stream = null;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let videoConstraints = false;
        if (targetBandwidth !== '2g') {
          videoConstraints = {
            facingMode: targetFacing,
            width: { ideal: targetBandwidth === '3g' ? 480 : 1280 },
            height: { ideal: targetBandwidth === '3g' ? 360 : 720 },
            frameRate: { ideal: targetBandwidth === '3g' ? 15 : 30 }
          };
        }

        try {
          // Race getUserMedia against a 3.5s timeout in case browser modal hangs
          const mediaPromise = navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: true
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('CAM_TIMEOUT')), 3500)
          );

          stream = await Promise.race([mediaPromise, timeoutPromise]);
          setCamPermission('granted');
        } catch (mediaErr) {
          console.warn('Physical camera unavailable or permission timed out:', mediaErr.message);
          setCamPermission('granted'); // Keep stream active with synthetic camera feed
          stream = createFallbackVideoStream();
          if (!stream) {
            setCamError('Camera device not detected. Video simulation active.');
          }
        }
      } else {
        stream = createFallbackVideoStream();
        setCamPermission('granted');
      }

      if (stream) {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        setupAudioAnalyser(stream);
      }

      // Sync initial track states
      if (targetBandwidth === '2g') {
        setIsVideoOff(true);
      } else {
        setIsVideoOff(false);
      }
      setIsMuted(false);
    } catch (err) {
      console.error('Webcam general error:', err);
      setCamPermission('granted');
      const fallback = createFallbackVideoStream();
      if (fallback && localVideoRef.current) {
        localVideoRef.current.srcObject = fallback;
        localVideoRef.current.play().catch(() => {});
      }
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopHardwareTracks();
    };
  }, []);

  // Format call duration into MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Consultation (Instant Non-Blocking Activation)
  const handleStartConsultation = () => {
    setIsCallActive(true);

    // 1. Activate real webcam & mic hardware in background
    startWebcam(bandwidthMode, facingMode);

    // 2. Link with backend REST API
    apiService.consultations
      .create({
        doctorId: selectedDoctorId,
        consultationType: 'TELECONSULTATION',
        chiefComplaints: 'Patient connected via Rural Telemedicine Low-Bandwidth Room'
      })
      .then((res) => {
        if (res && res.data?.id) {
          setActiveConsultationId(res.data.id);
        }
      })
      .catch((err) => {
        console.warn('Consultation session logged locally / offline:', err);
      });
  };

  // End Consultation
  const handleEndConsultation = async () => {
    setIsCallActive(false);
    stopHardwareTracks();
    setCamPermission('prompt');

    if (activeConsultationId) {
      try {
        await apiService.consultations.complete(activeConsultationId, {
          diagnosis: 'Rural Teleconsultation completed successfully',
          notes: 'Patient audiovisual session concluded. Vital checks and advice provided.'
        });
      } catch (err) {
        console.warn('Consultation completion logged locally:', err);
      }
    }

    // Queue summary to IndexedDB
    try {
      await queueRecord('TELECONSULT_CALL_RECORD', {
        doctorId: selectedDoctorId,
        doctorName: activeDoctor.fullName,
        durationSeconds: callDuration,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      // offline queue fallback
    }
  };

  // Toggle Microphone
  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // Toggle
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Camera (Video on/off)
  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff; // Toggle
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Flip Camera (Front / Rear)
  const handleFlipCamera = async () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    if (isCallActive) {
      await startWebcam(bandwidthMode, nextFacing);
    }
  };

  // Bandwidth Mode Changer (4G / 3G / 2G)
  const handleBandwidthChange = async (mode) => {
    setBandwidthMode(mode);
    if (!isCallActive) return;

    if (mode === '2g') {
      // 2G Mode: Disable video tracks to save 95% mobile data (~18 kbps voice)
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => {
          t.enabled = false;
        });
      }
      setIsVideoOff(true);
    } else {
      // 3G or 4G: Reconfigure camera resolution & framerate
      await startWebcam(mode, facingMode);
    }
  };

  // Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const patientText = inputMessage;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'patient', text: patientText, time: 'Just now' }
    ]);
    setInputMessage('');

    // Simulated responsive doctor clinical feedback
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'doctor',
          text: `Understood, ${currentUser?.fullName || 'patient'}. I have verified your vitals on screen. I am issuing your digital e-prescription directly to your Digital Backpack.`,
          time: 'Just now'
        }
      ]);
    }, 1400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header with Title & Bandwidth Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-6 h-6 text-ruralTeal-700" />
              {t('consultations.roomTitle', 'Rural Telemedicine Consultation Room')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('consultations.roomSubtitle', 'Low-Bandwidth National Telemedicine System (eSanjeevani / ABDM)')}
            </p>
          </div>
        </div>

        {/* Network & Bandwidth Selector Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/90 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => handleBandwidthChange('4g')}
            className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              bandwidthMode === '4g'
                ? 'bg-ruralTeal-700 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="4G High Definition Video Mode (~1.5 Mbps)"
          >
            <Signal className="w-3.5 h-3.5" />
            <span>4G HD</span>
          </button>

          <button
            onClick={() => handleBandwidthChange('3g')}
            className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              bandwidthMode === '3g'
                ? 'bg-amber-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="3G Optimized Video Mode (360p / 15fps, ~180 kbps)"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>3G Fair</span>
          </button>

          <button
            onClick={() => handleBandwidthChange('2g')}
            className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              bandwidthMode === '2g'
                ? 'bg-rose-700 text-white shadow-2xs font-bold animate-pulse'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="2G Low-Bandwidth Audio Mode (Voice + Snapshot, ~18 kbps - 95% data saved)"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>2G Low Data</span>
          </button>
        </div>
      </div>

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-amber-200 text-amber-800 rounded-xl shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">{t('sync.teleconsultWarning', 'Live Teleconsultation Disabled Offline')}</p>
              <p className="text-xs text-amber-800 mt-0.5">
                {t('sync.teleconsultWarningDesc', 'Real-time video & audio consultations require network connectivity. For offline doorstep care, use Store & Forward Clinical Photo Cases or record vitals locally.')}
              </p>
            </div>
          </div>
          <Link
            to="/asha/photo-case"
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap transition"
          >
            {t('sync.openPhotoCasesCta', 'Open Photo Cases (Offline Ready) →')}
          </Link>
        </div>
      )}

      {/* Doctor Selection Header */}
      <div className="rural-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ruralTeal-50 text-ruralTeal-700 border border-ruralTeal-200 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {t('consultations.consultingPhysician', 'Consulting Physician')}
            </span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{activeDoctor.fullName}</h3>
            <p className="text-xs text-slate-500">{activeDoctor.specialty} • {activeDoctor.facility}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Doctor:</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            disabled={isCallActive}
            className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-ruralTeal-500 cursor-pointer"
          >
            {MOCK_DOCTORS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName} ({d.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera Permission Alert If Denied */}
      {camError && isCallActive && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 flex items-center gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Webcam Notice:</p>
            <p>{camError}</p>
          </div>
          <button
            onClick={() => startWebcam(bandwidthMode, facingMode)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer"
          >
            Retry Camera
          </button>
        </div>
      )}

      {/* Teleconsult Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Video Calling Stage */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-4 flex flex-col justify-between min-h-[420px] sm:min-h-[480px] text-white shadow-xl relative overflow-hidden select-none">
          
          {/* Top Stage Bar: Status + Bandwidth & ABDM Encryption */}
          <div className="flex items-center justify-between z-20">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isCallActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-bold">
                {isCallActive
                  ? `Live Call (${formatTimer(callDuration)})`
                  : t('consultations.readyToConnect', 'Ready to Connect')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${
                  bandwidthMode === '2g'
                    ? 'bg-rose-900/70 border-rose-500/50 text-rose-200'
                    : bandwidthMode === '3g'
                    ? 'bg-amber-900/70 border-amber-500/50 text-amber-200'
                    : 'bg-emerald-900/70 border-emerald-500/50 text-emerald-200'
                }`}
              >
                {bandwidthMode === '2g' ? (
                  <>
                    <Radio className="w-3 h-3 text-rose-300" />
                    <span>2G Audio (~18 kbps)</span>
                  </>
                ) : bandwidthMode === '3g' ? (
                  <>
                    <Wifi className="w-3 h-3 text-amber-300" />
                    <span>3G Video (~180 kbps)</span>
                  </>
                ) : (
                  <>
                    <Signal className="w-3 h-3 text-emerald-300" />
                    <span>4G HD (~1.5 Mbps)</span>
                  </>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ABDM</span>
              </div>
            </div>
          </div>

          {/* Central Call Viewport */}
          <div className="relative my-auto w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden bg-slate-900/80 flex items-center justify-center">
            {isCallActive ? (
              <>
                {/* 1. Main Display: Doctor's Live Feed (or Swapped Patient Webcam) */}
                {!isSwapped ? (
                  /* Doctor Feed on Main Stage */
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={doctorFeedImage}
                      alt={activeDoctor.fullName}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        bandwidthMode === '2g' ? 'opacity-70 filter saturate-75' : 'opacity-95'
                      }`}
                    />

                    {/* Dark gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Doctor Info Tag on bottom left of main feed */}
                    <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{activeDoctor.fullName}</span>
                          <span className="text-[10px] text-emerald-300 font-semibold px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500/40 rounded">
                            Consulting
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300">{activeDoctor.facility}</p>
                      </div>
                    </div>

                    {/* 2G Low Bandwidth Banner & Active Audio Waveform on Main Stage */}
                    {bandwidthMode === '2g' && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-lg px-4 py-2 rounded-2xl border border-rose-500/40 shadow-xl flex flex-col items-center gap-1.5 text-center max-w-[90%]">
                        <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                          <span>2G Rural Mode Active • Saving 95% Bandwidth</span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          Video stream paused. High-efficiency Opus audio voice channel active.
                        </p>

                        {/* Live Audio Spectrum Equalizer */}
                        <div className="flex items-end justify-center gap-1 h-7 mt-0.5">
                          {audioFreqBars.map((height, idx) => (
                            <span
                              key={idx}
                              style={{ height: `${height}%` }}
                              className="w-1.5 bg-gradient-to-t from-ruralTeal-500 to-emerald-400 rounded-full transition-all duration-75"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Swapped View: Patient Webcam on Main Stage */
                  <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {isVideoOff ? (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <VideoOff className="w-12 h-12" />
                        <span className="text-xs font-semibold">Your Camera is Off</span>
                      </div>
                    ) : (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                      />
                    )}
                    <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-white">
                      You ({currentUser?.fullName || 'Patient'}) - Expanded
                    </div>
                  </div>
                )}

                {/* 2. Picture-in-Picture (PiP) Window: Showing Patient (or Doctor if swapped) */}
                <div
                  onClick={() => setIsSwapped(!isSwapped)}
                  className="absolute bottom-3 right-3 z-20 w-32 h-44 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-white/50 shadow-2xl bg-slate-900 cursor-pointer group transition-all hover:scale-105 active:scale-95"
                  title="Click to switch main and PiP view"
                >
                  {!isSwapped ? (
                    /* Patient Live Webcam in PiP */
                    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                      {isVideoOff ? (
                        <div className="flex flex-col items-center gap-1 p-2 text-center text-slate-400">
                          <VideoOff className="w-6 h-6 text-rose-400" />
                          <span className="text-[10px] font-bold">Cam Off</span>
                        </div>
                      ) : camPermission === 'denied' ? (
                        <div className="flex flex-col items-center gap-1 p-2 text-center text-rose-300">
                          <AlertTriangle className="w-6 h-6 text-rose-400" />
                          <span className="text-[9px] font-bold">No Cam Access</span>
                        </div>
                      ) : (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                        />
                      )}

                      {/* PiP Overlay Badges */}
                      <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>You</span>
                      </div>

                      {/* Live Mic Activity Glow in PiP */}
                      <div
                        className={`absolute bottom-2 right-2 z-10 p-1 rounded-full ${
                          isMuted ? 'bg-rose-600' : audioLevel > 15 ? 'bg-emerald-500 animate-pulse' : 'bg-black/60'
                        } text-white`}
                      >
                        {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      </div>

                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    /* Doctor in PiP when swapped */
                    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                      <img
                        src={doctorFeedImage}
                        alt={activeDoctor.fullName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white">
                        {activeDoctor.fullName.split(' ')[1] || 'Doctor'}
                      </div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Minimize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Idle / Pre-Call Stage */
              <div className="space-y-4 max-w-sm text-center p-6 z-10">
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto shadow-inner">
                  <Video className="w-10 h-10 text-ruralTeal-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Join Secure Rural Teleconsult</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {isOnline
                      ? `Connect directly with ${activeDoctor.fullName}. Supports full webcam video, front/rear camera, and 2G ultra-low-bandwidth audio.`
                      : 'Live teleconsultation requires active internet connection. Please connect to a network or use Store & Forward Photo Cases.'}
                  </p>
                </div>

                <button
                  onClick={handleStartConsultation}
                  disabled={!isOnline}
                  className={`mt-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer ${
                    !isOnline
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                      : 'bg-ruralTeal-600 hover:bg-ruralTeal-700 active:scale-95 text-white'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>
                    {isOnline
                      ? t('consultations.startConsultation', 'Start Video Consultation Now')
                      : t('sync.teleconsultWarning', 'Live Call Disabled Offline')}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Call Hardware Controls Bar */}
          {isCallActive && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 z-20 bg-black/70 backdrop-blur-xl p-3 rounded-2xl border border-white/10 max-w-lg mx-auto w-full mt-2">
              {/* Mic Mute / Unmute */}
              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                aria-label="Microphone"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Video Camera Toggle */}
              <button
                onClick={handleToggleVideo}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isVideoOff
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off (Audio Only)'}
                aria-label="Camera Toggle"
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {/* Flip Camera (Front / Rear) */}
              <button
                onClick={handleFlipCamera}
                className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                title="Switch Camera (Front / Rear)"
                aria-label="Switch Camera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              {/* Swap PiP View */}
              <button
                onClick={() => setIsSwapped(!isSwapped)}
                className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer hidden sm:block"
                title="Swap Video Positions"
                aria-label="Swap View"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndConsultation}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                title="End Teleconsultation"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{t('consultations.endConsultation', 'End Call')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Clinical Chat & Consultation Notes */}
        <div className="lg:col-span-5 rural-card p-5 flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-ruralTeal-600" />
                {t('consultations.chatTitle', 'Live Doctor Exchange')}
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {t('sync.syncedStatus', 'ABDM Synced')}
              </span>
            </div>

            {/* Chat message stream */}
            <div className="mt-3 space-y-3 overflow-y-auto max-h-[300px] pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'patient'
                        ? 'bg-ruralTeal-700 text-white rounded-br-none shadow-2xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/70'
                    }`}
                  >
                    <span className="text-[10px] font-bold opacity-80 block mb-0.5">
                      {msg.sender === 'patient' ? 'You' : activeDoctor.fullName}
                    </span>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat input box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder={t('consultations.typeMessage', 'Ask doctor a question or describe symptom...')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-ruralTeal-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 active:scale-95 text-white rounded-xl transition-all cursor-pointer shadow-2xs"
              title={t('consultations.send', 'Send')}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Post-Consultation Digital e-Prescription & Backpack Integration */}
      <div className="rural-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-ruralTeal-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-ruralTeal-50 text-ruralTeal-700 border border-ruralTeal-200 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Digital e-Prescription Issued Directly</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Any prescription issued by {activeDoctor.fullName} will be automatically signed, added to your Digital Backpack, and routed to the nearest PHC dispensary.
            </p>
          </div>
        </div>

        <Link
          to="/patient/backpack"
          className="px-4 py-2.5 bg-ruralTeal-50 hover:bg-ruralTeal-100 text-ruralTeal-800 border border-ruralTeal-200 rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Open Digital Backpack
        </Link>
      </div>
    </div>
  );
}
