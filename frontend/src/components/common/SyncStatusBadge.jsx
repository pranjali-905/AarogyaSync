import React from 'react';
import { useOffline } from '../../hooks/useOffline';
import { useTranslation } from '../../hooks/useTranslation';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SyncStatusBadge() {
  const { syncStatus, isOnline, pendingCount, syncNow } = useOffline();
  const { t } = useTranslation();

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'Syncing':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />,
          label: t('common.syncing'),
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'Offline':
        return {
          icon: <WifiOff className="w-3.5 h-3.5 text-amber-600" />,
          label: pendingCount > 0 ? `${pendingCount} ${t('common.pending')}` : t('common.offline'),
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
        };
      case 'Sync Failed':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
          label: t('common.syncFailed'),
          badgeClass: 'bg-red-50 text-red-700 border-red-200 cursor-pointer hover:bg-red-100',
          onClick: syncNow,
        };
      case 'Synced':
      case 'Online':
      default:
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: t('common.synced'),
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      onClick={config.onClick}
      title={isOnline ? 'Online - Cloud synchronized' : 'Offline - Queued locally in IndexedDB'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${config.badgeClass}`}
    >
      {config.icon}
      <span className="hidden sm:inline">{config.label}</span>
      {pendingCount > 0 && syncStatus !== 'Offline' && (
        <span className="ml-0.5 px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px]">
          {pendingCount}
        </span>
      )}
    </div>
  );
}
