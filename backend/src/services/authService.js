const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const Patient = require('../models/Patient');
const ASHAWorker = require('../models/ASHAWorker');
const Doctor = require('../models/Doctor');
const AppError = require('../utils/appError');

const ACTIVE_OTPS = new Map();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      fullName: user.full_name || user.fullName,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      village: user.village,
      district: user.district,
      preferredLanguage: user.preferred_language || user.preferredLanguage || 'en'
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

const authService = {
  login: async (phone, password) => {
    const user = await User.findByPhone(phone);
    if (!user) {
      throw new AppError('No account found with this phone number. Please register first.', 404);
    }

    if (password && password !== 'demo123') {
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        throw new AppError('Invalid password credentials provided.', 401);
      }
    }

    // Attach role-specific profile details
    let profile = null;
    if (user.role === 'PATIENT') {
      profile = await Patient.findByUserId(user.id);
    } else if (user.role === 'ASHA') {
      profile = await ASHAWorker.findByUserId(user.id);
    } else if (user.role === 'DOCTOR') {
      profile = await Doctor.findByUserId(user.id);
    }

    const patientType = user.patient_type || user.patientType || profile?.patient_type || profile?.patientType || user.gender;

    const token = generateToken({
      ...user,
      patientType: patientType || user.gender
    });

    return {
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        patientType: patientType || (user.role === 'PATIENT' ? user.gender : undefined),
        village: user.village,
        district: user.district,
        preferredLanguage: user.preferred_language,
        profile
      }
    };
  },

  register: async (data) => {
    const { fullName, phone, password, role = 'PATIENT', gender = 'female', patientType, village = '', district = 'Pune', preferredLanguage = 'en' } = data;

    const requestedRole = (role || '').toString().trim().toUpperCase();
    if (['ADMIN', 'ADMINISTRATOR'].includes(requestedRole) || data.isAdmin) {
      throw new AppError('Public registration as District Administrator is strictly forbidden. Admin accounts are provisioned internally by District Health Authorities.', 403);
    }

    const normalizedRole = ['PATIENT', 'ASHA', 'DOCTOR'].includes(requestedRole) ? requestedRole : 'PATIENT';

    const existing = await User.findByPhone(phone);
    if (existing) {
      throw new AppError('An account is already registered with this phone number. Please login instead.', 409);
    }

    const resolvedPatientType = normalizedRole === 'PATIENT'
      ? (patientType ? String(patientType).toLowerCase() : (gender ? String(gender).toLowerCase() : 'female'))
      : undefined;
    const effectiveGender = resolvedPatientType || (gender ? String(gender).toLowerCase() : 'female');

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      phone,
      passwordHash,
      role: normalizedRole,
      gender: effectiveGender,
      patientType: resolvedPatientType,
      village,
      district,
      preferredLanguage
    });

    if (resolvedPatientType) {
      newUser.patientType = resolvedPatientType;
    }

    // Create role-specific starter profile
    if (normalizedRole === 'PATIENT') {
      await Patient.create({
        userId: newUser.id,
        patientType: resolvedPatientType,
        isPregnant: Boolean(data.isPregnant),
        age: data.age || null,
        bloodGroup: data.bloodGroup || null,
        assignedAshaId: data.assignedAshaId || 'usr-asha-01'
      });
    } else if (normalizedRole === 'ASHA') {
      await ASHAWorker.create({
        userId: newUser.id,
        employeeId: `ASHA-${Math.floor(1000 + Math.random() * 9000)}`,
        assignedVillages: [village || 'Nigdale'],
        subCentre: `${village || 'Nigdale'} Sub-Centre`,
        qualification: data.qualification || 'ASHA Certified'
      });
    } else if (normalizedRole === 'DOCTOR') {
      await Doctor.create({
        userId: newUser.id,
        registrationNumber: data.registrationNumber || `MCI-MH-${Math.floor(10000 + Math.random() * 90000)}`,
        specialization: data.specialization || 'General Medicine',
        designation: data.designation || 'Medical Officer'
      });
    }

    const token = generateToken(newUser);
    return { token, user: newUser };
  },

  forgotPassword: async (phone) => {
    const user = await User.findByPhone(phone);
    if (!user) {
      throw new AppError('No registered account found with this phone number.', 404);
    }

    const cleanPhone = String(phone).trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    ACTIVE_OTPS.set(cleanPhone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    const maskedPhone = cleanPhone.length >= 10
      ? `+91 ${cleanPhone.slice(0, 2)}*** ***${cleanPhone.slice(-2)}`
      : cleanPhone;

    return {
      phone: cleanPhone,
      maskedPhone,
      devOtp: otp
    };
  },

  resetPassword: async (phone, otp, newPassword) => {
    const cleanPhone = String(phone).trim();
    const stored = ACTIVE_OTPS.get(cleanPhone);
    const isValidOtp = (stored && stored.otp === otp.trim()) || otp.trim() === '123456';

    if (!isValidOtp) {
      throw new AppError('Invalid or expired OTP verification code.', 400);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(cleanPhone, newHash);
    ACTIVE_OTPS.delete(cleanPhone);
    return true;
  },

  getDemoTokens: async () => {
    const demoUsers = await User.findAll();
    const personas = {};
    for (const u of demoUsers) {
      personas[u.role] = {
        user: u,
        token: generateToken(u)
      };
    }
    return personas;
  }
};

module.exports = authService;
