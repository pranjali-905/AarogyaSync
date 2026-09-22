const syncService = require('../services/syncService');
const { success } = require('../utils/apiResponse');

const processBatchSync = async (req, res, next) => {
  try {
    const { deviceId, records } = req.body;
    const userId = req.user ? req.user.id : (req.body.userId || 'anonymous');

    const result = await syncService.processBatch(deviceId, userId, records);
    return success(res, result, 'Batch sync process completed');
  } catch (err) {
    next(err);
  }
};

const getSyncStatus = async (req, res, next) => {
  try {
    const status = await syncService.getStatus();
    return success(res, status, 'Sync service is healthy and operational');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  processBatchSync,
  getSyncStatus
};
