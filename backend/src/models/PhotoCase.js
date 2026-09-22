const db = require('../config/db');

const memoryPhotoCases = new Map([
  ['pc-01', {
    id: 'pc-01',
    patient_id: 'usr-pat-male-02',
    patient_name: 'Tukaram Maruti Patil',
    submitted_by: 'usr-asha-01',
    submitted_by_name: 'Sunita Tai (ASHA)',
    reviewing_doctor_id: 'usr-doc-01',
    reviewing_doctor_name: 'Dr. Ramesh Kulkarni',
    category: 'DERMATOLOGY',
    title: 'Agricultural Contact Dermatitis on Forearm',
    symptoms: 'Erythematous pruritic papules on bilateral forearms following crop harvest. No blistering.',
    photo_urls: [],
    urgency: 'YELLOW',
    status: 'REVIEWED',
    doctor_notes: 'Contact allergic phytodermatitis. Normal vitals.',
    doctor_treatment_plan: 'Wash with cool boiled water. Apply Calamine lotion twice daily. Keep covered from direct sunlight.',
    reviewed_at: new Date('2026-09-14T14:30:00Z').toISOString(),
    created_at: new Date('2026-09-14T10:00:00Z').toISOString()
  }],
  ['sfc-01', {
    id: 'sfc-01',
    patient_id: 'usr-pat-male-02',
    patient_name: 'Ganesh Shinde',
    age: 35,
    village: 'Nigdale',
    submitted_by: 'usr-asha-01',
    submitted_by_name: 'Sunita Tai (ASHA)',
    reviewing_doctor_id: 'usr-doc-01',
    reviewing_doctor_name: 'Dr. Ramesh Kulkarni',
    category: 'EYE_INJURY',
    title: 'Pesticide Spray Chemical Eye Irritation & Corneal Erythema',
    symptoms: 'Right eye acute conjunctival redness, tearing, photophobia after spraying organophosphate without protective goggles.',
    photo_urls: [],
    urgency: 'RED',
    status: 'PENDING_REVIEW',
    doctor_notes: 'Copious saline wash confirmed. Administered Moxifloxacin 0.5% eye drops stat. Dispatched to Ophthalmology.',
    doctor_treatment_plan: 'Irrigate with 500ml normal saline. Moxifloxacin eye drops QID x 5 days. Urgent slit lamp eval.',
    created_at: new Date('2026-09-16T10:35:00Z').toISOString()
  }],
  ['sfc-02', {
    id: 'sfc-02',
    patient_id: 'usr-pat-child-01',
    patient_name: 'Baby of Kavita (Aarav)',
    age: 1,
    village: 'Bhimashankar',
    submitted_by: 'usr-asha-01',
    submitted_by_name: 'Sunita Tai (ASHA)',
    reviewing_doctor_id: 'usr-doc-01',
    reviewing_doctor_name: 'Dr. Ramesh Kulkarni',
    category: 'DERMATOLOGY',
    title: 'Neonatal Heat Rash & Prickly Miliaria Papules',
    symptoms: 'Mild erythematous pinpoint papular eruption across neck creases and anterior chest. Infant afebrile at submission, feeds normally.',
    photo_urls: [],
    urgency: 'YELLOW',
    status: 'REVIEWED',
    doctor_notes: 'Advised loose breathable cotton wear. Apply calamine lotion twice daily. Keep area dry. Review if pustules emerge.',
    doctor_treatment_plan: 'Keep infant skin dry and cool. Apply 10% Calamine suspension BID. Follow-up in 48 hours.',
    reviewed_at: new Date('2026-09-15T16:15:00Z').toISOString(),
    created_at: new Date('2026-09-15T16:15:00Z').toISOString()
  }],
  ['sfc-03', {
    id: 'sfc-03',
    patient_id: 'usr-pat-female-01',
    patient_name: 'Sharda Bai Jadhav',
    age: 55,
    village: 'Ambegaon',
    submitted_by: 'usr-asha-02',
    submitted_by_name: 'Pooja Tai (ASHA)',
    reviewing_doctor_id: 'usr-doc-01',
    reviewing_doctor_name: 'Dr. Ramesh Kulkarni',
    category: 'WOUND_ULCER',
    title: 'Diabetic Plantar Skin Fissure & Callus Formation',
    symptoms: 'Heel skin cracking with localized erythema. No purulent exudate or foul odor. Monofilament test reduced.',
    photo_urls: [],
    urgency: 'YELLOW',
    status: 'PENDING_REVIEW',
    doctor_notes: 'Recommend 10% Urea cream application, customized cushioned micro-cellular rubber footwear. Maintain strict glycemic control.',
    doctor_treatment_plan: 'Clean with saline. Apply 10% urea cream. Daily inspection by ASHA. Diabetic footwear prescribed.',
    created_at: new Date('2026-09-15T14:30:00Z').toISOString()
  }]
]);

