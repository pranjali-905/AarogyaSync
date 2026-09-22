const Referral = require('../models/Referral');
const AppError = require('../utils/appError');

const referralService = {
  createReferral: async (referringUserId, data) => {
    return Referral.create({
      ...data,
      referringUserId
    });
  },

  getReferralById: async (id) => {
    const ref = await Referral.findById(id);
    if (!ref) {
      throw new AppError('Referral record not found.', 404);
    }
    return ref;
  },

  getReferralsForUser: async (userId, userRole) => {
    if (userRole === 'PATIENT') {
      return Referral.findByPatientId(userId);
    }
    return Referral.findAll();
  },

  updateStatus: async (id, status) => {
    const updated = await Referral.updateStatus(id, status);
    if (!updated) {
      throw new AppError('Referral not found to update status.', 404);
    }
    return updated;
  },

  listAll: async (filters = {}) => {
    return Referral.findAll(filters);
  }
};

module.exports = referralService;
