const { error } = require('../utils/apiResponse');

/**
 * Helper to validate required fields
 */
function checkRequired(body, fields) {
  const missing = [];
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      missing.push(field);
    }
  }
  return missing;
}

/**
 * Validates Indian 10-digit mobile phone or ABHA
 */
function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).replace(/[\s\-\+]/g, '');
  // Allows 10 digit Indian number or +91 prefix
  return /^(91)?[6-9]\d{9}$/.test(cleaned) || cleaned.length === 10;
}

const validateLogin = (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone) {
    return error(res, 'Phone number or ABHA identifier is required', 400);
  }
  if (!password) {
    return error(res, 'Password is required', 400);
  }
  next();
};

const validateRegister = (req, res, next) => {
  const { fullName, phone, password, role } = req.body;
  const missing = checkRequired(req.body, ['fullName', 'phone', 'password']);
  if (missing.length > 0) {
    return error(res, `Missing required registration fields: ${missing.join(', ')}`, 400);
  }

  if (password.length < 6) {
    return error(res, 'Password must be at least 6 characters in length', 400);
  }

  if (!isValidPhone(phone)) {
    return error(res, 'Invalid 10-digit mobile phone number format', 400);
  }

  const requestedRole = (role || '').toString().trim().toUpperCase();
  if (requestedRole === 'ADMIN' || requestedRole === 'ADMINISTRATOR' || req.body.isAdmin === true) {
    return error(
      res,
      'Public registration as District Administrator is strictly forbidden. Admin accounts are provisioned internally by District Health Authorities.',
      403
    );
  }

  next();
};

const validateAppointment = (req, res, next) => {
  const missing = checkRequired(req.body, ['appointmentDate', 'timeSlot']);
  if (missing.length > 0) {
    return error(res, `Missing required appointment fields: ${missing.join(', ')}`, 400);
  }
  next();
};

const validateConsultation = (req, res, next) => {
  const patientId = req.user?.role === 'PATIENT' ? req.user.id : req.body.patientId;
  if (!patientId) {
    return error(res, 'Missing required consultation field: patientId', 400);
  }
  if (!req.body.chiefComplaint) {
    return error(res, 'Missing required consultation field: chiefComplaint', 400);
  }
  next();
};

const validatePrescription = (req, res, next) => {
  const missing = checkRequired(req.body, ['patientId', 'diagnosis']);
  if (missing.length > 0) {
    return error(res, `Missing required prescription fields: ${missing.join(', ')}`, 400);
  }

  const { medicines } = req.body;
  if (medicines && !Array.isArray(medicines)) {
    return error(res, 'Prescription medicines must be provided as an array of items', 400);
  }
  next();
};

const validateTriage = (req, res, next) => {
  const { vitals } = req.body;
  if (!vitals || typeof vitals !== 'object') {
    return error(res, 'Vitals object is required for digital triage evaluation', 400);
  }
  next();
};

const validateReferral = (req, res, next) => {
  const missing = checkRequired(req.body, ['patientId', 'reason']);
  if (missing.length > 0) {
    return error(res, `Missing required referral fields: ${missing.join(', ')}`, 400);
  }
  next();
};

const validateFollowUp = (req, res, next) => {
  const missing = checkRequired(req.body, ['patientId', 'title', 'dueDate']);
  if (missing.length > 0) {
    return error(res, `Missing required follow-up fields: ${missing.join(', ')}`, 400);
  }
  next();
};

const validatePhotoCase = (req, res, next) => {
  if (!req.body.patientId && req.body.patientName) {
    req.body.patientId = `usr-pat-${Date.now().toString(36)}`;
  }
  const missing = checkRequired(req.body, ['patientId', 'category', 'title', 'symptoms']);
  if (missing.length > 0) {
    return error(res, `Missing required photo case fields: ${missing.join(', ')}`, 400);
  }
  next();
};

const validateSyncBatch = (req, res, next) => {
  const { records } = req.body;
  if (!Array.isArray(records)) {
    return error(res, 'Invalid sync payload: "records" must be an array', 400);
  }
  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateAppointment,
  validateConsultation,
  validatePrescription,
  validateTriage,
  validateReferral,
  validateFollowUp,
  validatePhotoCase,
  validateSyncBatch
};
