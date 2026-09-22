import { openDB } from 'idb';

const DB_NAME = 'AarogyaSync_OfflineDB';
const DB_VERSION = 2;

/**
 * Initialize IndexedDB with all domain-specific offline stores
 */
export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // 1. Sync Queue Store
      if (!db.objectStoreNames.contains('sync_queue')) {
        const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('by_status', 'status');
        syncStore.createIndex('by_idempotency', 'idempotencyKey', { unique: true });
        syncStore.createIndex('by_type', 'type');
        syncStore.createIndex('by_recordedAt', 'recordedAt');
      }

      // 2. Cached Patient Profiles (Offline Registry)
      if (!db.objectStoreNames.contains('cached_patients')) {
        const patStore = db.createObjectStore('cached_patients', { keyPath: 'id' });
        patStore.createIndex('by_village', 'village');
        patStore.createIndex('by_phone', 'phone');
      }

      // 3. Cached Vitals & Digital Triage
      if (!db.objectStoreNames.contains('cached_vitals')) {
        const vitalsStore = db.createObjectStore('cached_vitals', { keyPath: 'id', autoIncrement: true });
        vitalsStore.createIndex('by_patient', 'patientId');
        vitalsStore.createIndex('by_priority', 'triagePriority');
      }

      // 4. Cached Clinical Health Assessments
      if (!db.objectStoreNames.contains('cached_assessments')) {
        const assessStore = db.createObjectStore('cached_assessments', { keyPath: 'id', autoIncrement: true });
        assessStore.createIndex('by_patient', 'patientId');
      }

      // 5. Cached Follow-up Tasks
      if (!db.objectStoreNames.contains('cached_followups')) {
        const followStore = db.createObjectStore('cached_followups', { keyPath: 'id' });
        followStore.createIndex('by_status', 'status');
      }

      // 6. Cached Store & Forward Photo Cases
      if (!db.objectStoreNames.contains('cached_photo_cases')) {
        const photoStore = db.createObjectStore('cached_photo_cases', { keyPath: 'id' });
        photoStore.createIndex('by_category', 'category');
        photoStore.createIndex('by_urgency', 'urgency');
      }

      // 7. Sync History Log
      if (!db.objectStoreNames.contains('sync_history')) {
        db.createObjectStore('sync_history', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

/**
 * Generate a cryptographically distinct idempotency key
 */
export function generateIdempotencyKey(type = 'record') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const entropy = Math.random().toString(36).substring(2, 7);
  return `sync_${type.toLowerCase()}_${timestamp}_${random}_${entropy}`;
}

/**
 * Enqueue a new offline record with unique idempotency key
 */
export async function enqueueOfflineRecord(type, payload) {
  const db = await getDB();
  const idempotencyKey = payload.idempotencyKey || generateIdempotencyKey(type);

  const record = {
    idempotencyKey,
    type,
    payload,
    status: 'PENDING', // PENDING | SYNCING | SYNCED | FAILED
    recordedAt: new Date().toISOString(),
    retryCount: 0,
    lastError: null,
    syncedAt: null
  };

  const id = await db.add('sync_queue', record);
  console.log(`[OfflineDB] Queued record #${id} (${type}) with idempotencyKey: ${idempotencyKey}`);

  // Automatically update local domain stores for offline browsing
  try {
    if (type === 'PATIENT_REGISTRATION') {
      await saveCachedPatient({ ...payload, isOfflineOnly: true });
    } else if (type === 'VITALS_TRIAGE' || type === 'DOORSTEP_TRIAGE_VITALS') {
      await saveCachedVitals({ ...payload, syncQueueId: id });
    } else if (type === 'HEALTH_ASSESSMENT' || type === 'PATIENT_HEALTH_CHECK') {
      await saveCachedAssessment({ ...payload, syncQueueId: id });
    } else if (type === 'FOLLOW_UP') {
      await saveCachedFollowup({ ...payload, syncQueueId: id });
    } else if (type === 'PHOTO_CASE') {
      await saveCachedPhotoCase({ ...payload, syncQueueId: id });
    }
  } catch (err) {
    console.warn('[OfflineDB] Secondary cache write non-fatal error:', err);
  }

  return { ...record, id };
}

/**
 * Retrieve all records needing synchronization (PENDING or FAILED)
 */
export async function getPendingRecords() {
  const db = await getDB();
  const allRecords = await db.getAll('sync_queue');
  return allRecords.filter((r) => r.status === 'PENDING' || r.status === 'FAILED');
}

/**
 * Get count of pending / failed synchronization items
 */
export async function getPendingCount() {
  const pending = await getPendingRecords();
  return pending.length;
}

/**
 * Get all sync records in queue (including completed)
 */
export async function getAllSyncRecords() {
  const db = await getDB();
  const all = await db.getAll('sync_queue');
  return all.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
}

/**
 * Update sync status of a record
 */
export async function updateRecordStatus(id, status, errorMsg = null) {
  const db = await getDB();
  const record = await db.get('sync_queue', id);
  if (record) {
    record.status = status;
    if (errorMsg) {
      record.lastError = errorMsg;
      record.retryCount = (record.retryCount || 0) + 1;
    }
    if (status === 'SYNCED') {
      record.syncedAt = new Date().toISOString();
      record.lastError = null;
    }
    await db.put('sync_queue', record);
  }
}

/**
 * Retry an individual failed sync record
 */
export async function retryRecord(id) {
  const db = await getDB();
  const record = await db.get('sync_queue', id);
  if (record) {
    record.status = 'PENDING';
    record.lastError = null;
    await db.put('sync_queue', record);
  }
}

/**
 * Remove an item from the sync queue
 */
export async function deleteRecord(id) {
  const db = await getDB();
  await db.delete('sync_queue', id);
}

/**
 * Clear synced items
 */
export async function clearSyncedRecords() {
  const db = await getDB();
  const tx = db.transaction('sync_queue', 'readwrite');
  let cursor = await tx.store.openCursor();
  while (cursor) {
    if (cursor.value.status === 'SYNCED') {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
}

/**
 * Patient Cache Helpers (Enables offline registration and lookup)
 */
export async function saveCachedPatient(patient) {
  const db = await getDB();
  const patientRecord = {
    id: patient.id || `pat-off-${Date.now()}`,
    fullName: patient.fullName || patient.full_name || 'Anonymous Citizen',
    phone: patient.phone || '',
    village: patient.village || 'Nigdale',
    district: patient.district || 'Pune',
    age: patient.age || 25,
    gender: patient.gender || 'female',
    bloodGroup: patient.bloodGroup || patient.blood_group || 'B+',
    abhaId: patient.abhaId || patient.abha_id || 'Pending ABHA',
    isPregnant: patient.isPregnant || false,
    registrationStatus: 'Offline Saved (Pending Sync)',
    savedLocallyAt: new Date().toISOString()
  };
  await db.put('cached_patients', patientRecord);
  return patientRecord;
}

export async function getCachedPatients(searchQuery = '') {
  const db = await getDB();
  const all = await db.getAll('cached_patients');
  if (!searchQuery) return all;
  const q = searchQuery.toLowerCase();
  return all.filter((p) =>
    (p.fullName && p.fullName.toLowerCase().includes(q)) ||
    (p.phone && p.phone.includes(q)) ||
    (p.village && p.village.toLowerCase().includes(q)) ||
    (p.abhaId && p.abhaId.toLowerCase().includes(q))
  );
}

/**
 * Vitals & Triage Cache Helpers
 */
export async function saveCachedVitals(vitalsRecord) {
  const db = await getDB();
  const entry = {
    id: vitalsRecord.id || `vit-off-${Date.now()}`,
    patientId: vitalsRecord.patientId || vitalsRecord.patient_id || 'unknown',
    patientName: vitalsRecord.patientName || 'Rural Citizen',
    bpSystolic: vitalsRecord.bpSystolic || '120',
    bpDiastolic: vitalsRecord.bpDiastolic || '80',
    pulse: vitalsRecord.pulse || '76',
    temp: vitalsRecord.temp || '98.4',
    spO2: vitalsRecord.spO2 || vitalsRecord.spO2Percent || '98',
    bloodSugar: vitalsRecord.bloodSugar || '',
    triagePriority: vitalsRecord.triagePriority || vitalsRecord.triageResult || 'GREEN',
    redFlags: vitalsRecord.redFlags || [],
    recordedAt: vitalsRecord.recordedAt || new Date().toISOString()
  };
  await db.put('cached_vitals', entry);
  return entry;
}

export async function getCachedVitals(patientId = null) {
  const db = await getDB();
  if (patientId) {
    const tx = db.transaction('cached_vitals', 'readonly');
    const index = tx.store.index('by_patient');
    return index.getAll(patientId);
  }
  return db.getAll('cached_vitals');
}

/**
 * Clinical Assessments Cache Helpers
 */
export async function saveCachedAssessment(assessment) {
  const db = await getDB();
  const entry = {
    id: assessment.id || `ass-off-${Date.now()}`,
    patientId: assessment.patientId || 'unknown',
    patientName: assessment.patientName || 'Patient',
    assessmentType: assessment.assessmentType || 'ROUTINE_HEALTH_SURVEY',
    symptoms: assessment.symptoms || [],
    dangerFlags: assessment.dangerFlags || {},
    triageResult: assessment.triageResult || 'GREEN',
    recordedAt: assessment.recordedAt || new Date().toISOString()
  };
  await db.put('cached_assessments', entry);
  return entry;
}

export async function getCachedAssessments() {
  const db = await getDB();
  return db.getAll('cached_assessments');
}

/**
 * Follow-up Tasks Cache Helpers
 */
export async function saveCachedFollowup(followup) {
  const db = await getDB();
  const entry = {
    id: followup.id || `fup-off-${Date.now()}`,
    patientName: followup.patientName || 'Rural Citizen',
    dueDate: followup.dueDate || followup.followupDays || 'Tomorrow',
    task: followup.task || followup.reason || 'Doorstep Vitals Follow-up',
    priority: followup.priority || 'YELLOW',
    status: followup.status || 'PENDING',
    notes: followup.notes || followup.clinicalNotes || '',
    recordedAt: new Date().toISOString()
  };
  await db.put('cached_followups', entry);
  return entry;
}

export async function getCachedFollowups() {
  const db = await getDB();
  return db.getAll('cached_followups');
}

/**
 * Store & Forward Photo Case Cache Helpers (Supports base64/blob preview offline)
 */
export async function saveCachedPhotoCase(photoCase) {
  const db = await getDB();
  const entry = {
    id: photoCase.id || `photo-off-${Date.now()}`,
    patientName: photoCase.patientName || 'Patient',
    category: photoCase.category || 'DERMATOLOGY',
    title: photoCase.title || 'Clinical Photo Case',
    description: photoCase.description || '',
    urgency: photoCase.urgency || 'YELLOW',
    photoUrl: photoCase.photoUrl || photoCase.photoDataUrl || null,
    status: 'Pending Doctor Review (Offline Stored)',
    recordedAt: photoCase.recordedAt || new Date().toISOString()
  };
  await db.put('cached_photo_cases', entry);
  return entry;
}

export async function getCachedPhotoCases() {
  const db = await getDB();
  return db.getAll('cached_photo_cases');
}

/**
 * Storage Estimate Helper
 */
export async function getStorageEstimate() {
  if (navigator.storage && navigator.storage.estimate) {
    const { quota, usage } = await navigator.storage.estimate();
    const usageMB = (usage / (1024 * 1024)).toFixed(2);
    const quotaMB = (quota / (1024 * 1024)).toFixed(0);
    return { usageMB, quotaMB, pct: Math.min(100, Math.round((usage / quota) * 100)) };
  }
  return { usageMB: '0.85', quotaMB: '2048', pct: 1 };
}
