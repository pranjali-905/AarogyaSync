const db = require('../config/db');

const memoryAsha = new Map([
  ['usr-asha-01', {
    id: 'asha-prof-01',
    user_id: 'usr-asha-01',
    full_name: 'Sunita Tai Gawande (ASHA Sangini)',
    phone: '9876543220',
    village: 'Nigdale & Bhimashankar',
    district: 'Pune',
    employee_id: 'MH-PUN-ASHA-042',
    assigned_villages: ['Nigdale', 'Thakarwadi', 'Bhimashankar Hamlet'],
    sub_centre: 'Nigdale Sub-Centre',
    households_covered: 164,
    active_maternal_cases: 8,
    supervisor_name: 'Meena Tai (Block Coordinator)',
    qualification: '12th Pass + ASHA Module 6 & 7 Certified',
    verification_status: 'VERIFIED'
  }]
]);

const ASHAWorker = {
  findByUserId: async (userId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT a.*, u.full_name, u.phone, u.gender, u.village, u.district, u.preferred_language
        FROM asha_profiles a
        JOIN users u ON u.id = a.user_id
        WHERE a.user_id = $1;
      `;
      const res = await db.query(query, [userId]);
      return res.rows[0] || null;
    }
    return memoryAsha.get(userId) || null;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT a.*, u.full_name, u.phone, u.gender, u.village, u.district
        FROM asha_profiles a
        JOIN users u ON u.id = a.user_id
        WHERE a.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    for (const a of memoryAsha.values()) {
      if (a.id === id) return { ...a };
    }
    return null;
  },

  findAll: async () => {
    if (db.getIsConnected()) {
      const query = `
        SELECT a.*, u.full_name, u.phone, u.gender, u.village, u.district
        FROM asha_profiles a
        JOIN users u ON u.id = a.user_id
        ORDER BY a.created_at DESC;
      `;
      const res = await db.query(query);
      return res.rows;
    }
    return Array.from(memoryAsha.values());
  },

  create: async (data) => {
    const id = data.id || `asha-prof-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO asha_profiles (
          id, user_id, employee_id, assigned_villages, sub_centre,
          households_covered, active_maternal_cases, supervisor_name, qualification, verification_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.userId, data.employeeId, data.assignedVillages || [], data.subCentre,
        data.householdsCovered || 0, data.activeMaternalCases || 0, data.supervisorName, data.qualification, data.verificationStatus || 'VERIFIED'
      ]);
      return res.rows[0];
    }
    const newAsha = { id, ...data };
    memoryAsha.set(data.userId, newAsha);
    return newAsha;
  },

  updateStatus: async (id, status) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'UPDATE asha_profiles SET verification_status = $1 WHERE id = $2 OR user_id = $2 RETURNING *',
        [status, id]
      );
      return res.rows[0];
    }
    for (const a of memoryAsha.values()) {
      if (a.id === id || a.user_id === id) {
        a.verification_status = status;
        return a;
      }
    }
    return null;
  }
};

module.exports = ASHAWorker;
