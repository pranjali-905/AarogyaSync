const Doctor = require('../models/Doctor');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const TriageResult = require('../models/TriageResult');
const Patient = require('../models/Patient');
const AppError = require('../utils/appError');

const doctorService = {
  getProfile: async (userId) => {
    const profile = await Doctor.findByUserId(userId);
    if (!profile) {
      throw new AppError('Doctor profile not found.', 404);
    }
    return profile;
  },

  getClinicalQueue: async (doctorUserId) => {
    const consultations = await Consultation.findByDoctorId(doctorUserId);
    const priorityTriage = await TriageResult.findPriorityCases();

    return {
      scheduledConsultations: consultations,
      emergencyTriageQueue: priorityTriage
    };
  },

  getSchedule: async (doctorUserId) => {
    return [
      { id: 'sch-01', time: '08:30 AM - 10:30 AM', title: 'Emergency Triage & Red Case Tele-Consults', type: 'EMERGENCY', location: 'Telemedicine Console', attendees: '3 urgent cases queued' },
      { id: 'sch-02', time: '10:30 AM - 01:30 PM', title: 'Khed CHC Physical OPD Clinic & Minor Procedures', type: 'OPD_CLINIC', location: 'OPD Room #4, Khed CHC', attendees: '28 registered patients' },
      { id: 'sch-03', time: '02:00 PM - 03:30 PM', title: 'Frontline ASHA Doorstep Teleconsultation Link', type: 'TELEMEDICINE', location: 'Remote Video/Audio Link', attendees: 'Sunita Tai (Nigdale Hamlet)' },
      { id: 'sch-04', time: '03:30 PM - 04:30 PM', title: 'Store-and-Forward Photo Review & Digital e-Rx Signing', type: 'REVIEW', location: 'Clinical Console', attendees: '4 photo cases awaiting review' },
      { id: 'sch-05', time: '04:30 PM - 05:30 PM', title: 'High-Risk Maternal (ANC) & Chronic Care Board', type: 'CASE_CONFERENCE', location: 'Maternal Health Committee', attendees: 'Block Medical Officer & CHO' }
    ];
  },

  getTreatmentTracking: async () => {
    return [
      {
        patientId: 'usr-pat-female-01',
        patientName: 'Radhika Suresh Shinde',
        condition: 'Maternal ANC 3rd Trimester Care',
        riskTier: 'LOW_GREEN',
        adherenceRate: '96%',
        lastVitalsRecorded: 'BP 114/74 mmHg, FHR 142 bpm',
        targetParameters: 'BP < 130/80 mmHg, Hb > 11.0 g/dL',
        status: 'Stable Antenatal Progress',
        assignedAsha: 'Sunita Tai (ASHA Sangini)'
      },
      {
        patientId: 'usr-pat-male-02',
        patientName: 'Tukaram Maruti Patil',
        condition: 'Essential Hypertension & Impaired Fasting Glucose',
        riskTier: 'MODERATE_YELLOW',
        adherenceRate: '88%',
        lastVitalsRecorded: 'BP 138/88 mmHg, Blood Sugar 112 mg/dL',
        targetParameters: 'BP < 130/80 mmHg, Fasting Glucose < 110 mg/dL',
        status: 'Medication Switched to Telmisartan 40mg',
        assignedAsha: 'Sunita Tai (ASHA Sangini)'
      }
    ];
  },

  issuePrescription: async (doctorUserId, data) => {
    const rx = await Prescription.create({
      ...data,
      doctorId: doctorUserId
    });
    return rx;
  }
};

module.exports = doctorService;
