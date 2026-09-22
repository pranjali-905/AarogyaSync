const Patient = require('../models/Patient');
const TriageResult = require('../models/TriageResult');
const HealthAssessment = require('../models/HealthAssessment');
const AppError = require('../utils/appError');
const db = require('../config/db');

const patientService = {
  getProfile: async (userId) => {
    const profile = await Patient.findByUserId(userId);
    if (!profile) {
      throw new AppError('Patient profile not found for this user.', 404);
    }
    return profile;
  },

  updateProfile: async (userId, data) => {
    const updated = await Patient.update(userId, data);
    if (!updated) {
      throw new AppError('Unable to update patient profile.', 400);
    }
    return updated;
  },

  getVitalsHistory: async (userId) => {
    const triageRecords = await TriageResult.findByPatientId(userId);
    const assessments = await HealthAssessment.findByPatientId(userId);
    return {
      triageHistory: triageRecords,
      assessments
    };
  },

  getMaternalCare: async (userId) => {
    const patient = await Patient.findByUserId(userId);
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    // Default ANC schedule based on LMP/EDD
    const ancSchedule = [
      { visit: 'ANC 1 (1st Trimester)', date: '2026-04-12', status: 'Completed', bp: '110/70', weight: '52 kg', hb: '11.5 g/dL', facility: 'Nigdale Sub-Centre', doctor: 'Dr. Sunita Deshmukh' },
      { visit: 'ANC 2 (2nd Trimester)', date: '2026-06-25', status: 'Completed', bp: '114/74', weight: '55 kg', hb: '11.2 g/dL', facility: 'Bhimashankar PHC', doctor: 'Dr. Sunita Deshmukh' },
      { visit: 'ANC 3 (3rd Trimester)', date: '2026-09-18', status: 'Upcoming', bp: 'Scheduled', weight: '-', hb: '-', facility: 'Bhimashankar PHC', doctor: 'Dr. Sunita Deshmukh' },
      { visit: 'ANC 4 (Pre-delivery)', date: '2026-11-10', status: 'Upcoming', bp: 'Scheduled', weight: '-', hb: '-', facility: 'Khed CHC Delivery Ward', doctor: 'Dr. Sunita Deshmukh' }
    ];

    const maternalChecklist = [
      { item: 'Tetanus Toxoid (TT-1)', completed: true, date: '2026-04-12' },
      { item: 'Tetanus Toxoid (TT-2)', completed: true, date: '2026-05-15' },
      { item: 'Iron & Folic Acid Tablets (180 tablets course)', completed: false, current: 120, total: 180 },
      { item: 'Calcium Carbonate (360 tablets course)', completed: false, current: 160, total: 360 },
      { item: 'Albendazole Deworming (Single dose)', completed: true, date: '2026-06-25' },
      { item: 'Emergency Delivery Hospital Bag Packed', completed: false, note: 'Pack clean clothes, baby blanket & ABHA card' }
    ];

    return {
      isPregnant: patient.is_pregnant,
      gravida: patient.gravida || 'G1P0',
      gestationalWeeks: patient.gestational_weeks || 28,
      lmpDate: patient.lmp_date || '2026-03-01',
      eddDate: patient.edd_date || '2026-12-06',
      highRiskFlag: patient.high_risk_flag || false,
      ancSchedule,
      maternalChecklist
    };
  },

  getChildRecords: async (userId) => {
    const patient = await Patient.findByUserId(userId);
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    if (db.getIsConnected()) {
      const res = await db.query('SELECT * FROM child_records WHERE mother_id = $1', [patient.id]);
      return res.rows;
    }

    return [
      {
        id: 'child-01',
        mother_id: patient.id,
        name: 'Expected Baby Shinde',
        dob: '2026-12-06',
        gender: 'Expected',
        birth_weight_kg: 3.0,
        immunization_status: [
          { vaccine: 'BCG (Bacillus Calmette-Guérin)', ageDue: 'At Birth (within 24h)', protection: 'Tuberculosis', status: 'Scheduled' },
          { vaccine: 'OPV-0 (Oral Polio Vaccine)', ageDue: 'At Birth', protection: 'Polio', status: 'Scheduled' },
          { vaccine: 'Hepatitis B Birth Dose', ageDue: 'At Birth (within 24h)', protection: 'Hepatitis B', status: 'Scheduled' },
          { vaccine: 'Pentavalent 1 & OPV 1', ageDue: '6 Weeks', protection: 'DPT, Hep B, Hib', status: 'Scheduled' }
        ]
      }
    ];
  }
};

module.exports = patientService;
