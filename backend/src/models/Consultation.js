const db = require('../config/db');

const memoryConsultations = new Map([
  ['con-01', {
    id: 'con-01',
    appointment_id: 'apt-01',
    patient_id: 'usr-pat-female-01',
    patient_name: 'Radhika Suresh Shinde',
    doctor_id: 'usr-doc-01',
    doctor_name: 'Dr. Ramesh Kulkarni',
    asha_id: 'usr-asha-01',
    consultation_type: 'IN_PERSON',
    status: 'SCHEDULED',
    priority: 'GREEN',
    chief_complaint: 'Routine 3rd Trimester Gestational Assessment',
    doctor_diagnosis: null,
    prescription_notes: null,
    clinical_examination: 'Fundal height 27cm, fetal heart rate 142 bpm regular. No pedal edema.',
    scheduled_for: new Date('2026-09-18T10:30:00Z').toISOString(),
    created_at: new Date('2026-09-12').toISOString()
  }]
]);

const Consultation = {
  create: async (data) => {
    const id = data.id || `con-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO consultations (
          id, appointment_id, patient_id, doctor_id, asha_id,
          consultation_type, status, priority, chief_complaint, scheduled_for
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.appointmentId || null, data.patientId, data.doctorId || null, data.ashaId || null,
        data.consultationType || 'LIVE_VIDEO', data.status || 'REQUESTED', data.priority || 'YELLOW',
        data.chiefComplaint, data.scheduledFor ? new Date(data.scheduledFor) : null
      ]);
      return res.rows[0];
    }

    const con = {
      id,
      appointment_id: data.appointmentId || null,
      patient_id: data.patientId,
      doctor_id: data.doctorId || null,
      asha_id: data.ashaId || null,
      consultation_type: data.consultationType || 'LIVE_VIDEO',
      status: data.status || 'REQUESTED',
      priority: data.priority || 'YELLOW',
      chief_complaint: data.chiefComplaint,
      scheduled_for: data.scheduledFor || new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    memoryConsultations.set(id, con);
    return con;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT c.*, p.full_name as patient_name, p.phone as patient_phone,
               d.full_name as doctor_name, a.full_name as asha_name
        FROM consultations c
        JOIN users p ON p.id = c.patient_id
        LEFT JOIN users d ON d.id = c.doctor_id
        LEFT JOIN users a ON a.id = c.asha_id
        WHERE c.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    return memoryConsultations.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT c.*, d.full_name as doctor_name
        FROM consultations c
        LEFT JOIN users d ON d.id = c.doctor_id
        WHERE c.patient_id = $1
        ORDER BY c.created_at DESC;
      `;
      const res = await db.query(query, [patientId]);
      return res.rows;
    }
    return Array.from(memoryConsultations.values())
      .filter(c => c.patient_id === patientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  findByDoctorId: async (doctorId, status = null) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT c.*, p.full_name as patient_name, p.phone as patient_phone
        FROM consultations c
        JOIN users p ON p.id = c.patient_id
        WHERE c.doctor_id = $1
      `;
      const params = [doctorId];
      if (status) {
        params.push(status);
        query += ` AND c.status = $${params.length}`;
      }
      query += ' ORDER BY c.created_at DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryConsultations.values()).filter(c => c.doctor_id === doctorId);
    if (status) list = list.filter(c => c.status === status);
    return list;
  },

  completeConsultation: async (id, data) => {
    if (db.getIsConnected()) {
      const query = `
        UPDATE consultations SET
          status = 'COMPLETED',
          doctor_diagnosis = $1,
          prescription_notes = $2,
          clinical_examination = $3,
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
      `;
      const res = await db.query(query, [
        data.diagnosis, data.prescriptionNotes || '', data.clinicalExamination || '', id
      ]);
      return res.rows[0];
    }
    const c = memoryConsultations.get(id);
    if (c) {
      c.status = 'COMPLETED';
      c.doctor_diagnosis = data.diagnosis;
      c.prescription_notes = data.prescriptionNotes || '';
      c.clinical_examination = data.clinicalExamination || '';
      c.completed_at = new Date().toISOString();
      return c;
    }
    return null;
  },

  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT c.*, p.full_name as patient_name, d.full_name as doctor_name
        FROM consultations c
        JOIN users p ON p.id = c.patient_id
        LEFT JOIN users d ON d.id = c.doctor_id
        WHERE 1=1
      `;
      const params = [];
      if (filters.status) {
        params.push(filters.status);
        query += ` AND c.status = $${params.length}`;
      }
      query += ' ORDER BY c.created_at DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryConsultations.values());
    if (filters.status) list = list.filter(c => c.status === filters.status);
    return list;
  }
};

module.exports = Consultation;
