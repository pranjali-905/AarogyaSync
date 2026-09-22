const db = require('../config/db');

const memoryFacilities = new Map([
  ['fac-phc-01', {
    id: 'fac-phc-01',
    name: 'Khed Community Health Centre (CHC)',
    facility_type: 'CHC',
    village: 'Khed',
    block: 'Rajgurunagar',
    district: 'Pune',
    contact_phone: '+91-9822001122',
    doctor_in_charge: 'Dr. Ramesh Kulkarni',
    ambulance_available: true,
    operating_hours: '24x7',
    total_beds: 30,
    icu_beds: 4
  }],
  ['fac-phc-02', {
    id: 'fac-phc-02',
    name: 'Bhimashankar Primary Health Centre (PHC)',
    facility_type: 'PHC',
    village: 'Bhimashankar',
    block: 'Ambegaon',
    district: 'Pune',
    contact_phone: '+91-9822003344',
    doctor_in_charge: 'Dr. Sunita Deshmukh',
    ambulance_available: true,
    operating_hours: '24x7',
    total_beds: 12,
    icu_beds: 0
  }],
  ['fac-sub-03', {
    id: 'fac-sub-03',
    name: 'Nigdale Sub-Centre Health Post',
    facility_type: 'SUB_CENTRE',
    village: 'Nigdale',
    block: 'Ambegaon',
    district: 'Pune',
    contact_phone: '+91-9822005566',
    doctor_in_charge: 'Sunita Tai (ASHA Sangini)',
    ambulance_available: false,
    operating_hours: '08:00 AM - 04:00 PM',
    total_beds: 2,
    icu_beds: 0
  }],
  ['fac-dh-04', {
    id: 'fac-dh-04',
    name: 'Aundh District Hospital',
    facility_type: 'DISTRICT_HOSPITAL',
    village: 'Aundh',
    block: 'Haveli',
    district: 'Pune',
    contact_phone: '+91-9822007788',
    doctor_in_charge: 'Dr. Sanjay Deshpande',
    ambulance_available: true,
    operating_hours: '24x7',
    total_beds: 350,
    icu_beds: 40
  }]
]);

const Facility = {
  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = 'SELECT * FROM facilities WHERE 1=1';
      const params = [];
      if (filters.facilityType) {
        params.push(filters.facilityType);
        query += ` AND facility_type = $${params.length}`;
      }
      if (filters.district) {
        params.push(filters.district);
        query += ` AND district = $${params.length}`;
      }
      if (filters.search) {
        params.push(`%${filters.search}%`);
        query += ` AND (name ILIKE $${params.length} OR block ILIKE $${params.length} OR village ILIKE $${params.length})`;
      }
      query += ' ORDER BY name ASC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryFacilities.values());
    if (filters.facilityType) {
      list = list.filter(f => f.facility_type === filters.facilityType);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.block.toLowerCase().includes(q));
    }
    return list;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM facilities WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryFacilities.get(id) || null;
  },

  create: async (data) => {
    const id = data.id || `fac-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO facilities (
          id, name, facility_type, village, block, district,
          contact_phone, doctor_in_charge, ambulance_available, operating_hours, total_beds, icu_beds
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.name, data.facilityType, data.village, data.block, data.district || 'Pune',
        data.contactPhone, data.doctorInCharge, data.ambulanceAvailable || false,
        data.operatingHours || '24x7', data.totalBeds || 10, data.icuBeds || 0
      ]);
      return res.rows[0];
    }
    const newF = { id, ...data };
    memoryFacilities.set(id, newF);
    return newF;
  }
};

module.exports = Facility;
