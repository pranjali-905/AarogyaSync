const authService = require('../services/authService');
const { success } = require('../utils/apiResponse');

const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const result = await authService.login(phone, password);
    return success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 'Registration successful! Account created.', 201);
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await authService.forgotPassword(phone);
    return success(res, result, `OTP verification code dispatched to ${result.maskedPhone}`);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { phone, otp, newPassword } = req.body;
    await authService.resetPassword(phone, otp, newPassword);
    return success(res, null, 'Password has been successfully updated. You can now login.');
  } catch (err) {
    next(err);
  }
};

const getDemoTokens = async (req, res, next) => {
  try {
    const personas = await authService.getDemoTokens();
    return success(res, personas, 'Demo personas retrieved');
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    return success(res, { user: req.user }, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getDemoTokens,
  getProfile
};
