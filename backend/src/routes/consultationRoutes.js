const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateConsultation } = require('../middleware/validateMiddleware');

router.use(authMiddleware);

router.post('/', validateConsultation, consultationController.createConsultation);
router.get('/', consultationController.getMyConsultations);
router.get('/all', authorizeRoles('ADMIN', 'DOCTOR'), consultationController.listConsultations);
router.get('/:id', consultationController.getConsultationById);
router.patch('/:id/complete', authorizeRoles('DOCTOR'), consultationController.completeConsultation);

module.exports = router;
