const db = require('../config/db');

const memoryAssessments = new Map([
  ['ha-01', {
    id: 'ha-01',
    patient_id: 'usr-pat-female-01',
    assessor_id: 'usr-asha-01',
    assessor_name: 'Sunita Tai (ASHA)',
    assessment_type: 'ANC_SCREENING',
    vitals: { bp: '114/74', pulse: 78, weight: '55.4 kg', fundalHeight: '27 cm', fetalHeartRate: '142 bpm' },
    findings: { gestationalWeeks: 28, trimester: 3, pedalEdema: false, fetalMovements: 'Active' },
    risk_tier: 'LOW',
    recommendations: 'Continue daily IFA and Calcium. Attend ANC 3 at PHC tomorrow.',
    created_at: new Date('2026-09-15T11:00:00Z').toISOString()
  }]
]);

const HealthAssessment = {
  create: async (data) => {
    const id = data.id || `ha-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO health_assessments (
          id, patient_id, assessor_id, assessment_type, vitals, findings, risk_tier, recommendations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.patientId, data.assessorId || null, data.assessmentType || 'GENERAL',
        JSON.stringify(data.vitals || {}), JSON.stringify(data.findings || {}),
        data.riskTier || 'LOW', data.recommendations || ''
      ]);
      return res.rows[0];
    }
    const record = {
      id,
      patient_id: data.patientId,
      assessor_id: data.assessorId,
      assessment_type: data.assessmentType || 'GENERAL',
      vitals: data.vitals || {},
      findings: data.findings || {},
      risk_tier: data.riskTier || 'LOW',
      recommendations: data.recommendations || '',
      created_at: new Date().toISOString()
    };
    memoryAssessments.set(id, record);
    return record;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM health_assessments WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryAssessments.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT ha.*, u.full_name as assessor_name
        FROM health_assessments ha
        LEFT JOIN users u ON u.id = ha.assessor_id
        WHERE ha.patient_id = $1
        ORDER BY ha.created_at DESC;
      `;
      const res = await db.query(query, [patientId]);
      return res.rows;
    }
    return Array.from(memoryAssessments.values())
      .filter(ha => ha.patient_id === patientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  findAll: async () => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM health_assessments ORDER BY created_at DESC');
      return res.rows;
    }
    return Array.from(memoryAssessments.values());
  }
};

module.exports = HealthAssessment;
