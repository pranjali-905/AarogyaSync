const db = require('../config/db');

const memoryPatients = new Map([
  ['usr-pat-female-01', {
    id: 'pat-01',
    user_id: 'usr-pat-female-01',
    full_name: 'Radhika Suresh Shinde',
    phone: '9876543210',
    gender: 'female',
    patient_type: 'female',
    patientType: 'female',
    village: 'Nigdale',
    district: 'Pune',
    abha_id: '91-4521-8890-1234',
    dob: '2002-05-14',
    age: 24,
    blood_group: 'B+',
    emergency_contact_phone: '+91-9823112233',
    emergency_contact_name: 'Suresh Shinde',
    emergency_contact_relation: 'Husband',
    is_pregnant: true,
    gravida: 'G1P0',
    lmp_date: '2026-03-01',
    edd_date: '2026-12-06',
    gestational_weeks: 28,
    high_risk_flag: false,
    chronic_conditions: [],
    allergies: ['Penicillin'],
    assigned_asha_id: 'usr-asha-01',
    created_at: new Date('2026-01-10').toISOString()
  }],
  ['usr-pat-male-02', {
    id: 'pat-02',
    user_id: 'usr-pat-male-02',
    full_name: 'Tukaram Maruti Patil',
    phone: '9876543211',
    gender: 'male',
    patient_type: 'male',
    patientType: 'male',
    village: 'Khed',
    district: 'Pune',
    abha_id: '91-3142-9901-5678',
    dob: '1978-08-20',
    age: 48,
    blood_group: 'O+',
    emergency_contact_phone: '+91-9822114455',
    emergency_contact_name: 'Parvati Patil',
    emergency_contact_relation: 'Wife',
    is_pregnant: false,
    high_risk_flag: false,
    chronic_conditions: ['Hypertension', 'Impaired Fasting Glucose'],
    allergies: [],
    assigned_asha_id: 'usr-asha-01',
    created_at: new Date('2026-01-12').toISOString()
  }]
]);

const Patient = {
  findByUserId: async (userId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT p.*, u.full_name, u.phone, u.gender, u.village, u.district, u.preferred_language
        FROM patient_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE p.user_id = $1;
      `;
      const res = await db.query(query, [userId]);
      const row = res.rows[0] || null;
      if (row) {
        row.patientType = row.patient_type || row.gender || 'female';
      }
      return row;
    }
    const pat = memoryPatients.get(userId);
    if (!pat) return null;
    const User = require('./User');
    const u = await User.findById(userId);
    const resolvedType = pat.patient_type || pat.patientType || pat.gender || u?.patientType || u?.gender || 'female';
    return {
      ...pat,
      full_name: pat.full_name || u?.full_name || u?.fullName,
      phone: pat.phone || u?.phone,
      gender: pat.gender || u?.gender,
      patientType: resolvedType,
      patient_type: resolvedType,
      village: pat.village || u?.village,
      district: pat.district || u?.district,
      preferred_language: pat.preferred_language || u?.preferred_language
    };
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT p.*, u.full_name, u.phone, u.gender, u.village, u.district, u.preferred_language
        FROM patient_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE p.id = $1;
      `;
      const res = await db.query(query, [id]);
      const row = res.rows[0] || null;
      if (row) {
        row.patientType = row.patient_type || row.gender || 'female';
      }
      return row;
    }
    for (const p of memoryPatients.values()) {
      if (p.id === id) {
        const User = require('./User');
        const u = await User.findById(p.user_id || p.userId);
        const resolvedType = p.patient_type || p.patientType || p.gender || u?.patientType || u?.gender || 'female';
        return {
          ...p,
          full_name: p.full_name || u?.full_name || u?.fullName,
          phone: p.phone || u?.phone,
          gender: p.gender || u?.gender,
          patientType: resolvedType,
          patient_type: resolvedType,
          village: p.village || u?.village,
          district: p.district || u?.district,
          preferred_language: p.preferred_language || u?.preferred_language
        };
      }
    }
    return null;
  },

  findByAbhaId: async (abhaId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT p.*, u.full_name, u.phone, u.gender, u.village, u.district
        FROM patient_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE p.abha_id = $1;
      `;
      const res = await db.query(query, [abhaId]);
      return res.rows[0] || null;
    }
    for (const p of memoryPatients.values()) {
      if (p.abha_id === abhaId) return { ...p };
    }
    return null;
  },

  create: async (data) => {
    const id = data.id || `pat-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO patient_profiles (
          id, user_id, abha_id, dob, age, blood_group,
          emergency_contact_phone, emergency_contact_name, emergency_contact_relation,
          is_pregnant, gravida, lmp_date, edd_date, gestational_weeks,
          high_risk_flag, chronic_conditions, allergies, assigned_asha_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.userId, data.abhaId || null, data.dob || null, data.age || null, data.bloodGroup || null,
        data.emergencyContactPhone || null, data.emergencyContactName || null, data.emergencyContactRelation || null,
        data.isPregnant || false, data.gravida || null, data.lmpDate || null, data.eddDate || null, data.gestationalWeeks || null,
        data.highRiskFlag || false, data.chronicConditions || [], data.allergies || [], data.assignedAshaId || null
      ]);
      return res.rows[0];
    }
    const resolvedType = data.patientType || data.patient_type || data.gender || 'female';
    const newPat = { id, ...data, patient_type: resolvedType, patientType: resolvedType };
    memoryPatients.set(data.userId, newPat);
    return newPat;
  },

  update: async (userId, data) => {
    if (db.getIsConnected()) {
      const query = `
        UPDATE patient_profiles SET
          abha_id = COALESCE($1, abha_id),
          age = COALESCE($2, age),
          blood_group = COALESCE($3, blood_group),
          is_pregnant = COALESCE($4, is_pregnant),
          high_risk_flag = COALESCE($5, high_risk_flag),
          chronic_conditions = COALESCE($6, chronic_conditions),
          allergies = COALESCE($7, allergies),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $8
        RETURNING *;
      `;
      const res = await db.query(query, [
        data.abhaId, data.age, data.bloodGroup, data.isPregnant,
        data.highRiskFlag, data.chronicConditions, data.allergies, userId
      ]);
      return res.rows[0];
    }
    if (memoryPatients.has(userId)) {
      const p = memoryPatients.get(userId);
      Object.assign(p, data);
      return p;
    }
    return null;
  },

  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT p.*, u.full_name, u.phone, u.gender, u.village, u.district
        FROM patient_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE 1=1
      `;
      const params = [];
      if (filters.assignedAshaId) {
        params.push(filters.assignedAshaId);
        query += ` AND p.assigned_asha_id = $${params.length}`;
      }
      if (filters.isPregnant !== undefined) {
        params.push(filters.isPregnant);
        query += ` AND p.is_pregnant = $${params.length}`;
      }
      if (filters.highRiskOnly) {
        query += ' AND p.high_risk_flag = true';
      }
      query += ' ORDER BY p.created_at DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryPatients.values());
    if (filters.assignedAshaId) {
      list = list.filter(p => p.assigned_asha_id === filters.assignedAshaId);
    }
    if (filters.isPregnant !== undefined) {
      list = list.filter(p => Boolean(p.is_pregnant) === Boolean(filters.isPregnant));
    }
    if (filters.highRiskOnly) {
      list = list.filter(p => Boolean(p.high_risk_flag) === true);
    }
    return list;
  }
};

module.exports = Patient;
