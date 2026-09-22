const db = require('../config/db');

const memoryAppointments = new Map([
  ['apt-01', {
    id: 'apt-01',
    patient_id: 'usr-pat-female-01',
    patient_name: 'Radhika Suresh Shinde',
    doctor_id: 'usr-doc-01',
    doctor_name: 'Dr. Ramesh Kulkarni',
    facility_id: 'fac-phc-02',
    facility_name: 'Bhimashankar Primary Health Centre (PHC)',
    appointment_date: '2026-09-18',
    time_slot: '10:30 AM',
    token_number: 'ANC-04',
    appointment_type: 'ANC_CHECKUP',
    status: 'CONFIRMED',
    reason: 'Third Trimester ANC Routine Follow-up & Ultrasound Review',
    created_at: new Date('2026-09-12').toISOString()
  }],
  ['apt-02', {
    id: 'apt-02',
    patient_id: 'usr-pat-male-02',
    patient_name: 'Tukaram Maruti Patil',
    doctor_id: 'usr-doc-01',
    doctor_name: 'Dr. Ramesh Kulkarni',
    facility_id: 'fac-phc-01',
    facility_name: 'Khed Community Health Centre (CHC)',
    appointment_date: '2026-09-22',
    time_slot: '09:45 AM',
    token_number: 'OPD-18',
    appointment_type: 'CHRONIC_FOLLOWUP',
    status: 'CONFIRMED',
    reason: 'Monthly Essential Hypertension Review & Lipid Profile',
    created_at: new Date('2026-09-13').toISOString()
  }]
]);

const Appointment = {
  create: async (data) => {
    const id = data.id || `apt-${Date.now().toString(36)}`;
    const tokenNumber = data.tokenNumber || `T-${Math.floor(10 + Math.random() * 90)}`;

    if (db.getIsConnected()) {
      const query = `
        INSERT INTO appointments (
          id, patient_id, doctor_id, facility_id, appointment_date, time_slot, token_number, appointment_type, status, reason
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.patientId, data.doctorId || null, data.facilityId || null,
        data.appointmentDate, data.timeSlot, tokenNumber,
        data.appointmentType || 'IN_PERSON', data.status || 'CONFIRMED', data.reason || ''
      ]);
      return res.rows[0];
    }

    const apt = {
      id,
      patient_id: data.patientId,
      doctor_id: data.doctorId,
      facility_id: data.facilityId,
      appointment_date: data.appointmentDate,
      time_slot: data.timeSlot,
      token_number: tokenNumber,
      appointment_type: data.appointmentType || 'IN_PERSON',
      status: data.status || 'CONFIRMED',
      reason: data.reason || '',
      created_at: new Date().toISOString()
    };
    memoryAppointments.set(id, apt);
    return apt;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT a.*, p.full_name as patient_name, p.phone as patient_phone,
               d.full_name as doctor_name, f.name as facility_name
        FROM appointments a
        JOIN users p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        LEFT JOIN facilities f ON f.id = a.facility_id
        WHERE a.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    return memoryAppointments.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT a.*, d.full_name as doctor_name, f.name as facility_name
        FROM appointments a
        LEFT JOIN users d ON d.id = a.doctor_id
        LEFT JOIN facilities f ON f.id = a.facility_id
        WHERE a.patient_id = $1
        ORDER BY a.appointment_date DESC;
      `;
      const res = await db.query(query, [patientId]);
      return res.rows;
    }
    return Array.from(memoryAppointments.values())
      .filter(a => a.patient_id === patientId)
      .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
  },

  findByDoctorId: async (doctorId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT a.*, p.full_name as patient_name, p.phone as patient_phone, f.name as facility_name
        FROM appointments a
        JOIN users p ON p.id = a.patient_id
        LEFT JOIN facilities f ON f.id = a.facility_id
        WHERE a.doctor_id = $1
        ORDER BY a.appointment_date ASC;
      `;
      const res = await db.query(query, [doctorId]);
      return res.rows;
    }
    return Array.from(memoryAppointments.values())
      .filter(a => a.doctor_id === doctorId);
  },

  updateStatus: async (id, status) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;',
        [status, id]
      );
      return res.rows[0];
    }
    const apt = memoryAppointments.get(id);
    if (apt) {
      apt.status = status;
      return apt;
    }
    return null;
  },

  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT a.*, p.full_name as patient_name, d.full_name as doctor_name, f.name as facility_name
        FROM appointments a
        JOIN users p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        LEFT JOIN facilities f ON f.id = a.facility_id
        WHERE 1=1
      `;
      const params = [];
      if (filters.status) {
        params.push(filters.status);
        query += ` AND a.status = $${params.length}`;
      }
      if (filters.date) {
        params.push(filters.date);
        query += ` AND a.appointment_date = $${params.length}`;
      }
      query += ' ORDER BY a.appointment_date DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryAppointments.values());
    if (filters.status) list = list.filter(a => a.status === filters.status);
    if (filters.date) list = list.filter(a => a.appointment_date === filters.date);
    return list;
  }
};

module.exports = Appointment;
