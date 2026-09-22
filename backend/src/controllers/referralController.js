const referralService = require('../services/referralService');
const { success } = require('../utils/apiResponse');

const createReferral = async (req, res, next) => {
  try {
    const referral = await referralService.createReferral(req.user.id, req.body);
    return success(res, referral, 'Inter-facility patient referral created', 201);
  } catch (err) {
    next(err);
  }
};

const getMyReferrals = async (req, res, next) => {
  try {
    const referrals = await referralService.getReferralsForUser(req.user.id, req.user.role);
    return success(res, referrals, 'Referrals retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getReferralById = async (req, res, next) => {
  try {
    const ref = await referralService.getReferralById(req.params.id);
    return success(res, ref, 'Referral details retrieved');
  } catch (err) {
    next(err);
  }
};

const updateReferralStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await referralService.updateStatus(req.params.id, status);
    return success(res, updated, `Referral status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};

const listAllReferrals = async (req, res, next) => {
  try {
    const list = await referralService.listAll(req.query);
    return success(res, list, 'Referral transfer records retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReferral,
  getMyReferrals,
  getReferralById,
  updateReferralStatus,
  listAllReferrals
};
