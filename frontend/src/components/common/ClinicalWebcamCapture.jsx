import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RotateCw,
  RefreshCw,
  Upload,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { CLINICAL_PHOTOS } from '../../services/clinicalPhotos';

/**
 * Play a subtle synthetic camera shutter click sound using Web Audio API
 */
function playShutterSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {
    // AudioContext might be blocked until user gesture, safely ignore
  }
}

export default function ClinicalWebcamCapture({
  onPhotoCaptured,
  onCancel,
  category = 'DERMATOLOGY',
  initialPhoto = null,
  embedded = false
}) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('WEBCAM'); // 'WEBCAM' | 'UPLOAD'
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (rear) or 'user' (front)
  const [isStreaming, setIsStreaming] = useState(false);
  const [camError, setCamError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(initialPhoto);
  const [isFlashing, setIsFlashing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop hardware media tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Start webcam hardware stream
  const startStream = useCallback(async (facing = facingMode) => {
    stopStream();
    setCamError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCamError('Webcam API is not supported in this browser. Please use the Upload tab.');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => {});
          setIsStreaming(true);
        };
      }
    } catch (err) {
      console.warn('Webcam access error:', err);
      if (facing === 'environment') {
        // Fallback to front camera if environment camera doesn't exist
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });
          streamRef.current = fallbackStream;
          setFacingMode('user');
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            videoRef.current.play().catch(() => {});
            setIsStreaming(true);
          }
          return;
        } catch (fbErr) {
          // Both failed
        }
      }

      setCamError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. Please allow camera access in your browser or switch to upload.'
          : 'Could not access camera hardware. Check if another app is using it or upload an image.'
      );
      setIsStreaming(false);
    }
  }, [facingMode, stopStream]);

  // Handle activeTab changes
  useEffect(() => {
    if (activeTab === 'WEBCAM' && !capturedImage) {
      startStream(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [activeTab, capturedImage, facingMode, startStream, stopStream]);

  // Flip camera between front and back
  const handleFlipCamera = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    startStream(nextFacing);
  };

  // Capture snapshot from live video element
  const handleTakeSnapshot = () => {
    if (!videoRef.current || !isStreaming) return;

    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 250);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add subtle timestamp watermark for clinical legal audit
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(16, canvas.height - 42, 380, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`AarogyaSync Clinical Photo • ${new Date().toLocaleString()}`, 24, canvas.height - 24);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopStream();
  };

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use clinical sample fallback if no camera hardware is available
  const handleUseSample = () => {
    const sample = CLINICAL_PHOTOS[category] || CLINICAL_PHOTOS.DERMATOLOGY;
    setCapturedImage(sample);
    stopStream();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    if (activeTab === 'WEBCAM') {
      startStream(facingMode);
    }
  };

  // Confirm and return photo
  const handleConfirm = () => {
    if (capturedImage && onPhotoCaptured) {
      onPhotoCaptured(capturedImage);
    }
  };

  const containerClasses = embedded
    ? 'w-full space-y-4'
    : 'bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-in border border-slate-100';

  return (
    <div className={containerClasses}>
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('webcam.captureTitle', 'Clinical Photo Capture')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('webcam.captureSub', 'High-resolution macro photography for tele-consultation')}
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={() => {
              stopStream();
              onCancel();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Switch Tabs */}
      {!capturedImage && (
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('WEBCAM')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'WEBCAM'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            {t('webcam.tabLive', 'Live Webcam')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('UPLOAD')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'UPLOAD'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            {t('webcam.tabUpload', 'Upload Image')}
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[280px] max-h-[420px] aspect-[4/3] sm:aspect-video text-white">
        {/* Shutter White Flash Animation */}
        {isFlashing && (
          <div className="absolute inset-0 z-40 bg-white pointer-events-none animate-ping opacity-90" />
        )}

        {/* 1. Captured Image Preview */}
        {capturedImage ? (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
            <img
              src={capturedImage}
              alt="Clinical Capture"
              className="w-full h-full object-contain"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Quick zoom badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur text-[11px] font-mono text-teal-300 border border-slate-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Photo Captured ({zoomLevel}x)
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => (z >= 2 ? 1 : z + 0.5))}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold"
                title="Toggle Zoom"
              >
                {zoomLevel === 1 ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : activeTab === 'WEBCAM' ? (
          /* 2. Live Webcam Stream with Clinical Crosshair Overlay */
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Live Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* If stream not active or error */}
            {!isStreaming && !camError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90 z-20">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                <p className="text-sm font-semibold text-slate-200">
                  {t('webcam.starting', 'Connecting to camera hardware...')}
                </p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Please grant camera permission in your browser when prompted.
                </p>
              </div>
            )}

            {/* Camera Access Error Fallback */}
            {camError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/95 z-20">
                <AlertCircle className="w-10 h-10 text-amber-400" />
                <p className="text-sm font-bold text-amber-200">{camError}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => startStream(facingMode)}
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition"
                  >
                    Retry Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('UPLOAD')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="px-4 py-2 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-200 text-xs font-bold border border-teal-600 transition"
                  >
                    Use Clinical Sample
                  </button>
                </div>
              </div>
            )}

            {/* Clinical Macro Viewfinder Grid & Focus Ring */}
            {isStreaming && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                {/* Rule-of-thirds grid */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20 border border-white/20">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>

                {/* Focus Crosshairs & Target Box */}
                <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-2xl border-2 border-teal-400/80 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-teal-300 absolute -top-1 -left-1" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-teal-300 absolute -top-1 -right-1" />
                  <div className="w-4 h-4 border-b-2 border-l-2 border-teal-300 absolute -bottom-1 -left-1" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-teal-300 absolute -bottom-1 -right-1" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-teal-300 bg-slate-900/70 px-2 py-0.5 rounded">
                    Macro Align
                  </span>
                </div>

                {/* Top Status Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/80 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE • {facingMode === 'environment' ? 'Rear Camera' : 'User Webcam'}
                </div>

                {/* Flip camera control button */}
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="pointer-events-auto absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-md transition flex items-center gap-1.5 text-xs font-semibold"
                  title="Switch Front / Rear Camera"
                >
                  <RotateCw className="w-4 h-4 text-teal-400" />
                  <span className="hidden sm:inline">Flip</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 3. File Upload Mode */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-slate-900/60 transition"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 transition">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-200">
              Click to browse or drop high-resolution image
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Supports JPEG, PNG, WebP up to 15MB. Ensure natural lighting.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUseSample();
              }}
              className="mt-4 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-slate-700"
            >
              Use Clinical Reference Preset
            </button>
          </div>
        )}
      </div>

      {/* Action Controls Footer */}
      <div className="pt-1">
        {capturedImage ? (
          /* Retake or Confirm Action Buttons */
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 min-h-[46px]"
            >
              <RefreshCw className="w-4 h-4" />
              {t('webcam.retake', 'Retake Photo')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Check className="w-4 h-4" />
              {t('webcam.confirm', 'Use This Photo')}
            </button>
          </div>
        ) : activeTab === 'WEBCAM' ? (
          /* Shutter Capture Button */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500 text-center sm:text-left">
              💡 Hold camera 10–15 cm from skin lesion for optimal focus.
            </p>
            <button
              type="button"
              disabled={!isStreaming}
              onClick={handleTakeSnapshot}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 min-h-[48px] ${
                isStreaming
                  ? 'bg-gradient-to-r from-teal-600 to-primary-600 hover:from-teal-700 hover:to-primary-700 shadow-teal-600/25 active:scale-95 cursor-pointer'
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              {t('webcam.snap', 'Snap Photo')}
            </button>
          </div>
        ) : (
          /* Upload CTA */
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Selected files are encrypted before sync.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition"
            >
              Browse Files...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
