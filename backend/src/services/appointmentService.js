const Appointment = require('../models/Appointment');
const AppError = require('../utils/appError');

const appointmentService = {
  createAppointment: async (userId, userRole, data) => {
    // If patient, ensure patientId is the user
    const patientId = userRole === 'PATIENT' ? userId : (data.patientId || userId);
    const appointment = await Appointment.create({
      ...data,
      patientId
    });
    return appointment;
  },

  getAppointmentById: async (id) => {
    const apt = await Appointment.findById(id);
    if (!apt) {
      throw new AppError('Appointment not found.', 404);
    }
    return apt;
  },

  getAppointmentsForUser: async (userId, userRole) => {
    if (userRole === 'DOCTOR') {
      return Appointment.findByDoctorId(userId);
    }
    return Appointment.findByPatientId(userId);
  },

  updateStatus: async (id, status) => {
    const updated = await Appointment.updateStatus(id, status);
    if (!updated) {
      throw new AppError('Appointment not found to update status.', 404);
    }
    return updated;
  },

  listAll: async (filters = {}) => {
    return Appointment.findAll(filters);
  }
};

module.exports = appointmentService;
