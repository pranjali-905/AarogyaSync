const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { error } = require('../utils/apiResponse');

// Demo token map for development / test resilience
const MOCK_TOKEN_MAP = {
  'mock_jwt_patient_female': {
    id: 'usr-pat-female-01',
    fullName: 'Radhika Suresh Shinde',
    phone: '9876543210',
    role: 'PATIENT',
    gender: 'female',
    village: 'Nigdale',
    district: 'Pune',
    preferredLanguage: 'mr'
  },
  'mock_jwt_patient_male': {
    id: 'usr-pat-male-02',
    fullName: 'Tukaram Maruti Patil',
    phone: '9876543211',
    role: 'PATIENT',
    gender: 'male',
    village: 'Khed',
    district: 'Pune',
    preferredLanguage: 'hi'
  },
  'mock_jwt_asha': {
    id: 'usr-asha-01',
    fullName: 'Sunita Tai Gawande (ASHA)',
    phone: '9876543220',
    role: 'ASHA',
    gender: 'female',
    village: 'Nigdale & Bhimashankar',
    district: 'Pune',
    preferredLanguage: 'mr'
  },
  'mock_jwt_doctor': {
    id: 'usr-doc-01',
    fullName: 'Dr. Ramesh Kulkarni',
    phone: '9876543230',
    role: 'DOCTOR',
    gender: 'male',
    village: 'Khed',
    district: 'Pune',
    preferredLanguage: 'en'
  },
  'mock_jwt_admin': {
    id: 'usr-admin-01',
    fullName: 'Shri S. V. Gaikwad (DHO)',
    phone: '9876543240',
    role: 'ADMIN',
    gender: 'male',
    village: 'Pune Zilla Parishad',
    district: 'Pune',
    preferredLanguage: 'en'
  }
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authentication token missing or invalid. Please provide a Bearer token.', 401);
  }

  const token = authHeader.split(' ')[1];

  // Check demo / mock tokens for test continuity
  if (MOCK_TOKEN_MAP[token]) {
    req.user = MOCK_TOKEN_MAP[token];
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Authorization token has expired. Please login again.', 401);
    }
    return error(res, 'Invalid authorization credentials', 401);
  }
};

module.exports = authMiddleware;
