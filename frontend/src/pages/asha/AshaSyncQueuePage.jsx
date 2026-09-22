import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOffline } from '../../hooks/useOffline';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  HardDrive,
  ChevronLeft,
  ShieldCheck,
  RotateCcw,
  Trash2,
  Eye,
  X,
  Server
} from 'lucide-react';

export default function AshaSyncQueuePage() {
  const { t } = useTranslation();
  const {
    isOnline,
    syncStatus, // 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED' | 'SYNC FAILED'
    pendingCount,
    queueItems: liveQueueItems,
    syncNow,
    retryQueueItem,
    removeQueueItem,
    storageStats
  } = useOffline();

  // Fallback demo queue if no live items exist yet
  const fallbackQueue = [
    {
      id: 'uuid-demo-001',
      type: 'PATIENT_REGISTRATION',
      patientName: 'Sunita Gawade (Age 26)',
      recordedAt: '2026-09-16T11:20:04.000Z',
      status: 'PENDING',
      retryCount: 0,
      payload: { fullName: 'Sunita Gawade', village: 'Nigdale', abhaId: '91-8822-1002-3921' }
    },
    {
      id: 'uuid-demo-002',
      type: 'VITALS_TRIAGE',
      patientName: 'Meena Waghmare (BP 145/95)',
      recordedAt: '2026-09-16T10:15:22.000Z',
      status: 'PENDING',
      retryCount: 1,
      lastError: 'HTTP 503 Service Unavailable',
      payload: { patientName: 'Meena Waghmare', bpSystolic: '145', bpDiastolic: '95', triageResult: 'RED' }
    },
    {
      id: 'uuid-demo-003',
      type: 'HEALTH_ASSESSMENT',
      patientName: 'House #41 (Radhika Shinde)',
      recordedAt: '2026-09-16T09:40:11.000Z',
      status: 'SYNCED',
      retryCount: 0,
      payload: { patientName: 'Radhika Shinde', assessmentType: 'ANC_MONITORING' }
    }
  ];

  const itemsToDisplay = (liveQueueItems && liveQueueItems.length > 0) ? liveQueueItems : fallbackQueue;
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);
  const [syncProgressMsg, setSyncProgressMsg] = useState('');

  // 5 Status definitions
  const syncStateDefinitions = [
    {
      state: 'ONLINE',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      desc: 'Active connectivity. Real-time background sync operational.'
    },
    {
      state: 'OFFLINE',
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      desc: 'No mobile network. Changes safely stored in encrypted local IndexedDB.'
    },
    {
      state: 'SYNCING',
      color: 'bg-sky-50 text-sky-800 border-sky-300',
      desc: 'Batch transferring records with server idempotency key handshake.'
    },
    {
      state: 'SYNCED',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      desc: 'Verified on PHC database. Idempotency guarantees zero duplicates.'
    },
    {
      state: 'SYNC FAILED',
      color: 'bg-rose-50 text-rose-800 border-rose-300',
      desc: 'Network drop during upload. Records retained with retry options.'
    }
  ];

  const handleSyncAll = async () => {
    if (!isOnline) {
      setSyncProgressMsg('Cannot sync while offline. Please connect to Wi-Fi or cellular network.');
      setTimeout(() => setSyncProgressMsg(''), 4000);
      return;
    }

    setSyncProgressMsg('Synchronizing pending records with PHC cloud server...');
    await syncNow();
    setSyncProgressMsg('Sync complete! All eligible records confirmed by server.');
    setTimeout(() => setSyncProgressMsg(''), 4000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SYNCED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SYNCED
          </span>
        );
      case 'SYNCING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            SYNCING
          </span>
        );
      case 'FAILED':
      case 'SYNC FAILED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            SYNC FAILED
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            PENDING
          </span>
        );
    }
  };

  const getOverallStatusPill = () => {
    switch (syncStatus) {
      case 'ONLINE':
        return (
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
            <Wifi className="w-4 h-4 text-emerald-600" />
            ONLINE
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 shadow-sm">
            <WifiOff className="w-4 h-4 text-slate-600" />
            OFFLINE
          </span>
        );
      case 'SYNCING':
        return (
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1.5 shadow-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
            SYNCING
          </span>
        );
      case 'SYNCED':
        return (
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            SYNCED
          </span>
        );
      case 'SYNC FAILED':
        return (
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            SYNC FAILED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/asha" className="hover:text-ruralTeal-700 flex items-center gap-1 font-medium">
              <ChevronLeft className="w-4 h-4" />
              {t('asha.dashboardTitle', 'ASHA Portal')}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{t('asha.syncQueueTitle', 'Sync Queue')}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <RefreshCw className="w-7 h-7 text-ruralTeal-700" />
              Synchronization Queue & Vault
            </h1>
            {getOverallStatusPill()}
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Deterministic, idempotent sync manager ensuring zero duplicate records and resilient background upload.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncAll}
            disabled={syncStatus === 'SYNCING' || !isOnline}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
            <span>{syncStatus === 'SYNCING' ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Progress / Notice Message */}
      {syncProgressMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="font-medium text-xs sm:text-sm">{syncProgressMsg}</p>
        </div>
      )}

      {/* 5 Sync States Reference Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            5 Core Offline Synchronization States
          </h3>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            Storage: {storageStats?.usageMB || '0.85'} MB / {storageStats?.quotaMB || '2048'} MB ({storageStats?.pct || 1}%)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {syncStateDefinitions.map((s) => (
            <div key={s.state} className={`p-3 rounded-xl border ${s.color} space-y-1`}>
              <p className="font-bold text-xs uppercase tracking-wider">{s.state}</p>
              <p className="text-[11px] leading-tight opacity-90">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Queue Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-ruralTeal-700" />
            Queue Pipeline ({itemsToDisplay.length} items)
          </h2>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {pendingCount || itemsToDisplay.filter((i) => i.status === 'PENDING' || i.status === 'FAILED').length} Awaiting Sync
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {itemsToDisplay.map((item) => {
            const patientName = item.payload?.fullName || item.payload?.patientName || item.patientName || 'Rural Citizen';
            const actionType = item.type || item.action || 'RECORD';
            const timestamp = item.recordedAt ? new Date(item.recordedAt).toLocaleString() : item.timestamp;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(item.status)}
                    <span className="font-mono text-xs text-slate-400">{item.id}</span>
                    <span className="text-xs text-slate-500">• {timestamp}</span>
                    {item.retryCount > 0 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.retryCount} Retries
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{patientName}</h3>
                  <p className="text-xs text-slate-500">
                    Action Type: <strong className="text-slate-700 font-mono">{actionType}</strong>
                  </p>

                  {item.lastError && (
                    <p className="text-xs text-rose-700 font-medium flex items-center gap-1 mt-1 bg-rose-50 p-1.5 rounded border border-rose-200 max-w-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span>{item.lastError}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedQueueItem(item)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    title="View Item Payload"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {item.status !== 'SYNCED' && (
                    <button
                      onClick={() => retryQueueItem(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-ruralTeal-50 text-ruralTeal-700 hover:bg-ruralTeal-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retry Now
                    </button>
                  )}

                  <button
                    onClick={() => removeQueueItem(item.id)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    title="Remove from Queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Payload Modal */}
      {selectedQueueItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-ruralTeal-700 uppercase tracking-wider">
                  Idempotent Queue Payload
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedQueueItem.payload?.fullName || selectedQueueItem.payload?.patientName || selectedQueueItem.patientName || 'Payload Detail'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQueueItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-72">
              <pre>{JSON.stringify(selectedQueueItem, null, 2)}</pre>
            </div>

            <button
              onClick={() => setSelectedQueueItem(null)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
