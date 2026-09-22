const FollowUp = require('../models/FollowUp');
const AppError = require('../utils/appError');

const followUpService = {
  createFollowUp: async (createdByUserId, data) => {
    return FollowUp.create({
      ...data,
      createdBy: createdByUserId
    });
  },

  getFollowUpById: async (id) => {
    const fup = await FollowUp.findById(id);
    if (!fup) {
      throw new AppError('Follow-up task not found.', 404);
    }
    return fup;
  },

  getFollowUpsForUser: async (userId, userRole) => {
    if (userRole === 'PATIENT') {
      return FollowUp.findByPatientId(userId);
    }
    if (userRole === 'ASHA') {
      return FollowUp.findByAssignedTo(userId);
    }
    // Doctors/Admins can query all
    return FollowUp.findByAssignedTo(userId);
  },

  updateStatus: async (id, status) => {
    const updated = await FollowUp.updateStatus(id, status);
    if (!updated) {
      throw new AppError('Follow-up not found to update status.', 404);
    }
    return updated;
  }
};

module.exports = followUpService;
