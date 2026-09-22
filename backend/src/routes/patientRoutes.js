const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Patient self-access
router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);
router.get('/vitals', patientController.getVitals);
router.get('/maternal', patientController.getMaternalCare);
router.get('/child-records', patientController.getChildRecords);

// Authorized healthcare worker access to specific patient records
router.get('/:id', authorizeRoles('ASHA', 'DOCTOR', 'ADMIN'), patientController.getProfile);
router.get('/:id/vitals', authorizeRoles('ASHA', 'DOCTOR', 'ADMIN'), patientController.getVitals);
router.get('/:id/maternal', authorizeRoles('ASHA', 'DOCTOR', 'ADMIN'), patientController.getMaternalCare);
router.get('/:id/child-records', authorizeRoles('ASHA', 'DOCTOR', 'ADMIN'), patientController.getChildRecords);

module.exports = router;
