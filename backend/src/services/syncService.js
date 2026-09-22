const SyncQueue = require('../models/SyncQueue');
const TriageResult = require('../models/TriageResult');
const PhotoCase = require('../models/PhotoCase');
const db = require('../config/db');

const syncService = {
  processBatch: async (deviceId, userId, records) => {
    const results = {
      total: records.length,
      synced: 0,
      duplicates: 0,
      failed: 0,
      details: []
    };

    for (const record of records) {
      const { idempotencyKey, type, payload = {}, recordedAt } = record;

      if (!idempotencyKey) {
        results.failed++;
        results.details.push({
          idempotencyKey: null,
          status: 'FAILED',
          reason: 'Missing idempotencyKey in record header'
        });
        continue;
      }

      try {
        // 1. Process specific clinical entities if applicable
        if (type === 'TRIAGE_RECORD' || type === 'PATIENT_HEALTH_CHECK') {
          await TriageResult.create({
            idempotencyKey,
            patientId: payload.patientId || userId,
            recordedBy: userId,
            systolicBp: payload.systolicBp || payload.vitals?.bpSystolic || payload.bp?.split('/')[0],
            diastolicBp: payload.diastolicBp || payload.vitals?.bpDiastolic || payload.bp?.split('/')[1],
            pulseRate: payload.pulseRate || payload.vitals?.pulseBpm || payload.pulse,
            temperature: payload.temperature || payload.vitals?.tempFahrenheit || payload.temp,
            spO2: payload.spO2 || payload.vitals?.spO2Percent || payload.spo2,
            bloodGlucose: payload.bloodGlucose || payload.vitals?.bloodSugar || payload.bloodSugar,
            symptoms: payload.symptoms || [],
            priority: payload.priority || payload.triageResult || 'GREEN',
            redFlags: payload.redFlags || [],
            clinicalNotes: payload.clinicalNotes || payload.notes || '',
            recordedOffline: true,
            recordedAt: recordedAt || new Date()
          });
        } else if (type === 'PHOTO_CASE') {
          await PhotoCase.create({
            id: payload.id,
            patientId: payload.patientId || userId,
            patientName: payload.patientName || 'Clinical Patient',
            category: payload.category || 'DERMATOLOGY',
            title: payload.title,
            symptoms: payload.symptoms || payload.description,
            urgency: payload.urgency || 'YELLOW',
            photoUrls: payload.photoUrls || (payload.photoUrl ? [payload.photoUrl] : []),
            submittedBy: userId,
            submittedByName: payload.recordedByAsha || payload.ashaName || 'Sunita Tai (ASHA)',
            village: payload.village || 'Nigdale'
          });
        }

        // 2. Log in SyncQueue audit trail
        const syncResult = await SyncQueue.insertRecord({
          idempotencyKey,
          deviceId,
          userId,
          entityType: type || 'GENERIC',
          payload,
          recordedAt
        });

        if (syncResult.status === 'DUPLICATE_IGNORED') {
          results.duplicates++;
          results.details.push({ idempotencyKey, status: 'DUPLICATE_IGNORED' });
        } else {
          results.synced++;
          results.details.push({ idempotencyKey, status: 'SYNCED', id: syncResult.id });
        }
      } catch (err) {
        results.failed++;
        results.details.push({ idempotencyKey, status: 'FAILED', reason: err.message });
      }
    }

    return results;
  },

  getStatus: async () => {
    const stats = await SyncQueue.getSyncStats();
    return {
      status: 'ONLINE',
      serverTime: new Date().toISOString(),
      databaseConnected: stats.dbConnected,
      totalSyncedRecords: stats.totalSynced
    };
  }
};

module.exports = syncService;
