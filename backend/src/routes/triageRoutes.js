const express = require('express');
const router = express.Router();
const triageController = require('../controllers/triageController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTriage } = require('../middleware/validateMiddleware');

router.post('/assess', validateTriage, triageController.assessTriage);
router.get('/history/:patientId', authMiddleware, triageController.getTriageHistory);

module.exports = router;
