const db = require('../config/db');

// In-memory fallback datastore
const memoryUsers = new Map([
  ['usr-pat-female-01', {
    id: 'usr-pat-female-01',
    full_name: 'Radhika Suresh Shinde',
    phone: '9876543210',
    role: 'PATIENT',
    gender: 'female',
    patient_type: 'female',
    patientType: 'female',
    preferred_language: 'mr',
    village: 'Nigdale',
    district: 'Pune',
    password_hash: '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq',
    created_at: new Date('2026-01-10').toISOString()
  }],
  ['usr-pat-male-02', {
    id: 'usr-pat-male-02',
    full_name: 'Tukaram Maruti Patil',
    phone: '9876543211',
    role: 'PATIENT',
    gender: 'male',
    patient_type: 'male',
    patientType: 'male',
    preferred_language: 'hi',
    village: 'Khed',
    district: 'Pune',
    password_hash: '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq',
    created_at: new Date('2026-01-12').toISOString()
  }],
  ['usr-asha-01', {
    id: 'usr-asha-01',
    full_name: 'Sunita Tai Gawande (ASHA Sangini)',
    phone: '9876543220',
    role: 'ASHA',
    gender: 'female',
    preferred_language: 'mr',
    village: 'Nigdale & Bhimashankar',
    district: 'Pune',
    password_hash: '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq',
    created_at: new Date('2025-11-01').toISOString()
  }],
  ['usr-doc-01', {
    id: 'usr-doc-01',
    full_name: 'Dr. Ramesh Kulkarni (MBBS, DNB)',
    phone: '9876543230',
    role: 'DOCTOR',
    gender: 'male',
    preferred_language: 'en',
    village: 'Khed',
    district: 'Pune',
    password_hash: '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq',
    created_at: new Date('2025-10-15').toISOString()
  }],
  ['usr-admin-01', {
    id: 'usr-admin-01',
    full_name: 'Shri S. V. Gaikwad (District Health Officer)',
    phone: '9876543240',
    role: 'ADMIN',
    gender: 'male',
    preferred_language: 'en',
    village: 'Pune Zilla Parishad',
    district: 'Pune',
    password_hash: '$2a$08$y2sIqGZ.6hHk9Uv0z8L6..j8YJbH9R74Z6x5aYV4s8c.u6U/6F.Vq',
    created_at: new Date('2025-08-01').toISOString()
  }]
]);

const sanitizeUser = (user) => {
  if (!user) return null;
  const copy = { ...user };
  delete copy.password_hash;
  delete copy.passwordHash;
  if (!copy.patientType && (copy.patient_type || copy.gender)) {
    copy.patientType = copy.patient_type || copy.gender;
  }
  return copy;
};

const User = {
  findByPhone: async (phone) => {
    const cleanPhone = String(phone).trim();
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM users WHERE phone = $1', [cleanPhone]);
      return res.rows[0] ? sanitizeUser(res.rows[0]) : null;
    }
    for (const u of memoryUsers.values()) {
      if (u.phone === cleanPhone) return { ...u };
    }
    return null;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return sanitizeUser(res.rows[0]) || null;
    }
    const u = memoryUsers.get(id);
    return sanitizeUser(u);
  },

  create: async (userData) => {
    const {
      id = `usr-${userData.role ? userData.role.toLowerCase() : 'pat'}-${Date.now().toString(36)}`,
      fullName,
      phone,
      role = 'PATIENT',
      gender = 'female',
      patientType,
      preferredLanguage = 'en',
      village = '',
      district = 'Pune',
      passwordHash
    } = userData;

    const resolvedPatientType = patientType || (role === 'PATIENT' ? gender : undefined);

    if (db.getIsConnected()) {
      const query = `
        INSERT INTO users (id, full_name, phone, role, gender, preferred_language, village, district, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
      const res = await db.query(query, [id, fullName, phone, role, gender, preferredLanguage, village, district, passwordHash]);
      const created = sanitizeUser(res.rows[0]);
      if (resolvedPatientType && created) {
        created.patientType = resolvedPatientType;
      }
      return created;
    }

    const newUser = {
      id,
      full_name: fullName,
      phone,
      role,
      gender,
      patient_type: resolvedPatientType,
      patientType: resolvedPatientType,
      preferred_language: preferredLanguage,
      village,
      district,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    };
    memoryUsers.set(id, newUser);
    return sanitizeUser(newUser);
  },

  updatePassword: async (phone, newHash) => {
    const cleanPhone = String(phone).trim();
    if (db.getIsConnected()) {
      await db.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE phone = $2', [newHash, cleanPhone]);
      return true;
    }
    for (const u of memoryUsers.values()) {
      if (u.phone === cleanPhone) {
        u.password_hash = newHash;
        return true;
      }
    }
    return false;
  },

  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let q = 'SELECT * FROM users WHERE 1=1';
      const params = [];
      if (filters.role) {
        params.push(filters.role);
        q += ` AND role = $${params.length}`;
      }
      q += ' ORDER BY created_at DESC';
      const res = await db.query(q, params);
      return res.rows.map(sanitizeUser);
    }
    let list = Array.from(memoryUsers.values());
    if (filters.role) {
      list = list.filter(u => u.role === filters.role);
    }
    return list.map(sanitizeUser);
  }
};

module.exports = User;
