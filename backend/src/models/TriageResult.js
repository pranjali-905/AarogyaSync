const db = require('../config/db');

const memoryTriage = new Map([
  ['tri-01', {
    id: 'tri-01',
    idempotency_key: 'idemp-seed-01',
    patient_id: 'usr-pat-female-01',
    patient_name: 'Radhika Suresh Shinde',
    recorded_by: 'usr-asha-01',
    recorded_by_name: 'Sunita Tai (ASHA)',
    systolic_bp: 114,
    diastolic_bp: 74,
    pulse_rate: 78,
    body_temp_f: 98.4,
    spo2_pct: 99,
    blood_glucose_mg_dl: 94,
    symptoms: ['Mild ankle tiredness'],
    triage_priority: 'GREEN',
    red_flags: [],
    clinical_notes: 'ANC 3rd trimester routine home check. Fetal movements normal.',
    recorded_offline: false,
    recorded_at: new Date('2026-09-15T10:00:00Z').toISOString()
  }],
  ['tri-02', {
    id: 'tri-02',
    idempotency_key: 'idemp-seed-02',
    patient_id: 'usr-pat-male-02',
    patient_name: 'Tukaram Maruti Patil',
    recorded_by: 'usr-asha-01',
    recorded_by_name: 'Sunita Tai (ASHA)',
    systolic_bp: 138,
    diastolic_bp: 88,
    pulse_rate: 74,
    body_temp_f: 98.2,
    spo2_pct: 98,
    blood_glucose_mg_dl: 112,
    symptoms: ['Occasional mild headache after field work'],
    triage_priority: 'GREEN',
    red_flags: [],
    clinical_notes: 'Blood pressure within controlled boundary. Advised low dietary sodium.',
    recorded_offline: false,
    recorded_at: new Date('2026-09-14T09:30:00Z').toISOString()
  }],
  ['tri-03', {
    id: 'tri-03',
    idempotency_key: 'idemp-seed-03',
    patient_id: 'usr-pat-female-01',
    patient_name: 'Radhika Suresh Shinde',
    recorded_by: 'usr-asha-01',
    recorded_by_name: 'Sunita Tai (ASHA)',
    systolic_bp: 165,
    diastolic_bp: 108,
    pulse_rate: 112,
    body_temp_f: 101.8,
    spo2_pct: 90,
    blood_glucose_mg_dl: 140,
    symptoms: ['Chest pain', 'Shortness of breath', 'Severe headache'],
    triage_priority: 'RED',
    red_flags: ['HYPOXIA', 'SEVERE_HYPERTENSION'],
    clinical_notes: 'Urgent referral needed. 108 ambulance notified.',
    recorded_offline: false,
    recorded_at: new Date('2026-09-17T08:00:00Z').toISOString()
  }]
]);

const TriageResult = {
  create: async (data) => {
    const id = data.id || `tri-${Date.now().toString(36)}`;
    const idempotencyKey = data.idempotencyKey || `idemp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    if (db.getIsConnected()) {
      const query = `
        INSERT INTO triage_records (
          id, idempotency_key, patient_id, recorded_by,
          systolic_bp, diastolic_bp, pulse_rate, body_temp_f, spo2_pct, blood_glucose_mg_dl,
          symptoms, triage_priority, red_flags, clinical_notes, photo_evidence_url,
          recorded_offline, recorded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (idempotency_key) DO UPDATE SET synced_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, idempotencyKey, data.patientId, data.recordedBy || null,
        data.systolicBp || null, data.diastolicBp || null, data.pulseRate || null,
        data.temperature || null, data.spO2 || null, data.bloodGlucose || null,
        JSON.stringify(data.symptoms || []), data.priority || 'GREEN', JSON.stringify(data.redFlags || []),
        data.clinicalNotes || '', data.photoEvidenceUrl || null,
        Boolean(data.recordedOffline), data.recordedAt ? new Date(data.recordedAt) : new Date()
      ]);
      return res.rows[0];
    }

    const record = {
      id,
      idempotency_key: idempotencyKey,
      patient_id: data.patientId,
      recorded_by: data.recordedBy,
      systolic_bp: data.systolicBp,
      diastolic_bp: data.diastolicBp,
      pulse_rate: data.pulseRate,
      body_temp_f: data.temperature,
      spo2_pct: data.spO2,
      blood_glucose_mg_dl: data.bloodGlucose,
      symptoms: data.symptoms || [],
      triage_priority: data.priority || 'GREEN',
      red_flags: data.redFlags || [],
      clinical_notes: data.clinicalNotes || '',
      photo_evidence_url: data.photoEvidenceUrl || null,
      recorded_offline: Boolean(data.recordedOffline),
      recorded_at: data.recordedAt || new Date().toISOString()
    };
    memoryTriage.set(id, record);
    return record;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM triage_records WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryTriage.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT t.*, u.full_name as recorded_by_name
        FROM triage_records t
        LEFT JOIN users u ON u.id = t.recorded_by
        WHERE t.patient_id = $1
        ORDER BY t.recorded_at DESC;
      `;
      const res = await db.query(query, [patientId]);
      return res.rows;
    }
    return Array.from(memoryTriage.values())
      .filter(t => t.patient_id === patientId)
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
  },

  findPriorityCases: async (priority = null) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT t.*, u.full_name as patient_name, u.phone as patient_phone, u.village,
               p.is_pregnant, p.high_risk_flag, p.gestational_weeks
        FROM triage_records t
        JOIN users u ON u.id = t.patient_id
        LEFT JOIN patient_profiles p ON p.user_id = t.patient_id
        WHERE 1=1
      `;
      const params = [];
      if (priority) {
        params.push(priority);
        query += ` AND t.triage_priority = $${params.length}`;
      } else {
        query += " AND t.triage_priority IN ('RED', 'YELLOW')";
      }
      query += ' ORDER BY CASE WHEN t.triage_priority = \'RED\' THEN 1 WHEN t.triage_priority = \'YELLOW\' THEN 2 ELSE 3 END, t.recorded_at DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryTriage.values());
    if (priority) {
      list = list.filter(t => t.triage_priority === priority);
    } else {
      list = list.filter(t => ['RED', 'YELLOW'].includes(t.triage_priority));
    }
    return list;
  },

  findAll: async () => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM triage_records ORDER BY recorded_at DESC LIMIT 100');
      return res.rows;
    }
    return Array.from(memoryTriage.values());
  }
};

module.exports = TriageResult;
