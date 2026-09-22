import React, { useState } from 'react';
import { useOffline } from '../../hooks/useOffline';
import { useTranslation } from '../../hooks/useTranslation';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
  Trash2,
  RotateCcw,
  Download,
  X,
  ShieldCheck,
  Eye,
  Server,
  Smartphone
} from 'lucide-react';

export default function OfflineSyncCenterModal() {
  const {
    isOnline,
    syncStatus,
    pendingCount,
    queueItems,
    storageStats,
    isSyncCenterOpen,
    closeSyncCenter,
    syncNow,
    retryQueueItem,
    removeQueueItem,
    isInstallable,
    triggerInstallPrompt
  } = useOffline();

  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  if (!isSyncCenterOpen) return null;

  const filteredItems = queueItems.filter((item) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PENDING') return item.status === 'PENDING' || item.status === 'FAILED';
    if (filterType === 'SYNCED') return item.status === 'SYNCED';
    return item.type === filterType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SYNCED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {t('sync.syncedStatus', 'SYNCED')}
          </span>
        );
      case 'SYNCING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            {t('sync.syncingStatus', 'SYNCING...')}
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {t('sync.failedStatus', 'SYNC FAILED')}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {t('common.pending', 'PENDING')}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20">
              <HardDrive className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold">{t('sync.title', 'Offline Vault & Sync Center')}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  isOnline ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'
                }`}>
                  {syncStatus}
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                {t('sync.subtitle', 'Encrypted local IndexedDB storage with zero-duplication sync.')}
              </p>
            </div>
          </div>

          <button
            onClick={closeSyncCenter}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Metric Cards */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('common.status', 'Network')}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className={`font-bold text-xs sm:text-sm ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isOnline ? t('sync.onlineStatus', 'Online') : t('sync.offlineStatus', 'Offline')}
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('common.pending', 'Pending')}</span>
            <span className="font-extrabold text-sm sm:text-base text-amber-600 block mt-0.5">
              {pendingCount} {t('common.all', 'Records')}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('common.storageUsed', 'Vault Storage')}</span>
            <span className="font-extrabold text-sm sm:text-base text-slate-800 block mt-0.5">
              {storageStats.usageMB} MB
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-center">
            <button
              onClick={syncNow}
              disabled={syncStatus === 'SYNCING' || !isOnline}
              className="w-full py-2 bg-ruralTeal-700 hover:bg-ruralTeal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'SYNCING' ? t('sync.syncing', 'Syncing...') : t('sync.syncNow', 'Sync Now')}</span>
            </button>
          </div>
        </div>

        {/* PWA Install Banner if applicable */}
        {isInstallable && (
          <div className="px-5 py-2.5 bg-teal-50 border-b border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-teal-900 font-medium">
              <Smartphone className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{t('sync.installPwaTitle', 'Install AarogyaSync app on your device for instant offline access.')}</span>
            </div>
            <button
              onClick={triggerInstallPrompt}
              className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              {t('sync.installPwaBtn', 'Install App')}
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="px-5 py-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: t('common.all', 'All Items') },
            { id: 'PENDING', label: `${t('common.pending', 'Pending Sync')} (${pendingCount})` },
            { id: 'SYNCED', label: t('sync.syncedStatus', 'Synced to Server') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Queue Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
              <p className="text-sm font-bold text-slate-800">{t('sync.noPendingItems', 'All records are synchronized! Zero items pending in offline queue.')}</p>
              <p className="text-xs text-slate-500">
                {t('emptyStates.defaultDesc', 'There are no active records in this category currently.')}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(item.status)}
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.retryCount > 0 && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                        {item.retryCount} Retries
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-sm text-slate-800">
                    {item.payload?.fullName || item.payload?.patientName || item.payload?.title || item.id}
                  </p>

                  {item.lastError && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 font-medium bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.lastError}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Inspect Payload"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {item.status === 'FAILED' && (
                    <button
                      onClick={() => retryQueueItem(item.id)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-amber-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('common.retry', 'Retry')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => removeQueueItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Item JSON Payload Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-teal-700" />
                  <h4 className="font-bold text-slate-900 text-sm">Payload: {selectedItem.type}</h4>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-2xl text-[11px] font-mono overflow-auto max-h-60">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {t('common.close', 'Close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
