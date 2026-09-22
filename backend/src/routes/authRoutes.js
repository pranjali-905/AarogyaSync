const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateLogin, validateRegister } = require('../middleware/validateMiddleware');

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/demo-tokens', authController.getDemoTokens);
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
