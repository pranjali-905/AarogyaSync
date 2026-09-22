const db = require('../config/db');

const memoryDiagnostics = [
  { id: 'diag-01', name: 'Rapid Antigen Malaria Test (Pf/Pv)', code: 'MAL-RDT', category: 'RAPID_TEST', sample_type: 'BLOOD', turnaround_hours: 1, normal_range: 'Negative' },
  { id: 'diag-02', name: 'Digital Hemoglobin Strip Test (Hb)', code: 'HB-STRIP', category: 'RAPID_TEST', sample_type: 'BLOOD', turnaround_hours: 1, normal_range: '12.0 - 15.5 g/dL' },
  { id: 'diag-03', name: 'Urine Albumin & Sugar Dipstick', code: 'URINE-DIP', category: 'URINE', sample_type: 'URINE', turnaround_hours: 1, normal_range: 'Nil / Negative' },
  { id: 'diag-04', name: 'Fasting Blood Glucose (Glucometer)', code: 'FBG-POC', category: 'BIOCHEMISTRY', sample_type: 'BLOOD', turnaround_hours: 1, normal_range: '70 - 99 mg/dL' },
  { id: 'diag-05', name: 'Sputum Smear for AFB / CBNAAT', code: 'TB-CBNAAT', category: 'PATHOLOGY', sample_type: 'SPUTUM', turnaround_hours: 24, normal_range: 'Negative' },
  { id: 'diag-06', name: 'Rapid Urine Pregnancy Test (UPT)', code: 'UPT-POC', category: 'MATERNAL', sample_type: 'URINE', turnaround_hours: 1, normal_range: 'Negative / Positive' }
];

const memoryDiagAvailability = [
  { id: 'da-01', facility_id: 'fac-phc-01', facility_name: 'Khed Community Health Centre (CHC)', test_id: 'diag-01', test_name: 'Rapid Antigen Malaria Test (Pf/Pv)', category: 'RAPID_TEST', is_available: true, daily_capacity: 150, equipment_status: 'FUNCTIONAL' },
  { id: 'da-02', facility_id: 'fac-phc-01', facility_name: 'Khed Community Health Centre (CHC)', test_id: 'diag-02', test_name: 'Digital Hemoglobin Strip Test (Hb)', category: 'RAPID_TEST', is_available: true, daily_capacity: 200, equipment_status: 'FUNCTIONAL' },
  { id: 'da-03', facility_id: 'fac-phc-01', facility_name: 'Khed Community Health Centre (CHC)', test_id: 'diag-03', test_name: 'Urine Albumin & Sugar Dipstick', category: 'URINE', is_available: true, daily_capacity: 100, equipment_status: 'FUNCTIONAL' },
  { id: 'da-04', facility_id: 'fac-phc-02', facility_name: 'Bhimashankar Primary Health Centre (PHC)', test_id: 'diag-01', test_name: 'Rapid Antigen Malaria Test (Pf/Pv)', category: 'RAPID_TEST', is_available: true, daily_capacity: 80, equipment_status: 'FUNCTIONAL' },
  { id: 'da-05', facility_id: 'fac-phc-02', facility_name: 'Bhimashankar Primary Health Centre (PHC)', test_id: 'diag-02', test_name: 'Digital Hemoglobin Strip Test (Hb)', category: 'RAPID_TEST', is_available: true, daily_capacity: 100, equipment_status: 'FUNCTIONAL' },
  { id: 'da-06', facility_id: 'fac-sub-03', facility_name: 'Nigdale Sub-Centre Health Post', test_id: 'diag-02', test_name: 'Digital Hemoglobin Strip Test (Hb)', category: 'RAPID_TEST', is_available: true, daily_capacity: 30, equipment_status: 'FUNCTIONAL' },
  { id: 'da-07', facility_id: 'fac-sub-03', facility_name: 'Nigdale Sub-Centre Health Post', test_id: 'diag-06', test_name: 'Rapid Urine Pregnancy Test (UPT)', category: 'MATERNAL', is_available: true, daily_capacity: 50, equipment_status: 'FUNCTIONAL' }
];

const DiagnosticTest = {
  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = 'SELECT * FROM diagnostic_tests WHERE 1=1';
      const params = [];
      if (filters.category) {
        params.push(filters.category);
        query += ` AND category = $${params.length}`;
      }
      if (filters.search) {
        params.push(`%${filters.search}%`);
        query += ` AND (name ILIKE $${params.length} OR code ILIKE $${params.length})`;
      }
      query += ' ORDER BY name ASC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = [...memoryDiagnostics];
    if (filters.category) list = list.filter(t => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q));
    }
    return list;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM diagnostic_tests WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryDiagnostics.find(t => t.id === id) || null;
  },

  findAvailability: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT da.*, dt.name as test_name, dt.code, dt.category, dt.sample_type, dt.turnaround_hours, dt.normal_range,
               f.name as facility_name, f.facility_type, f.village, f.block, f.contact_phone
        FROM diagnostic_availability da
        JOIN diagnostic_tests dt ON dt.id = da.test_id
        JOIN facilities f ON f.id = da.facility_id
        WHERE 1=1
      `;
      const params = [];
      if (filters.facilityId) {
        params.push(filters.facilityId);
        query += ` AND da.facility_id = $${params.length}`;
      }
      if (filters.search) {
        params.push(`%${filters.search}%`);
        query += ` AND (dt.name ILIKE $${params.length} OR dt.category ILIKE $${params.length} OR f.name ILIKE $${params.length})`;
      }
      if (filters.availableOnly) {
        query += ' AND da.is_available = true';
      }
      query += ' ORDER BY f.name ASC, dt.name ASC';
      const res = await db.query(query, params);
      return res.rows;
    }

    let list = [...memoryDiagAvailability];
    if (filters.facilityId) list = list.filter(item => item.facility_id === filters.facilityId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(item => item.test_name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.facility_name.toLowerCase().includes(q));
    }
    if (filters.availableOnly) list = list.filter(item => item.is_available);
    return list;
  }
};

module.exports = DiagnosticTest;