const PhotoCase = {
  create: async (data) => {
    const id = data.id || `pc-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO photo_cases (
          id, patient_id, submitted_by, reviewing_doctor_id, category,
          title, symptoms, photo_urls, urgency, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.patientId, data.submittedBy || null, data.reviewingDoctorId || null,
        data.category || 'DERMATOLOGY', data.title, data.symptoms,
        data.photoUrls || [], data.urgency || 'YELLOW', data.status || 'PENDING_REVIEW'
      ]);
      return res.rows[0];
    }

    const pc = {
      id,
      patient_id: data.patientId || 'usr-pat-male-02',
      patient_name: data.patientName || 'Clinical Patient',
      age: data.age || 32,
      village: data.village || 'Nigdale',
      submitted_by: data.submittedBy,
      submitted_by_name: data.submittedByName || 'Sunita Tai (ASHA)',
      asha_name: data.submittedByName || 'Sunita Tai',
      reviewing_doctor_id: data.reviewingDoctorId || 'usr-doc-01',
      category: data.category || 'DERMATOLOGY',
      title: data.title,
      symptoms: data.symptoms,
      photo_urls: data.photoUrls || (data.photoUrl ? [data.photoUrl] : []),
      urgency: data.urgency || 'YELLOW',
      status: data.status || 'PENDING_REVIEW',
      doctor_notes: null,
      doctor_treatment_plan: null,
      created_at: new Date().toISOString()
    };
    memoryPhotoCases.set(id, pc);
    return pc;
  },

  findById: async (id) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT pc.*, p.full_name as patient_name, p.phone as patient_phone,
               a.full_name as submitted_by_name, d.full_name as reviewing_doctor_name
        FROM photo_cases pc
        JOIN users p ON p.id = pc.patient_id
        LEFT JOIN users a ON a.id = pc.submitted_by
        LEFT JOIN users d ON d.id = pc.reviewing_doctor_id
        WHERE pc.id = $1;
      `;
      const res = await db.query(query, [id]);
      return res.rows[0] || null;
    }
    return memoryPhotoCases.get(id) || null;
  },

  findByPatientId: async (patientId) => {
    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM photo_cases WHERE patient_id = $1 ORDER BY created_at DESC', [patientId]);
      return res.rows;
    }
    return Array.from(memoryPhotoCases.values()).filter(pc => pc.patient_id === patientId);
  },

  findByDoctorId: async (doctorId) => {
    if (db.getIsConnected()) {
      const query = `
        SELECT pc.*, p.full_name as patient_name, a.full_name as asha_name
        FROM photo_cases pc
        JOIN users p ON p.id = pc.patient_id
        LEFT JOIN users a ON a.id = pc.submitted_by
        WHERE pc.reviewing_doctor_id = $1 OR pc.status = 'PENDING_REVIEW'
        ORDER BY CASE WHEN pc.urgency = 'RED' THEN 1 WHEN pc.urgency = 'YELLOW' THEN 2 ELSE 3 END, pc.created_at DESC;
      `;
      const res = await db.query(query, [doctorId]);
      return res.rows;
    }
    return Array.from(memoryPhotoCases.values()).filter(pc => pc.reviewing_doctor_id === doctorId || pc.status === 'PENDING_REVIEW' || pc.status === 'REVIEWED');
  },

  reviewCase: async (id, data) => {
    if (db.getIsConnected()) {
      const query = `
        UPDATE photo_cases SET
          status = 'REVIEWED',
          doctor_notes = $1,
          doctor_treatment_plan = $2,
          reviewed_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *;
      `;
      const res = await db.query(query, [data.doctorNotes, data.doctorTreatmentPlan, id]);
      return res.rows[0];
    }
    const pc = memoryPhotoCases.get(id);
    if (pc) {
      pc.status = 'REVIEWED';
      pc.doctor_notes = data.doctorNotes;
      pc.doctor_treatment_plan = data.doctorTreatmentPlan;
      pc.reviewed_at = new Date().toISOString();
      return pc;
    }
    return null;
  },

  findAll: async (filters = {}) => {
    if (db.getIsConnected()) {
      let query = `
        SELECT pc.*, p.full_name as patient_name
        FROM photo_cases pc
        JOIN users p ON p.id = pc.patient_id
        WHERE 1=1
      `;
      const params = [];
      if (filters.status) {
        params.push(filters.status);
        query += ` AND pc.status = $${params.length}`;
      }
      if (filters.category) {
        params.push(filters.category);
        query += ` AND pc.category = $${params.length}`;
      }
      query += ' ORDER BY pc.created_at DESC';
      const res = await db.query(query, params);
      return res.rows;
    }
    let list = Array.from(memoryPhotoCases.values());
    if (filters.status) list = list.filter(pc => pc.status === filters.status);
    if (filters.category) list = list.filter(pc => pc.category === filters.category);
    return list;
  }
};

module.exports = PhotoCase;
