import React from 'react';
import { useOffline } from '../../hooks/useOffline';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive,
  ChevronRight 
} from 'lucide-react';

export default function OfflineBanner() {
  const { 
    isOnline, 
    syncStatus, // 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED' | 'SYNC FAILED'
    pendingCount, 
    syncNow, 
    openSyncCenter 
  } = useOffline();
  const { t } = useTranslation();

  // If online and fully synced with 0 pending, show a subtle bar or nothing
  const isCleanOnline = isOnline && pendingCount === 0 && syncStatus !== 'SYNCING' && syncStatus !== 'SYNC FAILED';

  if (isCleanOnline) {
    return null;
  }

  // Determine styling and translated text based on status
  let bannerBg = 'bg-amber-500 text-amber-950 border-b border-amber-600';
  let statusText = t('sync.offlineStatus', 'OFFLINE');
  let messageText = pendingCount > 0 
    ? `${pendingCount} ${t('common.recordsQueued', 'frontline record(s) queued safely in local device vault.')}` 
    : t('sync.offlineDesc', 'Device is offline. All patient assessments & vitals will be saved in IndexedDB.');
  let icon = <WifiOff className="w-4 h-4 shrink-0 text-amber-950 animate-pulse" />;

  if (syncStatus === 'SYNCING') {
    bannerBg = 'bg-blue-600 text-white border-b border-blue-700';
    statusText = t('sync.syncingStatus', 'SYNCING');
    messageText = t('sync.syncingDesc', `Synchronizing ${pendingCount} record(s) with PHC cloud server...`);
    icon = <RefreshCw className="w-4 h-4 shrink-0 text-white animate-spin" />;
  } else if (syncStatus === 'SYNC FAILED') {
    bannerBg = 'bg-rose-600 text-white border-b border-rose-700';
    statusText = t('sync.failedStatus', 'SYNC FAILED');
    messageText = t('sync.failedDesc', 'Server unreachable or connection timed out. All queued records are retained. Tap Retry.');
    icon = <AlertTriangle className="w-4 h-4 shrink-0 text-white" />;
  } else if (syncStatus === 'SYNCED') {
    bannerBg = 'bg-emerald-600 text-white border-b border-emerald-700';
    statusText = t('sync.syncedStatus', 'SYNCED');
    messageText = t('sync.syncedDesc', 'All offline records successfully verified and updated on PHC server.');
    icon = <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />;
  } else if (syncStatus === 'ONLINE' && pendingCount > 0) {
    bannerBg = 'bg-teal-700 text-white border-b border-teal-800';
    statusText = t('sync.onlineStatus', 'ONLINE');
    messageText = `${pendingCount} ${t('common.recordsQueued', 'records ready to synchronize.')}`;
    icon = <Wifi className="w-4 h-4 shrink-0 text-teal-200" />;
  }

  return (
    <aside 
      aria-label="Offline Sync Status Banner"
      className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors shadow-xs ${bannerBg}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          {icon}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/20 tracking-wider">
              {statusText}
            </span>
            <span className="font-semibold">{messageText}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isOnline && (
            <button
              onClick={syncNow}
              disabled={syncStatus === 'SYNCING'}
              className="px-3 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'SYNC FAILED' ? t('sync.retrySync', 'Retry Sync') : t('sync.syncNow', 'Sync Now')}</span>
            </button>
          )}

          <button
            onClick={openSyncCenter}
            className="px-3 py-1 bg-black/15 hover:bg-black/25 text-inherit rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{t('sync.title', 'Vault')} ({pendingCount})</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
