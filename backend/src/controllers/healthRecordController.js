const healthRecordService = require('../services/healthRecordService');
const { success } = require('../utils/apiResponse');

const createRecord = async (req, res, next) => {
  try {
    const patientId = req.user.role === 'PATIENT' ? req.user.id : (req.body.patientId || req.user.id);
    const record = await healthRecordService.createRecord(patientId, req.body);
    return success(res, record, 'Document saved to Digital Backpack', 201);
  } catch (err) {
    next(err);
  }
};

const getMyRecords = async (req, res, next) => {
  try {
    const records = await healthRecordService.getRecordsForPatient(req.user.id, req.query.type);
    return success(res, records, 'Digital Backpack documents retrieved');
  } catch (err) {
    next(err);
  }
};

const getRecordsByPatientId = async (req, res, next) => {
  try {
    const records = await healthRecordService.getRecordsForPatient(req.params.patientId, req.query.type);
    return success(res, records, 'Patient health records retrieved');
  } catch (err) {
    next(err);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await healthRecordService.getRecordById(req.params.id);
    return success(res, record, 'Document details retrieved');
  } catch (err) {
    next(err);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    await healthRecordService.deleteRecord(req.params.id, req.user.id);
    return success(res, null, 'Document removed from Digital Backpack');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRecord,
  getMyRecords,
  getRecordsByPatientId,
  getRecordById,
  deleteRecord
};
