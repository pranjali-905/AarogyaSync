const photoCaseService = require('../services/photoCaseService');
const { success } = require('../utils/apiResponse');

const createCase = async (req, res, next) => {
  try {
    const pc = await photoCaseService.createCase(req.user.id, req.body);
    return success(res, pc, 'Store-and-forward photo case submitted for medical evaluation', 201);
  } catch (err) {
    next(err);
  }
};

const getMyCases = async (req, res, next) => {
  try {
    const cases = await photoCaseService.getCasesForUser(req.user.id, req.user.role);
    return success(res, cases, 'Photo cases retrieved');
  } catch (err) {
    next(err);
  }
};

const getCaseById = async (req, res, next) => {
  try {
    const pc = await photoCaseService.getCaseById(req.params.id);
    return success(res, pc, 'Photo case record retrieved');
  } catch (err) {
    next(err);
  }
};

const reviewCase = async (req, res, next) => {
  try {
    const reviewed = await photoCaseService.reviewCase(req.params.id, req.user.id, req.body);
    return success(res, reviewed, 'Doctor review and treatment recommendation recorded');
  } catch (err) {
    next(err);
  }
};

const listCases = async (req, res, next) => {
  try {
    const list = await photoCaseService.listAll(req.query);
    return success(res, list, 'Photo cases list retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCase,
  getMyCases,
  getCaseById,
  reviewCase,
  listCases
};
