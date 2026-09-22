const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(authorizeRoles('ADMIN'));

router.get('/overview', adminController.getOverview);
router.get('/citizens', adminController.getCitizens);
router.get('/workforce', adminController.getWorkforce);
router.patch('/workforce/:id/verify', adminController.updateWorkforceStatus);
router.get('/facilities', adminController.getFacilities);
router.get('/analytics', adminController.getAnalytics);
router.get('/surveillance', adminController.getSurveillance);
router.get('/referrals', adminController.getReferrals);
router.get('/reports/export', adminController.exportReports);

module.exports = router;
