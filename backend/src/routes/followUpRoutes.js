const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateFollowUp } = require('../middleware/validateMiddleware');

router.use(authMiddleware);

router.post('/', authorizeRoles('ASHA', 'DOCTOR', 'ADMIN'), validateFollowUp, followUpController.createFollowUp);
router.get('/', followUpController.getMyFollowUps);
router.get('/:id', followUpController.getFollowUpById);
router.patch('/:id/status', followUpController.updateFollowUpStatus);

module.exports = router;
