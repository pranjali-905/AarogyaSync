const consultationService = require('../services/consultationService');
const { success } = require('../utils/apiResponse');

const createConsultation = async (req, res, next) => {
  try {
    const consultation = await consultationService.createConsultation({
      ...req.body,
      patientId: req.user.role === 'PATIENT' ? req.user.id : req.body.patientId
    });
    return success(res, consultation, 'Teleconsultation session created', 201);
  } catch (err) {
    next(err);
  }
};

const getMyConsultations = async (req, res, next) => {
  try {
    const consultations = await consultationService.getConsultationsForUser(req.user.id, req.user.role);
    return success(res, consultations, 'Consultations retrieved');
  } catch (err) {
    next(err);
  }
};

const getConsultationById = async (req, res, next) => {
  try {
    const con = await consultationService.getConsultationById(req.params.id);
    return success(res, con, 'Consultation session retrieved');
  } catch (err) {
    next(err);
  }
};

const completeConsultation = async (req, res, next) => {
  try {
    const completed = await consultationService.completeConsultation(req.params.id, req.user.id, req.body);
    return success(res, completed, 'Consultation finalized and clinical outcome saved');
  } catch (err) {
    next(err);
  }
};

const listConsultations = async (req, res, next) => {
  try {
    const list = await consultationService.listAll(req.query);
    return success(res, list, 'Consultation list retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createConsultation,
  getMyConsultations,
  getConsultationById,
  completeConsultation,
  listConsultations
};
