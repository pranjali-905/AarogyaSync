const db = require('../config/db');

const memoryPrescriptions = new Map([
  ['rx-01', {
    id: 'rx-01',
    consultation_id: 'con-01',
    patient_id: 'usr-pat-female-01',
    patient_name: 'Radhika Suresh Shinde',
    doctor_id: 'usr-doc-01',
    doctor_name: 'Dr. Ramesh Kulkarni',
    diagnosis: 'Antenatal Care - 28 Weeks Gestation (Normal Progress)',
    medicines: [
      { name: 'Iron & Folic Acid (IFA)', dosage: '1 tablet', frequency: 'Once daily after food', duration: '60 days', instructions: 'Take with lemon water, avoid tea within 1 hour' },
      { name: 'Calcium Carbonate 500mg', dosage: '1 tablet', frequency: 'Twice daily after food', duration: '60 days', instructions: 'Take after meal' }
    ],
    advice: 'Drink at least 3 liters of clean boiled water daily. Walk 20 minutes in morning. Monitor fetal kick counts.',
    qr_token: 'qr-rx-pat01-202609',
    digital_signature: 'Verified Dr. Ramesh Kulkarni (MCI-MH-2012-45892)',
    status: 'ACTIVE',
    issued_at: new Date('2026-09-12').toISOString()
  }]
]);

const Prescription = {
  create: async (data) => {
    const id = data.id || `rx-${Date.now().toString(36)}`;
    const qrToken = data.qrToken || `qr-rx-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    const digitalSignature = data.digitalSignature || `Digitally Signed by ${data.doctorName || 'Medical Officer'}`;

    if (db.getIsConnected()) {
      const query = `
        INSERT INTO prescriptions (
          id, consultation_id, patient_id, doctor_id, diagnosis, medicines, advice, qr_token, digital_signature, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.consultationId || null, data.patientId, data.doctorId || null,
        data.diagnosis, JSON.stringify(data.medicines || []), data.advice || '',
        qrToken, digitalSignature, data.status || 'ACTIVE'
      ]);
      return res.rows[0];
    }

    const rx = {
      id,
      consultation_id: data.consultationId || null,
      patient_id: data.patientId,
      doctor_id: data.doctorId || null,
      diagnosis: data.diagnosis,
      medicines: data.medicines || [],
      advice: data.advice || '',
      qr_token: qrToken,
      digital_signature: digitalSignature,
      status: data.status || 'ACTIVE',
      issued_at: new Date().toISOString()
    };
    memoryPrescriptions.set(id, rx);
    return rx;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT rx.*, p.full_name as patient_name, d.full_name as doctor_name
        FROM prescriptions rx
        JOIN users p ON p.id = rx.patient_id
        LEFT JOIN users d ON d.id = rx.doctor_id
        WHERE rx.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    return memoryPrescriptions.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT rx.*, d.full_name as doctor_name
        FROM prescriptions rx
        LEFT JOIN users d ON d.id = rx.doctor_id
        WHERE rx.patient_id = $1
        ORDER BY rx.issued_at DESC;
      `;
      const res = await db.query(query, [patientId]);
      return res.rows;
    }
    return Array.from(memoryPrescriptions.values())
      .filter(rx => rx.patient_id === patientId)
      .sort((a, b) => new Date(b.issued_at) - new Date(a.issued_at));
  },

  findByDoctorId: async (doctorId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT rx.*, p.full_name as patient_name
        FROM prescriptions rx
        JOIN users p ON p.id = rx.patient_id
        WHERE rx.doctor_id = $1
        ORDER BY rx.issued_at DESC;
      `;
      const res = await db.query(query, [doctorId]);
      return res.rows;
    }
    return Array.from(memoryPrescriptions.values())
      .filter(rx => rx.doctor_id === doctorId)
      .sort((a, b) => new Date(b.issued_at) - new Date(a.issued_at));
  },

  updateStatus: async (id, status) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'UPDATE prescriptions SET status = $1 WHERE id = $2 RETURNING *;',
        [status, id]
      );
      return res.rows[0];
    }
    const rx = memoryPrescriptions.get(id);
    if (rx) {
      rx.status = status;
      return rx;
    }
    return null;
  }
};

module.exports = Prescription;
