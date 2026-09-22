const inventoryService = require('../services/inventoryService');
const { success } = require('../utils/apiResponse');

const getMedicines = async (req, res, next) => {
  try {
    const list = await inventoryService.getMedicines(req.query);
    return success(res, list, 'Medicines catalogue retrieved');
  } catch (err) {
    next(err);
  }
};

const getMedicineById = async (req, res, next) => {
  try {
    const med = await inventoryService.getMedicineById(req.params.id);
    return success(res, med, 'Medicine details retrieved');
  } catch (err) {
    next(err);
  }
};

const getMedicineAvailability = async (req, res, next) => {
  try {
    const list = await inventoryService.getMedicineAvailability(req.query);
    return success(res, list, 'Medicine availability across facilities retrieved');
  } catch (err) {
    next(err);
  }
};

const getDiagnostics = async (req, res, next) => {
  try {
    const list = await inventoryService.getDiagnosticTests(req.query);
    return success(res, list, 'Diagnostic tests catalogue retrieved');
  } catch (err) {
    next(err);
  }
};

const getDiagnosticById = async (req, res, next) => {
  try {
    const test = await inventoryService.getDiagnosticTestById(req.params.id);
    return success(res, test, 'Diagnostic test details retrieved');
  } catch (err) {
    next(err);
  }
};

const getDiagnosticAvailability = async (req, res, next) => {
  try {
    const list = await inventoryService.getDiagnosticAvailability(req.query);
    return success(res, list, 'Diagnostic test availability across facilities retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  getMedicineAvailability,
  getDiagnostics,
  getDiagnosticById,
  getDiagnosticAvailability
};
