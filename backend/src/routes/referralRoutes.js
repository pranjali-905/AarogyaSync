const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateReferral } = require('../middleware/validateMiddleware');

router.use(authMiddleware);

router.post('/', authorizeRoles('ASHA', 'DOCTOR', 'ADMIN'), validateReferral, referralController.createReferral);
router.get('/', referralController.getMyReferrals);
router.get('/all', authorizeRoles('DOCTOR', 'ADMIN'), referralController.listAllReferrals);
router.get('/:id', referralController.getReferralById);
router.patch('/:id/status', authorizeRoles('DOCTOR', 'ADMIN'), referralController.updateReferralStatus);

module.exports = router;
