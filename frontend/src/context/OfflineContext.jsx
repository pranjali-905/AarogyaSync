import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  enqueueOfflineRecord, 
  getPendingRecords, 
  getPendingCount, 
  getAllSyncRecords,
  updateRecordStatus, 
  retryRecord,
  deleteRecord,
  clearSyncedRecords,
  getStorageEstimate
} from '../services/offlineStorage';
import { apiRequest } from '../services/apiClient';

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
  // Core status: ONLINE | OFFLINE | SYNCING | SYNCED | SYNC FAILED
  const [syncStatus, setSyncStatus] = useState(() => (navigator.onLine ? 'ONLINE' : 'OFFLINE'));
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [queueItems, setQueueItems] = useState([]);
  const [storageStats, setStorageStats] = useState({ usageMB: '0.00', quotaMB: '1000', pct: 0 });
  const [isSyncCenterOpen, setIsSyncCenterOpen] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const isSyncingRef = useRef(false);

  // 1. Refresh queue items, pending count, and storage stats
  const refreshQueue = useCallback(async () => {
    try {
      const count = await getPendingCount();
      setPendingCount(count);

      const allItems = await getAllSyncRecords();
      setQueueItems(allItems);

      const stats = await getStorageEstimate();
      setStorageStats(stats);

      // Transition from SYNCED to ONLINE if idle
      if (count === 0 && isOnline && syncStatus !== 'SYNCING') {
        setSyncStatus('SYNCED');
      }
    } catch (err) {
      console.warn('[OfflineContext] Failed refreshing queue:', err);
    }
  }, [isOnline, syncStatus]);

  // 2. Connectivity verification heartbeat (checks real internet access)
  const checkConnectivity = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      setSyncStatus('OFFLINE');
      return false;
    }

    try {
      // Light HTTP ping to verify true server reachability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('/api/v1/sync/status', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setIsOnline(true);
        if (syncStatus === 'OFFLINE') {
          setSyncStatus('ONLINE');
        }
        return true;
      }
    } catch (e) {
      // Fallback: server may be down or captive portal
    }

    // Still consider online if navigator is online, but flag offline if fetch fails completely
    const live = navigator.onLine;
    setIsOnline(live);
    if (!live) setSyncStatus('OFFLINE');
    return live;
  }, [syncStatus]);

  // 3. Batch synchronization with server
  const syncNow = useCallback(async () => {
    if (isSyncingRef.current) return;

    const online = await checkConnectivity();
    if (!online) {
      setSyncStatus('OFFLINE');
      return;
    }

    const pending = await getPendingRecords();
    if (pending.length === 0) {
      setSyncStatus('SYNCED');
      return;
    }

    isSyncingRef.current = true;
    setSyncStatus('SYNCING');
    console.log(`[OfflineSync] Syncing ${pending.length} pending records to server...`);

    // Mark pending records as SYNCING
    for (const item of pending) {
      await updateRecordStatus(item.id, 'SYNCING');
    }
    await refreshQueue();

    try {
      const response = await apiRequest('/sync/batch', {
        method: 'POST',
        body: JSON.stringify({
          deviceId: `device-${navigator.userAgent.slice(0, 30)}`,
          records: pending
        })
      });

      if (response && response.success) {
        // Mark all confirmed records as SYNCED
        for (const item of pending) {
          await updateRecordStatus(item.id, 'SYNCED');
        }
        setSyncStatus('SYNCED');
        console.log('✅ [OfflineSync] Batch sync confirmed by server');
        // Clean up completed sync records from storage after a short delay
        setTimeout(async () => {
          await clearSyncedRecords();
          await refreshQueue();
        }, 5000);
      } else {
        // Retain queued records with FAILED status and error message
        const errMsg = response?.error || response?.message || 'Server rejected batch synchronization';
        for (const item of pending) {
          await updateRecordStatus(item.id, 'FAILED', errMsg);
        }
        setSyncStatus('SYNC FAILED');
        console.warn('⚠️ [OfflineSync] Batch sync failed:', errMsg);
      }
    } catch (err) {
      console.error('💥 [OfflineSync] Network error during batch sync:', err);
      // Retain queued records, increment retry count, set FAILED
      for (const item of pending) {
        await updateRecordStatus(item.id, 'FAILED', err.message || 'Network connection lost');
      }
      setSyncStatus('SYNC FAILED');
    } finally {
      isSyncingRef.current = false;
      await refreshQueue();
    }
  }, [checkConnectivity, refreshQueue]);

  // 4. Enqueue new record
  const queueRecord = useCallback(async (type, payload) => {
    const record = await enqueueOfflineRecord(type, payload);
    await refreshQueue();

    // Auto-sync if online
    if (navigator.onLine) {
      syncNow();
    } else {
      setSyncStatus('OFFLINE');
    }
    return record;
  }, [refreshQueue, syncNow]);

  // 5. Retry individual failed record
  const retryQueueItem = useCallback(async (id) => {
    await retryRecord(id);
    await refreshQueue();
    if (navigator.onLine) {
      syncNow();
    }
  }, [refreshQueue, syncNow]);

  // 6. Delete queue record
  const removeQueueItem = useCallback(async (id) => {
    await deleteRecord(id);
    await refreshQueue();
  }, [refreshQueue]);

  // 7. PWA Before Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setIsInstallable(true);
      console.log('[PWA] beforeinstallprompt captured, PWA is installable');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const triggerInstallPrompt = async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    console.log('[PWA] User response to install prompt:', outcome);
    setInstallPromptEvent(null);
    setIsInstallable(false);
  };

  // 8. Lifecycle: Network status listeners & automatic sync on reconnection
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 [OfflineSync] Browser reported ONLINE');
      setIsOnline(true);
      setSyncStatus('ONLINE');
      // Automatic sync when connection returns
      syncNow();
    };

    const handleOffline = () => {
      console.log('📴 [OfflineSync] Browser reported OFFLINE');
      setIsOnline(false);
      setSyncStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load
    refreshQueue();

    // Periodic heartbeat every 25s to verify connection and auto-sync if items pending
    const intervalId = setInterval(() => {
      checkConnectivity().then((online) => {
        if (online) {
          getPendingCount().then((count) => {
            if (count > 0 && !isSyncingRef.current) {
              syncNow();
            }
          });
        }
      });
    }, 25000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [syncNow, refreshQueue, checkConnectivity]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        syncStatus, // 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED' | 'SYNC FAILED'
        pendingCount,
        queueItems,
        storageStats,
        isSyncCenterOpen,
        openSyncCenter: () => setIsSyncCenterOpen(true),
        closeSyncCenter: () => setIsSyncCenterOpen(false),
        isInstallable,
        triggerInstallPrompt,
        queueRecord,
        syncNow,
        retryQueueItem,
        removeQueueItem,
        refreshQueue
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
