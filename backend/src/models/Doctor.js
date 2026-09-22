const db = require('../config/db');

const memoryDoctors = new Map([
  ['usr-doc-01', {
    id: 'doc-prof-01',
    user_id: 'usr-doc-01',
    full_name: 'Dr. Ramesh Kulkarni (MBBS, DNB)',
    phone: '9876543230',
    gender: 'male',
    village: 'Khed',
    district: 'Pune',
    registration_number: 'MCI-MH-2012-45892',
    specialization: 'General Medicine & Maternal Health',
    designation: 'Senior Medical Officer, Khed CHC',
    facility_id: 'fac-phc-01',
    facility_name: 'Khed Community Health Centre (CHC)',
    opd_timings: '09:00 AM - 02:00 PM',
    available_for_teleconsult: true,
    verification_status: 'VERIFIED'
  }]
]);

const Doctor = {
  findByUserId: async (userId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT d.*, u.full_name, u.phone, u.gender, u.village, u.district, f.name as facility_name
        FROM doctor_profiles d
        JOIN users u ON u.id = d.user_id
        LEFT JOIN facilities f ON f.id = d.facility_id
        WHERE d.user_id = $1;
      `;
      const res = await db.query(query, [userId]);
      return res.rows[0] || null;
    }
    return memoryDoctors.get(userId) || null;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT d.*, u.full_name, u.phone, u.gender, u.village, u.district, f.name as facility_name
        FROM doctor_profiles d
        JOIN users u ON u.id = d.user_id
        LEFT JOIN facilities f ON f.id = d.facility_id
        WHERE d.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    for (const d of memoryDoctors.values()) {
      if (d.id === id) return { ...d };
    }
    return null;
  },

  findAll: async () => {
    if (db.getIsConnected()) {
      const query = `
        SELECT d.*, u.full_name, u.phone, u.gender, u.village, u.district, f.name as facility_name
        FROM doctor_profiles d
        JOIN users u ON u.id = d.user_id
        LEFT JOIN facilities f ON f.id = d.facility_id
        ORDER BY d.created_at DESC;
      `;
      const res = await db.query(query);
      return res.rows;
    }
    return Array.from(memoryDoctors.values());
  },

  create: async (data) => {
    const id = data.id || `doc-prof-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO doctor_profiles (
          id, user_id, registration_number, specialization, designation,
          facility_id, opd_timings, available_for_teleconsult, verification_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.userId, data.registrationNumber, data.specialization, data.designation,
        data.facilityId || null, data.opdTimings || '09:00 AM - 02:00 PM', data.availableForTeleconsult !== false, data.verificationStatus || 'VERIFIED'
      ]);
      return res.rows[0];
    }
    const newDoc = { id, ...data };
    memoryDoctors.set(data.userId, newDoc);
    return newDoc;
  },

  updateStatus: async (id, status) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'UPDATE doctor_profiles SET verification_status = $1 WHERE id = $2 OR user_id = $2 RETURNING *',
        [status, id]
      );
      return res.rows[0];
    }
    for (const d of memoryDoctors.values()) {
      if (d.id === id || d.user_id === id) {
        d.verification_status = status;
        return d;
      }
    }
    return null;
  }
};

module.exports = Doctor;
