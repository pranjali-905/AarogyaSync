const PhotoCase = require('../models/PhotoCase');
const AppError = require('../utils/appError');

const photoCaseService = {
  createCase: async (submittedByUserId, data) => {
    return PhotoCase.create({
      ...data,
      submittedBy: submittedByUserId
    });
  },

  getCaseById: async (id) => {
    const pc = await PhotoCase.findById(id);
    if (!pc) {
      throw new AppError('Photo case record not found.', 404);
    }
    return pc;
  },

  getCasesForUser: async (userId, userRole) => {
    if (userRole === 'DOCTOR') {
      return PhotoCase.findByDoctorId(userId);
    }
    if (userRole === 'PATIENT') {
      return PhotoCase.findByPatientId(userId);
    }
    return PhotoCase.findAll();
  },

  reviewCase: async (id, reviewingDoctorId, data) => {
    const updated = await PhotoCase.reviewCase(id, data);
    if (!updated) {
      throw new AppError('Photo case not found to submit review.', 404);
    }
    return updated;
  },

  listAll: async (filters = {}) => {
    return PhotoCase.findAll(filters);
  }
};

module.exports = photoCaseService;
