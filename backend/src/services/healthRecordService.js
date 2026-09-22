const HealthRecord = require('../models/HealthRecord');
const AppError = require('../utils/appError');

const healthRecordService = {
  createRecord: async (patientId, data) => {
    return HealthRecord.create({
      ...data,
      patientId
    });
  },

  getRecordById: async (id) => {
    const record = await HealthRecord.findById(id);
    if (!record) {
      throw new AppError('Health record document not found.', 404);
    }
    return record;
  },

  getRecordsForPatient: async (patientId, docType = null) => {
    return HealthRecord.findByPatientId(patientId, docType);
  },

  deleteRecord: async (id, patientId) => {
    const deleted = await HealthRecord.delete(id, patientId);
    if (!deleted) {
      throw new AppError('Health record not found or permission denied.', 404);
    }
    return true;
  }
};

module.exports = healthRecordService;
