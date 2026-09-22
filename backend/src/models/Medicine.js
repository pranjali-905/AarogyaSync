const db = require('../config/db');

const memoryMedicines = [
  { id: 'med-01', name: 'Paracetamol 500mg', generic_name: 'Paracetamol', category: 'ANALGESIC', dosage_form: 'TABLET', strength: '500mg', is_essential: true },
  { id: 'med-02', name: 'Oral Rehydration Salts (ORS)', generic_name: 'Oral Electrolyte Powder', category: 'NUTRITIONAL', dosage_form: 'SACHET', strength: '21.8g', is_essential: true },
  { id: 'med-03', name: 'Iron & Folic Acid (IFA)', generic_name: 'Ferrous Sulfate + Folic Acid', category: 'NUTRITIONAL', dosage_form: 'TABLET', strength: '100mg Fe + 0.5mg FA', is_essential: true },
  { id: 'med-04', name: 'Calcium Carbonate + Vitamin D3', generic_name: 'Calcium + Vit D3', category: 'NUTRITIONAL', dosage_form: 'TABLET', strength: '500mg', is_essential: true },
  { id: 'med-05', name: 'Amlodipine 5mg', generic_name: 'Amlodipine Besylate', category: 'ANTIHYPERTENSIVE', dosage_form: 'TABLET', strength: '5mg', is_essential: true },
  { id: 'med-06', name: 'Telmisartan 40mg', generic_name: 'Telmisartan', category: 'ANTIHYPERTENSIVE', dosage_form: 'TABLET', strength: '40mg', is_essential: true },
  { id: 'med-07', name: 'Metformin 500mg', generic_name: 'Metformin Hydrochloride', category: 'ANTIDIABETIC', dosage_form: 'TABLET', strength: '500mg', is_essential: true },
  { id: 'med-08', name: 'Amoxicillin 250mg', generic_name: 'Amoxicillin Trihydrate', category: 'ANTIBIOTIC', dosage_form: 'CAPSULE', strength: '250mg', is_essential: true },
  { id: 'med-09', name: 'Zinc Sulfate 20mg', generic_name: 'Zinc Sulfate Monohydrate', category: 'NUTRITIONAL', dosage_form: 'TABLET', strength: '20mg dispersible', is_essential: true },
  { id: 'med-10', name: 'Calamine Lotion 100ml', generic_name: 'Calamine + Zinc Oxide', category: 'OTHER', dosage_form: 'LOTION', strength: '15% w/v', is_essential: false }
];

const memoryAvailability = [
  { id: 'ma-01', facility_id: 'fac-phc-01', facility_name: 'Khed Community Health Centre (CHC)', medicine_id: 'med-01', medicine_name: 'Paracetamol 500mg', category: 'ANALGESIC', current_stock: 1200, unit: 'tablets', is_available: true },
  { id: 'ma-02', facility_id: 'fac-phc-01', facility_name: 'Khed Community Health Centre (CHC)', medicine_id: 'med-02', medicine_name: 'Oral Rehydration Salts (ORS)', category: 'NUTRITIONAL', current_stock: 450, unit: 'packets', is_available: true },
  { id: 'ma-03', facility_id: 'fac-phc-01', facility_name: 'Khed Community Health Centre (CHC)', medicine_id: 'med-03', medicine_name: 'Iron & Folic Acid (IFA)', category: 'NUTRITIONAL', current_stock: 900, unit: 'tablets', is_available: true },
  { id: 'ma-04', facility_id: 'fac-phc-01', facility_name: 'Khed Community Health Centre (CHC)', medicine_id: 'med-05', medicine_name: 'Amlodipine 5mg', category: 'ANTIHYPERTENSIVE', current_stock: 600, unit: 'tablets', is_available: true },
  { id: 'ma-05', facility_id: 'fac-phc-02', facility_name: 'Bhimashankar Primary Health Centre (PHC)', medicine_id: 'med-01', medicine_name: 'Paracetamol 500mg', category: 'ANALGESIC', current_stock: 350, unit: 'tablets', is_available: true },
  { id: 'ma-06', facility_id: 'fac-phc-02', facility_name: 'Bhimashankar Primary Health Centre (PHC)', medicine_id: 'med-08', medicine_name: 'Amoxicillin 250mg', category: 'ANTIBIOTIC', current_stock: 0, unit: 'capsules', is_available: false },
  { id: 'ma-07', facility_id: 'fac-sub-03', facility_name: 'Nigdale Sub-Centre Health Post', medicine_id: 'med-01', medicine_name: 'Paracetamol 500mg', category: 'ANALGESIC', current_stock: 150, unit: 'tablets', is_available: true },
  { id: 'ma-08', facility_id: 'fac-sub-03', facility_name: 'Nigdale Sub-Centre Health Post', medicine_id: 'med-03', medicine_name: 'Iron & Folic Acid (IFA)', category: 'NUTRITIONAL', current_stock: 250, unit: 'tablets', is_available: true }
];

const Medicine = {
  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = 'SELECT * FROM medicines WHERE 1=1';
      const params = [];
      if (filters.category) {
        params.push(filters.category);
        query += ` AND category = $${params.length}`;
      }
      if (filters.search) {
        params.push(`%${filters.search}%`);
        query += ` AND (name ILIKE $${params.length} OR generic_name ILIKE $${params.length})`;
      }
      query += ' ORDER BY name ASC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = [...memoryMedicines];
    if (filters.category) list = list.filter(m => m.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.generic_name.toLowerCase().includes(q));
    }
    return list;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM medicines WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryMedicines.find(m => m.id === id) || null;
  },

  findAvailability: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT ma.*, m.name as medicine_name, m.generic_name, m.category, m.dosage_form, m.strength,
               f.name as facility_name, f.facility_type, f.village, f.block, f.contact_phone
        FROM medicine_availability ma
        JOIN medicines m ON m.id = ma.medicine_id
        JOIN facilities f ON f.id = ma.facility_id
        WHERE 1=1
      `;
      const params = [];
      if (filters.facilityId) {
        params.push(filters.facilityId);
        query += ` AND ma.facility_id = $${params.length}`;
      }
      if (filters.search) {
        params.push(`%${filters.search}%`);
        query += ` AND (m.name ILIKE $${params.length} OR m.category ILIKE $${params.length} OR f.name ILIKE $${params.length})`;
      }
      if (filters.inStockOnly) {
        query += ' AND ma.is_available = true';
      }
      query += ' ORDER BY f.name ASC, m.name ASC';
      const res = await db.query(query, params);
      return res.rows;
    }

    let list = [...memoryAvailability];
    if (filters.facilityId) list = list.filter(item => item.facility_id === filters.facilityId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(item => item.medicine_name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.facility_name.toLowerCase().includes(q));
    }
    if (filters.inStockOnly) list = list.filter(item => item.is_available);
    return list;
  }
};

module.exports = Medicine;
