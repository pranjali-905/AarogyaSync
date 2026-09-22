const Facility = require('../models/Facility');
const Medicine = require('../models/Medicine');
const DiagnosticTest = require('../models/DiagnosticTest');
const AppError = require('../utils/appError');

const facilityService = {
  getFacilities: async (filters = {}) => {
    return Facility.findAll(filters);
  },

  getFacilityById: async (id) => {
    const facility = await Facility.findById(id);
    if (!facility) {
      throw new AppError('Facility not found.', 404);
    }
    return facility;
  },

  getFacilityInventory: async (facilityId) => {
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      throw new AppError('Facility not found.', 404);
    }

    const medicines = await Medicine.findAvailability({ facilityId });
    const diagnostics = await DiagnosticTest.findAvailability({ facilityId });

    return {
      facility,
      medicines,
      diagnostics
    };
  }
};

module.exports = facilityService;
