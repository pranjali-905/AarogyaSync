const doctorService = require('../services/doctorService');
const { success } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const profile = await doctorService.getProfile(req.user.id);
    return success(res, profile, 'Doctor profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getQueue = async (req, res, next) => {
  try {
    const queue = await doctorService.getClinicalQueue(req.user.id);
    return success(res, queue, 'Doctor clinical queue retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getSchedule = async (req, res, next) => {
  try {
    const schedule = await doctorService.getSchedule(req.user.id);
    return success(res, schedule, 'Doctor daily schedule retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getTreatmentTracking = async (req, res, next) => {
  try {
    const tracking = await doctorService.getTreatmentTracking();
    return success(res, tracking, 'High-risk patient treatment tracking list retrieved');
  } catch (err) {
    next(err);
  }
};

const issuePrescription = async (req, res, next) => {
  try {
    const prescription = await doctorService.issuePrescription(req.user.id, req.body);
    return success(res, prescription, 'Digital e-Prescription issued successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getQueue,
  getSchedule,
  getTreatmentTracking,
  issuePrescription
};
