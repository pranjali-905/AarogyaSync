const Medicine = require('../models/Medicine');
const DiagnosticTest = require('../models/DiagnosticTest');
const AppError = require('../utils/appError');

const inventoryService = {
  getMedicines: async (filters = {}) => {
    return Medicine.findAll(filters);
  },

  getMedicineById: async (id) => {
    const med = await Medicine.findById(id);
    if (!med) {
      throw new AppError('Medicine not found in catalogue.', 404);
    }
    return med;
  },

  getMedicineAvailability: async (filters = {}) => {
    return Medicine.findAvailability(filters);
  },

  getDiagnosticTests: async (filters = {}) => {
    return DiagnosticTest.findAll(filters);
  },

  getDiagnosticTestById: async (id) => {
    const test = await DiagnosticTest.findById(id);
    if (!test) {
      throw new AppError('Diagnostic test not found in catalogue.', 404);
    }
    return test;
  },

  getDiagnosticAvailability: async (filters = {}) => {
    return DiagnosticTest.findAvailability(filters);
  }
};

module.exports = inventoryService;
