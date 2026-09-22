const db = require('../config/db');

const memorySyncLog = [];

const SyncQueue = {
  insertRecord: async (record) => {
    const { idempotencyKey, deviceId, userId, entityType, payload, recordedAt } = record;

    if (db.getIsConnected()) {
      const query = `
        INSERT INTO sync_queue (
          idempotency_key, device_id, user_id, entity_type, payload, status, recorded_at
        ) VALUES ($1, $2, $3, $4, $5, 'SYNCED', $6)
        ON CONFLICT (idempotency_key) DO NOTHING
        RETURNING *;
      `;
      const res = await db.query(query, [
        idempotencyKey, deviceId || null, userId || null, entityType,
        JSON.stringify(payload || {}), recordedAt ? new Date(recordedAt) : new Date()
      ]);

      if (res.rowCount === 0) {
        return { status: 'DUPLICATE_IGNORED', idempotencyKey };
      }
      return { status: 'SYNCED', id: res.rows[0].id, idempotencyKey };
    }

    // In-memory fallback
    const exists = memorySyncLog.some(item => item.idempotencyKey === idempotencyKey);
    if (exists) {
      return { status: 'DUPLICATE_IGNORED', idempotencyKey };
    }

    const logEntry = {
      id: `sync-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      idempotencyKey,
      deviceId,
      userId,
      entityType,
      payload,
      status: 'SYNCED',
      syncedAt: new Date().toISOString()
    };
    memorySyncLog.push(logEntry);
    return { status: 'SYNCED', id: logEntry.id, idempotencyKey };
  },

  getSyncStats: async () => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT COUNT(*) as total_synced FROM sync_queue WHERE status = \'SYNCED\';');
      return {
        totalSynced: parseInt(res.rows[0].total_synced, 10),
        dbConnected: true
      };
    }
    return {
      totalSynced: memorySyncLog.length,
      dbConnected: false
    };
  },

  findRecent: async (limit = 20) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM sync_queue ORDER BY synced_at DESC LIMIT $1;', [limit]);
      return res.rows;
    }
    return [...memorySyncLog].reverse().slice(0, limit);
  }
};

module.exports = SyncQueue;
