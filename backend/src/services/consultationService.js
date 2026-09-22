const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const AppError = require('../utils/appError');

const consultationService = {
  createConsultation: async (data) => {
    return Consultation.create(data);
  },

  getConsultationById: async (id) => {
    const con = await Consultation.findById(id);
    if (!con) {
      throw new AppError('Consultation not found.', 404);
    }
    return con;
  },

  getConsultationsForUser: async (userId, userRole) => {
    if (userRole === 'DOCTOR') {
      return Consultation.findByDoctorId(userId);
    }
    return Consultation.findByPatientId(userId);
  },

  completeConsultation: async (id, doctorUserId, data) => {
    const completed = await Consultation.completeConsultation(id, data);
    if (!completed) {
      throw new AppError('Consultation not found to complete.', 404);
    }

    // If medicines are attached, also create digital prescription
    if (data.medicines && data.medicines.length > 0) {
      await Prescription.create({
        consultationId: id,
        patientId: completed.patient_id,
        doctorId: doctorUserId,
        diagnosis: data.diagnosis,
        medicines: data.medicines,
        advice: data.prescriptionNotes || ''
      });
    }

    return completed;
  },

  listAll: async (filters = {}) => {
    return Consultation.findAll(filters);
  }
};

module.exports = consultationService;
