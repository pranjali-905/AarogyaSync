const patientService = require('../services/patientService');
const { success } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.user.id;
    const profile = await patientService.getProfile(targetUserId);
    return success(res, profile, 'Patient profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.user.id;
    const updated = await patientService.updateProfile(targetUserId, req.body);
    return success(res, updated, 'Patient profile updated successfully');
  } catch (err) {
    next(err);
  }
};

const getVitals = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.user.id;
    const vitals = await patientService.getVitalsHistory(targetUserId);
    return success(res, vitals, 'Vitals history retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getMaternalCare = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.user.id;
    const maternal = await patientService.getMaternalCare(targetUserId);
    return success(res, maternal, 'Maternal care checklist & visits retrieved');
  } catch (err) {
    next(err);
  }
};

const getChildRecords = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.user.id;
    const children = await patientService.getChildRecords(targetUserId);
    return success(res, children, 'Child immunization records retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getVitals,
  getMaternalCare,
  getChildRecords
};
