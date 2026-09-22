const db = require('../config/db');

const memoryFollowUps = new Map([
  ['fup-01', {
    id: 'fup-01',
    patient_id: 'usr-pat-female-01',
    patient_name: 'Radhika Suresh Shinde',
    created_by: 'usr-doc-01',
    created_by_name: 'Dr. Ramesh Kulkarni',
    assigned_to: 'usr-asha-01',
    assigned_to_name: 'Sunita Tai (ASHA)',
    title: 'ASHA Home Nutrition & IFA Verification',
    notes: 'Verify 30-day Iron & Folic Acid intake. Check for pedal edema.',
    due_date: new Date('2026-09-17T10:00:00Z').toISOString(),
    priority: 'GREEN',
    status: 'PENDING',
    created_at: new Date('2026-09-12').toISOString()
  }],
  ['fup-02', {
    id: 'fup-02',
    patient_id: 'usr-pat-male-02',
    patient_name: 'Tukaram Maruti Patil',
    created_by: 'usr-doc-01',
    created_by_name: 'Dr. Ramesh Kulkarni',
    assigned_to: 'usr-asha-01',
    assigned_to_name: 'Sunita Tai (ASHA)',
    title: 'Fasting Blood Sugar & BP Re-test',
    notes: 'Maintain 10 hours overnight fasting prior to morning sample check.',
    due_date: new Date('2026-09-20T08:30:00Z').toISOString(),
    priority: 'YELLOW',
    status: 'PENDING',
    created_at: new Date('2026-09-13').toISOString()
  }]
]);

const FollowUp = {
  create: async (data) => {
    const id = data.id || `fup-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO follow_ups (
          id, patient_id, created_by, assigned_to, title, notes, due_date, priority, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.patientId, data.createdBy || null, data.assignedTo || null,
        data.title, data.notes || '', new Date(data.dueDate),
        data.priority || 'YELLOW', data.status || 'PENDING'
      ]);
      return res.rows[0];
    }

    const fup = {
      id,
      patient_id: data.patientId,
      created_by: data.createdBy,
      assigned_to: data.assignedTo,
      title: data.title,
      notes: data.notes || '',
      due_date: data.dueDate,
      priority: data.priority || 'YELLOW',
      status: data.status || 'PENDING',
      created_at: new Date().toISOString()
    };
    memoryFollowUps.set(id, fup);
    return fup;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT f.*, p.full_name as patient_name, p.phone as patient_phone,
               c.full_name as created_by_name, a.full_name as assigned_to_name
        FROM follow_ups f
        JOIN users p ON p.id = f.patient_id
        LEFT JOIN users c ON c.id = f.created_by
        LEFT JOIN users a ON a.id = f.assigned_to
        WHERE f.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    return memoryFollowUps.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT f.*, a.full_name as assigned_to_name
        FROM follow_ups f
        LEFT JOIN users a ON a.id = f.assigned_to
        WHERE f.patient_id = $1
        ORDER BY f.due_date ASC;
      `;
      const res = await db.query(query, [patientId]);
      return res.rows;
    }
    return Array.from(memoryFollowUps.values()).filter(f => f.patient_id === patientId);
  },

  findByAssignedTo: async (userId, status = null) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT f.*, p.full_name as patient_name, p.phone as patient_phone, p.village
        FROM follow_ups f
        JOIN users p ON p.id = f.patient_id
        WHERE f.assigned_to = $1
      `;
      const params = [userId];
      if (status) {
        params.push(status);
        query += ` AND f.status = $${params.length}`;
      }
      query += ' ORDER BY f.due_date ASC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryFollowUps.values()).filter(f => f.assigned_to === userId);
    if (status) list = list.filter(f => f.status === status);
    return list;
  },

  updateStatus: async (id, status) => {
    if (db.getIsConnected()) {
      const isCompleted = status === 'COMPLETED';
      const query = `
        UPDATE follow_ups SET
          status = $1,
          completed_at = ${isCompleted ? 'CURRENT_TIMESTAMP' : 'NULL'}
        WHERE id = $2
        RETURNING *;
      `;
      const res = await db.query(query, [status, id]);
      return res.rows[0];
    }
    const f = memoryFollowUps.get(id);
    if (f) {
      f.status = status;
      if (status === 'COMPLETED') f.completed_at = new Date().toISOString();
      return f;
    }
    return null;
  }
};

module.exports = FollowUp;
