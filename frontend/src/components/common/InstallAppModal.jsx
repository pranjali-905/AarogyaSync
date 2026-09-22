import React from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  MoreVertical, 
  Zap, 
  WifiOff 
} from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose, hasNativePrompt, onNativeInstall, isIOS }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-ruralTeal-700 flex items-center justify-center text-white shadow-md shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                Install AarogyaSync
              </h3>
              <p className="text-xs text-slate-500">
                Download to your mobile phone home screen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Badges */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
          <div className="p-2.5 rounded-xl bg-ruralTeal-50/70 border border-ruralTeal-200/70 flex items-center gap-2">
            <Zap className="w-4 h-4 text-ruralTeal-700 shrink-0" />
            <span>Opens like a real app</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Works 100% offline</span>
          </div>
        </div>

        {/* Instructions */}
        {hasNativePrompt ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Your browser supports direct 1-tap installation. Tap the button below to add AarogyaSync to your home screen.
            </p>
            <button
              onClick={onNativeInstall}
              className="w-full py-3.5 bg-ruralTeal-700 hover:bg-ruralTeal-800 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install App on Phone</span>
            </button>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2.5">
            <span className="font-bold text-slate-900 block">
              Instructions for iPhone (Apple Safari):
            </span>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-ruralTeal-100 text-ruralTeal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span>Tap the <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> <strong>Share</strong> button at the bottom of Safari.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-ruralTeal-100 text-ruralTeal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span>Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-slate-700" /> <strong>Add to Home Screen</strong>.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-ruralTeal-100 text-ruralTeal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span>Tap <strong>Add</strong> in the top-right corner. Done!</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2.5">
            <span className="font-bold text-slate-900 block">
              Instructions for Android (Google Chrome / Brave):
            </span>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-ruralTeal-100 text-ruralTeal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span>Tap the <MoreVertical className="w-3.5 h-3.5 inline mx-1 text-slate-700" /> <strong>three dots</strong> menu in the top-right corner.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-ruralTeal-100 text-ruralTeal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span>Tap <Download className="w-3.5 h-3.5 inline mx-1 text-ruralTeal-700" /> <strong>Install app</strong> (or <strong>Add to Home screen</strong>).</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-ruralTeal-100 text-ruralTeal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span>Tap <strong>Install</strong> to confirm. The app icon will appear on your phone home screen!</span>
            </div>
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
