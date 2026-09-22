const adminService = require('../services/adminService');
const { success } = require('../utils/apiResponse');

const getOverview = async (req, res, next) => {
  try {
    const overview = await adminService.getOverview();
    return success(res, overview, 'District health system overview retrieved');
  } catch (err) {
    next(err);
  }
};

const getCitizens = async (req, res, next) => {
  try {
    const citizens = await adminService.getCitizens(req.query.search);
    return success(res, citizens, 'District citizen registry retrieved');
  } catch (err) {
    next(err);
  }
};

const getWorkforce = async (req, res, next) => {
  try {
    const workforce = await adminService.getWorkforce();
    return success(res, workforce, 'Healthcare workforce registry retrieved');
  } catch (err) {
    next(err);
  }
};

const updateWorkforceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await adminService.updateWorkforceStatus(id, status);
    return success(res, updated, `Workforce status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};

const getFacilities = async (req, res, next) => {
  try {
    const facilities = await adminService.getFacilities();
    return success(res, facilities, 'District healthcare facilities list retrieved');
  } catch (err) {
    next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.getAnalytics();
    return success(res, analytics, 'Public health analytics data retrieved');
  } catch (err) {
    next(err);
  }
};

const getSurveillance = async (req, res, next) => {
  try {
    const surveillance = await adminService.getSurveillance();
    return success(res, surveillance, 'Disease outbreak surveillance feed retrieved');
  } catch (err) {
    next(err);
  }
};

const getReferrals = async (req, res, next) => {
  try {
    const referrals = await adminService.getReferrals();
    return success(res, referrals, 'Inter-facility patient transfers retrieved');
  } catch (err) {
    next(err);
  }
};

const exportReports = async (req, res, next) => {
  try {
    const format = req.query.format || 'json';
    const report = await adminService.exportReports(format);
    return success(res, report, 'Health administration audit reports exported');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview,
  getCitizens,
  getWorkforce,
  updateWorkforceStatus,
  getFacilities,
  getAnalytics,
  getSurveillance,
  getReferrals,
  exportReports
};
