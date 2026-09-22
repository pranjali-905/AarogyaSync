const express = require('express');
const router = express.Router();
const photoCaseController = require('../controllers/photoCaseController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validatePhotoCase } = require('../middleware/validateMiddleware');

router.use(authMiddleware);

router.post('/', validatePhotoCase, photoCaseController.createCase);
router.get('/', photoCaseController.getMyCases);
router.get('/all', authorizeRoles('DOCTOR', 'ADMIN'), photoCaseController.listCases);
router.get('/:id', photoCaseController.getCaseById);
router.patch('/:id/review', authorizeRoles('DOCTOR', 'ADMIN'), photoCaseController.reviewCase);

module.exports = router;
