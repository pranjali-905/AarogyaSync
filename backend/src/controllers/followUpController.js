const followUpService = require('../services/followUpService');
const { success } = require('../utils/apiResponse');

const createFollowUp = async (req, res, next) => {
  try {
    const fup = await followUpService.createFollowUp(req.user.id, req.body);
    return success(res, fup, 'Follow-up task created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getMyFollowUps = async (req, res, next) => {
  try {
    const list = await followUpService.getFollowUpsForUser(req.user.id, req.user.role);
    return success(res, list, 'Follow-up tasks retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getFollowUpById = async (req, res, next) => {
  try {
    const fup = await followUpService.getFollowUpById(req.params.id);
    return success(res, fup, 'Follow-up details retrieved');
  } catch (err) {
    next(err);
  }
};

const updateFollowUpStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await followUpService.updateStatus(req.params.id, status);
    return success(res, updated, `Follow-up status changed to ${status}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFollowUp,
  getMyFollowUps,
  getFollowUpById,
  updateFollowUpStatus
};
