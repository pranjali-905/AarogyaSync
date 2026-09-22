const ashaService = require('../services/ashaService');
const { success } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const profile = await ashaService.getProfile(req.user.id);
    return success(res, profile, 'ASHA profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const patients = await ashaService.getAssignedPatients(req.user.id);
    return success(res, patients, 'Assigned village patients retrieved');
  } catch (err) {
    next(err);
  }
};

const registerPatient = async (req, res, next) => {
  try {
    const result = await ashaService.registerPatient(req.user.id, req.body);
    return success(res, result, 'New patient registered to ASHA registry successfully', 201);
  } catch (err) {
    next(err);
  }
};

const recordVisit = async (req, res, next) => {
  try {
    const result = await ashaService.recordVisit(req.user.id, req.body);
    return success(res, result, 'Frontline home visit and vitals logged successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getPriorityCases = async (req, res, next) => {
  try {
    const cases = await ashaService.getPriorityCases();
    return success(res, cases, 'High-priority triage cases retrieved');
  } catch (err) {
    next(err);
  }
};

const getPerformance = async (req, res, next) => {
  try {
    const stats = await ashaService.getPerformanceMetrics(req.user.id);
    return success(res, stats, 'ASHA worker monthly performance metrics retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getPatients,
  registerPatient,
  recordVisit,
  getPriorityCases,
  getPerformance
};
