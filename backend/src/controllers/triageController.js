const { calculateTriage } = require('../utils/triageCalculator');
const TriageResult = require('../models/TriageResult');
const { success } = require('../utils/apiResponse');

const assessTriage = async (req, res, next) => {
  try {
    const { vitals = {}, symptoms = [], context = {}, patientId, persist = false } = req.body;
    const triageResult = calculateTriage(vitals, symptoms, context);

    // If requested and patient is identified, record into persistent triage history
    if (persist && (patientId || req.user)) {
      const targetPatientId = patientId || req.user.id;
      const recordedBy = req.user ? req.user.id : null;

      const record = await TriageResult.create({
        patientId: targetPatientId,
        recordedBy,
        systolicBp: vitals.systolicBp || vitals.bp?.split('/')[0],
        diastolicBp: vitals.diastolicBp || vitals.bp?.split('/')[1],
        pulseRate: vitals.pulseRate || vitals.pulse,
        temperature: vitals.temperature || vitals.temp,
        spO2: vitals.spO2 || vitals.spo2,
        bloodGlucose: vitals.bloodGlucose || vitals.bloodSugar,
        symptoms,
        priority: triageResult.priority,
        redFlags: triageResult.redFlags,
        clinicalNotes: req.body.notes || ''
      });
      triageResult.savedRecordId = record.id;
    }

    return success(res, triageResult, 'Triage assessment calculated successfully');
  } catch (err) {
    next(err);
  }
};

const getTriageHistory = async (req, res, next) => {
  try {
    const patientId = req.params.patientId || req.user.id;
    const records = await TriageResult.findByPatientId(patientId);
    return success(res, records, 'Triage history retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  assessTriage,
  getTriageHistory
};
