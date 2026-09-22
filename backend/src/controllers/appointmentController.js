const appointmentService = require('../services/appointmentService');
const { success } = require('../utils/apiResponse');

const createAppointment = async (req, res, next) => {
  try {
    const apt = await appointmentService.createAppointment(req.user.id, req.user.role, req.body);
    return success(res, apt, 'Appointment successfully booked', 201);
  } catch (err) {
    next(err);
  }
};

const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointmentsForUser(req.user.id, req.user.role);
    return success(res, appointments, 'Appointments retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const apt = await appointmentService.getAppointmentById(req.params.id);
    return success(res, apt, 'Appointment details retrieved');
  } catch (err) {
    next(err);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await appointmentService.updateStatus(req.params.id, status);
    return success(res, updated, `Appointment status changed to ${status}`);
  } catch (err) {
    next(err);
  }
};

const listAppointments = async (req, res, next) => {
  try {
    const list = await appointmentService.listAll(req.query);
    return success(res, list, 'Appointments list retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  listAppointments
};
