const ASHAWorker = require('../models/ASHAWorker');
const Patient = require('../models/Patient');
const User = require('../models/User');
const TriageResult = require('../models/TriageResult');
const HealthAssessment = require('../models/HealthAssessment');
const FollowUp = require('../models/FollowUp');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

const ashaService = {
  getProfile: async (userId) => {
    const profile = await ASHAWorker.findByUserId(userId);
    if (!profile) {
      throw new AppError('ASHA Worker profile not found.', 404);
    }
    return profile;
  },

  getAssignedPatients: async (ashaUserId) => {
    const patients = await Patient.findAll({ assignedAshaId: ashaUserId });
    return patients;
  },

  registerPatient: async (ashaUserId, data) => {
    const { fullName, phone, gender = 'female', age, village = 'Nigdale', isPregnant = false, abhaId } = data;

    const existingUser = await User.findByPhone(phone);
    if (existingUser) {
      throw new AppError('Patient is already registered with this phone number.', 409);
    }

    const defaultPasswordHash = await bcrypt.hash('demo123', 8);
    const user = await User.create({
      fullName,
      phone,
      passwordHash: defaultPasswordHash,
      role: 'PATIENT',
      gender,
      village,
      district: 'Pune'
    });

    const patient = await Patient.create({
      userId: user.id,
      abhaId: abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      age: age ? parseInt(age, 10) : null,
      isPregnant: Boolean(isPregnant),
      assignedAshaId: ashaUserId
    });

    return { user, patient };
  },

  recordVisit: async (ashaUserId, data) => {
    const { patientId, vitals = {}, symptoms = [], notes, priority = 'GREEN' } = data;

    const triage = await TriageResult.create({
      patientId,
      recordedBy: ashaUserId,
      systolicBp: vitals.systolicBp,
      diastolicBp: vitals.diastolicBp,
      pulseRate: vitals.pulseRate,
      temperature: vitals.temperature,
      spO2: vitals.spO2,
      bloodGlucose: vitals.bloodGlucose,
      symptoms,
      priority,
      clinicalNotes: notes,
      recordedOffline: Boolean(data.recordedOffline)
    });

    // Also create health assessment record
    await HealthAssessment.create({
      patientId,
      assessorId: ashaUserId,
      assessmentType: data.assessmentType || 'GENERAL',
      vitals,
      findings: { notes },
      riskTier: priority === 'RED' ? 'CRITICAL' : priority === 'YELLOW' ? 'MODERATE' : 'LOW',
      recommendations: data.recommendations || ''
    });

    return triage;
  },

  getPriorityCases: async () => {
    return TriageResult.findPriorityCases();
  },

  getPerformanceMetrics: async (ashaUserId) => {
    const patients = await Patient.findAll({ assignedAshaId: ashaUserId });
    const followUps = await FollowUp.findByAssignedTo(ashaUserId);
    const completedFollowups = followUps.filter(f => f.status === 'COMPLETED').length;

    return {
      householdsCovered: 164,
      totalRegisteredCitizens: patients.length || 48,
      activeMaternalCases: patients.filter(p => p.is_pregnant).length || 8,
      immunizationsDueThisWeek: 4,
      pendingFollowups: followUps.filter(f => f.status === 'PENDING').length,
      completedFollowupsRate: followUps.length ? `${Math.round((completedFollowups / followUps.length) * 100)}%` : '94%',
      incentivesEarnedINR: 4200
    };
  }
};

module.exports = ashaService;
