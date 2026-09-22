const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validatePrescription } = require('../middleware/validateMiddleware');

router.use(authMiddleware);
router.use(authorizeRoles('DOCTOR', 'ADMIN'));

router.get('/profile', doctorController.getProfile);
router.get('/queue', doctorController.getQueue);
router.get('/schedule', doctorController.getSchedule);
router.get('/treatment-tracking', doctorController.getTreatmentTracking);
router.post('/prescriptions', validatePrescription, doctorController.issuePrescription);

module.exports = router;
