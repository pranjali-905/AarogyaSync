const db = require('../config/db');

const memoryRecords = new Map([
  ['rec-01', {
    id: 'rec-01',
    patient_id: 'usr-pat-female-01',
    doc_title: 'ANC 2nd Trimester Ultrasound & Lab Report',
    doc_type: 'LAB_REPORT',
    file_url: '/backpack/docs/anc2_ultrasound.pdf',
    issued_by: 'Dr. Sunita Deshmukh (Bhimashankar PHC)',
    doc_date: '2026-06-25',
    metadata: { singleLiveIntrauterine: true, placenta: 'Fundal Anterior', hb: '11.2 g/dL' },
    created_at: new Date('2026-06-25').toISOString()
  }],
  ['rec-02', {
    id: 'rec-02',
    patient_id: 'usr-pat-female-01',
    doc_title: 'Tetanus Toxoid TT-2 Certificate',
    doc_type: 'VACCINE_CERT',
    file_url: '/backpack/docs/tt2_vaccine.pdf',
    issued_by: 'Sunita Tai (Nigdale Sub-Centre)',
    doc_date: '2026-05-15',
    metadata: { vaccine: 'TT-2', batchNo: 'TT-9842' },
    created_at: new Date('2026-05-15').toISOString()
  }],
  ['rec-03', {
    id: 'rec-03',
    patient_id: 'usr-pat-male-02',
    doc_title: 'Annual Lipid Profile & HbA1c Lab Report',
    doc_type: 'LAB_REPORT',
    file_url: '/backpack/docs/lipid_profile.pdf',
    issued_by: 'Khed CHC Central Laboratory',
    doc_date: '2026-08-10',
    metadata: { cholesterol: 194, hba1c: 5.8, fastingGlucose: 108 },
    created_at: new Date('2026-08-10').toISOString()
  }]
]);

const HealthRecord = {
  create: async (data) => {
    const id = data.id || `rec-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO health_records (
          id, patient_id, doc_title, doc_type, file_url, issued_by, doc_date, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.patientId, data.docTitle, data.docType || 'LAB_REPORT',
        data.fileUrl || null, data.issuedBy || '', data.docDate || new Date(),
        JSON.stringify(data.metadata || {})
      ]);
      return res.rows[0];
    }

    const rec = {
      id,
      patient_id: data.patientId,
      doc_title: data.docTitle,
      doc_type: data.docType || 'LAB_REPORT',
      file_url: data.fileUrl || null,
      issued_by: data.issuedBy || '',
      doc_date: data.docDate || new Date().toISOString().split('T')[0],
      metadata: data.metadata || {},
      created_at: new Date().toISOString()
    };
    memoryRecords.set(id, rec);
    return rec;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM health_records WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryRecords.get(id) || null;
  },

  findByPatientId: async (patientId, docType = null) => {
    if (db.getIsConnected()) {
      let query = 'SELECT * FROM health_records WHERE patient_id = $1';
      const params = [patientId];
      if (docType) {
        params.push(docType);
        query += ` AND doc_type = $${params.length}`;
      }
      query += ' ORDER BY doc_date DESC, created_at DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryRecords.values()).filter(r => r.patient_id === patientId);
    if (docType) list = list.filter(r => r.doc_type === docType);
    return list.sort((a, b) => new Date(b.doc_date) - new Date(a.doc_date));
  },

  delete: async (id, patientId) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'DELETE FROM health_records WHERE id = $1 AND patient_id = $2 RETURNING id;',
        [id, patientId]
      );
      return res.rowCount > 0;
    }
    if (memoryRecords.has(id)) {
      const r = memoryRecords.get(id);
      if (r.patient_id === patientId) {
        memoryRecords.delete(id);
        return true;
      }
    }
    return false;
  }
};

module.exports = HealthRecord;
