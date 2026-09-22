const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { success } = require('../utils/apiResponse');

// Sub-routers
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const ashaRoutes = require('./ashaRoutes');
const doctorRoutes = require('./doctorRoutes');
const adminRoutes = require('./adminRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const consultationRoutes = require('./consultationRoutes');
const healthRecordRoutes = require('./healthRecordRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const medicineRoutes = require('./medicineRoutes');
const diagnosticRoutes = require('./diagnosticRoutes');
const facilityRoutes = require('./facilityRoutes');
const notificationRoutes = require('./notificationRoutes');
const referralRoutes = require('./referralRoutes');
const followUpRoutes = require('./followUpRoutes');
const photoCaseRoutes = require('./photoCaseRoutes');
const triageRoutes = require('./triageRoutes');
const syncRoutes = require('./syncRoutes');

// 1. Health Check
router.get('/health', (req, res) => {
  return success(res, {
    status: 'ONLINE',
    service: 'AarogyaSync Rural Healthcare Backend API',
    databaseConnected: db.getIsConnected(),
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString()
  }, 'AarogyaSync API is operational');
});

// 2. Mount Domain Sub-Routers
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/asha', ashaRoutes);
router.use('/doctor', doctorRoutes);
router.use('/admin', adminRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/consultations', consultationRoutes);
router.use('/health-records', healthRecordRoutes);
router.use('/facilities', facilityRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/medicines', medicineRoutes);
router.use('/diagnostics', diagnosticRoutes);
router.use('/notifications', notificationRoutes);
router.use('/referrals', referralRoutes);
router.use('/follow-ups', followUpRoutes);
router.use('/photo-cases', photoCaseRoutes);
router.use('/triage', triageRoutes);
router.use('/sync', syncRoutes);

module.exports = router;
