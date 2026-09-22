const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/', healthRecordController.createRecord);
router.get('/', healthRecordController.getMyRecords);
router.get('/patient/:patientId', authorizeRoles('ASHA', 'DOCTOR', 'ADMIN'), healthRecordController.getRecordsByPatientId);
router.get('/:id', healthRecordController.getRecordById);
router.delete('/:id', healthRecordController.deleteRecord);

module.exports = router;
