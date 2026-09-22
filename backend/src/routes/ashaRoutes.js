const express = require('express');
const router = express.Router();
const ashaController = require('../controllers/ashaController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(authorizeRoles('ASHA', 'ADMIN'));

router.get('/profile', ashaController.getProfile);
router.get('/patients', ashaController.getPatients);
router.post('/register-patient', ashaController.registerPatient);
router.post('/record-visit', ashaController.recordVisit);
router.get('/priority-cases', ashaController.getPriorityCases);
router.get('/performance', ashaController.getPerformance);

module.exports = router;
