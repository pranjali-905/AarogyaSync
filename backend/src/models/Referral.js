const db = require('../config/db');

const memoryReferrals = new Map([
  ['ref-01', {
    id: 'ref-01',
    patient_id: 'usr-pat-male-02',
    patient_name: 'Tukaram Maruti Patil',
    referring_user_id: 'usr-doc-01',
    referring_user_name: 'Dr. Ramesh Kulkarni',
    from_facility_id: 'fac-phc-01',
    from_facility_name: 'Khed Community Health Centre (CHC)',
    to_facility_id: 'fac-dh-04',
    to_facility_name: 'Aundh District Hospital',
    attending_specialist: 'Cardiologist / Echo Doppler Specialist',
    reason: 'Echocardiogram and ambulatory 24h blood pressure monitoring evaluation.',
    urgency: 'YELLOW',
    transport_needed: 'Public Transport with family escort',
    status: 'INITIATED',
    referral_date: '2026-09-15',
    created_at: new Date('2026-09-15').toISOString()
  }]
]);

const Referral = {
  create: async (data) => {
    const id = data.id || `ref-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO referrals (
          id, patient_id, referring_user_id, from_facility_id, to_facility_id,
          attending_specialist, reason, urgency, transport_needed, status, referral_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.patientId, data.referringUserId || null,
        data.fromFacilityId || null, data.toFacilityId || null,
        data.attendingSpecialist || '', data.reason, data.urgency || 'YELLOW',
        data.transportNeeded || 'Standard', data.status || 'INITIATED',
        data.referralDate || new Date()
      ]);
      return res.rows[0];
    }

    const ref = {
      id,
      patient_id: data.patientId,
      referring_user_id: data.referringUserId,
      from_facility_id: data.fromFacilityId,
      to_facility_id: data.toFacilityId,
      attending_specialist: data.attendingSpecialist || '',
      reason: data.reason,
      urgency: data.urgency || 'YELLOW',
      transport_needed: data.transportNeeded || 'Standard',
      status: data.status || 'INITIATED',
      referral_date: data.referralDate || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    memoryReferrals.set(id, ref);
    return ref;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT r.*, p.full_name as patient_name, p.phone as patient_phone,
               u.full_name as referring_user_name,
               f1.name as from_facility_name, f2.name as to_facility_name
        FROM referrals r
        JOIN users p ON p.id = r.patient_id
        LEFT JOIN users u ON u.id = r.referring_user_id
        LEFT JOIN facilities f1 ON f1.id = r.from_facility_id
        LEFT JOIN facilities f2 ON f2.id = r.to_facility_id
        WHERE r.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    return memoryReferrals.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT r.*, f1.name as from_facility_name, f2.name as to_facility_name
        FROM referrals r
        LEFT JOIN facilities f1 ON f1.id = r.from_facility_id
        LEFT JOIN facilities f2 ON f2.id = r.to_facility_id
        WHERE r.patient_id = $1
        ORDER BY r.created_at DESC;
      `;
      const res = await db.query(query, [patientId]);
      return res.rows;
    }
    return Array.from(memoryReferrals.values()).filter(r => r.patient_id === patientId);
  },

  updateStatus: async (id, status) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'UPDATE referrals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;',
        [status, id]
      );
      return res.rows[0];
    }
    const ref = memoryReferrals.get(id);
    if (ref) {
      ref.status = status;
      return ref;
    }
    return null;
  },

  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT r.*, p.full_name as patient_name, p.phone as patient_phone,
               f1.name as from_facility_name, f2.name as to_facility_name
        FROM referrals r
        JOIN users p ON p.id = r.patient_id
        LEFT JOIN facilities f1 ON f1.id = r.from_facility_id
        LEFT JOIN facilities f2 ON f2.id = r.to_facility_id
        WHERE 1=1
      `;
      const params = [];
      if (filters.urgency) {
        params.push(filters.urgency);
        query += ` AND r.urgency = $${params.length}`;
      }
      if (filters.status) {
        params.push(filters.status);
        query += ` AND r.status = $${params.length}`;
      }
      query += ' ORDER BY r.created_at DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryReferrals.values());
    if (filters.urgency) list = list.filter(r => r.urgency === filters.urgency);
    if (filters.status) list = list.filter(r => r.status === filters.status);
    return list;
  }
};

module.exports = Referral;
